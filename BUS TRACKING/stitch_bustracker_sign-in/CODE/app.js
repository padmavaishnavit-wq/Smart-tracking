// Simple shared app utilities for demo auth and live map updates
;(function () {
  var AUTH_KEY = 'bt_auth';

  function isAuthed() {
    try {
      return window.localStorage.getItem(AUTH_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function signIn() {
    try {
      window.localStorage.setItem(AUTH_KEY, '1');
    } catch (e) {}
  }

  function signOut() {
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
    window.location.href = 'SIGNIN.html';
  }

  function requireAuth() {
    if (!isAuthed()) {
      window.location.href = 'SIGNIN.html';
      return false;
    }
    return true;
  }

  function attachSignOutHandler() {
    var link = document.getElementById('signout-link');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        signOut();
      });
    }
  }

  // --- Profile storage ---
  var PROFILE_KEY = 'bt_profile';
  function getProfile() {
    try {
      var raw = window.localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
  function saveProfile(profile) {
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile || {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- Mock bus data and live updates ---
  function generateMockBuses(center, count) {
    var results = [];
    for (var i = 0; i < count; i++) {
      var lat = center[0] + (Math.random() - 0.5) * 0.1;
      var lng = center[1] + (Math.random() - 0.5) * 0.1;
      results.push({ id: 'bus-' + i, lat: lat, lng: lng, route: 100 + i });
    }
    return results;
  }

  function nudge(value) {
    var delta = (Math.random() - 0.5) * 0.0025;
    return value + delta;
  }

  function initDashboard() {
    var mapEl = document.getElementById('map-dashboard');
    if (!mapEl || typeof L === 'undefined') return;
    var center = [11.1085, 77.3411]; // Tiruppur, Tamil Nadu
    var map = L.map(mapEl).setView(center, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var buses = generateMockBuses(center, 8);
    var markersById = {};
    buses.forEach(function (b) {
      markersById[b.id] = L.marker([b.lat, b.lng]).addTo(map).bindPopup('Route ' + b.route);
    });

    setInterval(function () {
      buses.forEach(function (b) {
        b.lat = nudge(b.lat);
        b.lng = nudge(b.lng);
        var m = markersById[b.id];
        if (m) m.setLatLng([b.lat, b.lng]);
      });
    }, 4000);
  }

  function initRoutesMap() {
    var mapEl = document.getElementById('map-routes');
    if (!mapEl || typeof L === 'undefined') return;
    var center = [11.1085, 77.3411]; // Tiruppur, Tamil Nadu
    var map = L.map(mapEl).setView(center, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Draw a simple mock route polyline
    var points = [
      [11.1200, 77.3200],
      [11.1150, 77.3300],
      [11.1100, 77.3400],
      [11.1050, 77.3500],
      [11.1000, 77.3600]
    ];
    L.polyline(points, { color: '#0d80f2', weight: 4 }).addTo(map);
  }

  function initBusDetails() {
    var mapEl = document.getElementById('map-bus-details');
    if (!mapEl || typeof L === 'undefined') return;
    var center = [11.1085, 77.3411]; // Tiruppur, Tamil Nadu
    var map = L.map(mapEl).setView(center, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    var marker = L.marker(center).addTo(map).bindPopup('Bus 12345');
    setInterval(function () {
      var latlng = marker.getLatLng();
      marker.setLatLng([nudge(latlng.lat), nudge(latlng.lng)]);
    }, 5000);
  }

  window.App = {
    isAuthed: isAuthed,
    signIn: signIn,
    signOut: signOut,
    requireAuth: requireAuth,
    attachSignOutHandler: attachSignOutHandler,
    getProfile: getProfile,
    saveProfile: saveProfile,
    initDashboard: initDashboard,
    initRoutesMap: initRoutesMap,
    initBusDetails: initBusDetails
  };
})();


