'use strict';

// Deterministic check for Race 1 / WL normal using the RC bearings supplied.
// Run with: node race1-simulation.js

var PIN_PORT_DISTANCE_NM = 100 / 1852;
var FIN_STBD_DISTANCE_NM = 50 / 1852;
var COM = { code: 'COM', lat: 50.66667, lon: -1.89500 };
var WIND_DIR = 180;
var TACK_ANGLE = 42;

var marks = {
  COM: COM,
  PIN: destinationPoint(COM, normalize(WIND_DIR - 90), PIN_PORT_DISTANCE_NM),
  FIN: destinationPoint(COM, normalize(WIND_DIR + 90), FIN_STBD_DISTANCE_NM),
  '3': destinationPoint(COM, 180, 0.8),
  '3A': destinationPoint(COM, 160, 0.8),
  '4S': destinationPoint(COM, 200, 0.2),
  '4P': destinationPoint(COM, 140, 0.2)
};

Object.keys(marks).forEach(function (code) {
  marks[code].code = code;
});

var startTarget = startMidpoint();
var boat = destinationPoint(startTarget, 0, 0.4);
boat.code = 'BOAT';
var nearestStart = startLineTargetForBoat(boat);
var sequence = [
  { code: 'START', rounding: 'line' },
  { code: '3', rounding: 'port' },
  { code: '3A', rounding: 'port' },
  { code: '4S/4P', rounding: 'gate' },
  { code: '3', rounding: 'port' },
  { code: '3A', rounding: 'port' },
  { code: '4S/4P', rounding: 'gate' },
  { code: 'FIN', rounding: 'finish' }
];

var currentNav = navNumbers(boat, nearestStart);
var firstMarkNav = navNumbers(boat, marks['3']);
var gateCallFrom3A = gateRecommendation(marks['3A'], marks['3']);
var startLineBearing = bearingTo(marks.PIN, marks.COM);
var compassHeading = Math.round(currentNav.bearing);
var markRelative = relativeAngleLabel(signedAngle(currentNav.bearing - compassHeading));

console.log('Race 1 WL normal simulation');
console.log('COM: ' + coord(marks.COM));
console.log('PIN: ' + coord(marks.PIN) + ' (100m port of RC)');
console.log('FIN: ' + coord(marks.FIN) + ' (50m starboard of RC)');
console.log('Line bearing PIN->COM: ' + Math.round(startLineBearing) + ' deg');
console.log('Sequence: ' + sequence.map(function (entry) { return entry.code; }).join(' -> '));
console.log('Boat: ' + coord(boat) + ' (0.40nm north of start line midpoint)');
console.log('Current nav target: START LINE');
console.log('Boat -> nearest start line: ' + Math.round(currentNav.bearing) + ' deg / ' + currentNav.distance.toFixed(2) + 'nm');
console.log('Compass check with phone pointed at start: mark arrow ' + markRelative);
console.log('Boat -> mark 3 after start: ' + Math.round(firstMarkNav.bearing) + ' deg / ' + firstMarkNav.distance.toFixed(2) + 'nm');
console.log('Upwind laylines from forecast TWD 180: port ' + navNumbers(boat, marks['3']).port + ' deg, stbd ' + navNumbers(boat, marks['3']).stbd + ' deg');
console.log('Gate from 3A: ' + gateCallFrom3A.call + ' (' + gateCallFrom3A.deltaM + 'm split including exit to next 3)');
console.log('4P approach/exit/total: ' + gateCallFrom3A.port.approach.toFixed(2) + '/' + gateCallFrom3A.port.exit.toFixed(2) + '/' + gateCallFrom3A.port.total.toFixed(2) + 'nm');
console.log('4S approach/exit/total: ' + gateCallFrom3A.stbd.approach.toFixed(2) + '/' + gateCallFrom3A.stbd.exit.toFixed(2) + '/' + gateCallFrom3A.stbd.total.toFixed(2) + 'nm');

function startMidpoint() {
  return {
    code: 'START',
    lat: (marks.PIN.lat + marks.COM.lat) / 2,
    lon: (marks.PIN.lon + marks.COM.lon) / 2
  };
}

function startLineTargetForBoat(boatPosition) {
  var originLat = (marks.PIN.lat + marks.COM.lat + boatPosition.lat) / 3;
  var p = localNmPoint(marks.PIN, originLat);
  var c = localNmPoint(marks.COM, originLat);
  var b = localNmPoint(boatPosition, originLat);
  var vx = c.x - p.x;
  var vy = c.y - p.y;
  var wx = b.x - p.x;
  var wy = b.y - p.y;
  var len2 = vx * vx + vy * vy;
  var t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / len2));
  return localNmToMark({ x: p.x + t * vx, y: p.y + t * vy }, originLat, 'START');
}

function navNumbers(from, to) {
  var bearing = bearingTo(from, to);
  return {
    bearing: bearing,
    distance: distanceNm(from, to),
    port: Math.round(normalize(WIND_DIR + TACK_ANGLE)),
    stbd: Math.round(normalize(WIND_DIR - TACK_ANGLE))
  };
}

function gateRecommendation(from, nextMark) {
  var port = gateScore(marks['4P'], from, nextMark);
  var stbd = gateScore(marks['4S'], from, nextMark);
  var preferred = port.total <= stbd.total ? '4P' : '4S';
  var deltaM = Math.round(Math.abs(port.total - stbd.total) * 1852);
  var call = deltaM < 20 ? 'even gate, choose cleanest exit' : 'favour ' + preferred;
  return { preferred: preferred, deltaM: deltaM, call: call, port: port, stbd: stbd };
}

function gateScore(mark, from, nextMark) {
  var approach = distanceNm(from, mark);
  var exit = distanceNm(mark, nextMark);
  return { approach: approach, exit: exit, total: approach + exit };
}

function coord(point) {
  return Number(point.lat).toFixed(5) + ', ' + Number(point.lon).toFixed(5);
}

function localNmPoint(mark, originLat) {
  return {
    x: Number(mark.lon) * 60 * Math.cos(toRad(originLat)),
    y: Number(mark.lat) * 60
  };
}

function localNmToMark(point, originLat, code) {
  var lonScale = 60 * Math.cos(toRad(originLat));
  return {
    code: code,
    lat: point.y / 60,
    lon: lonScale ? point.x / lonScale : 0
  };
}

function relativeAngleLabel(angle) {
  var rounded = Math.round(signedAngle(angle));
  if (Math.abs(rounded) <= 2) return 'AHEAD';
  if (Math.abs(Math.abs(rounded) - 180) <= 2) return 'ASTERN';
  return Math.abs(rounded) + ' deg ' + (rounded < 0 ? 'L' : 'R');
}

function bearingTo(from, to) {
  var lat1 = toRad(Number(from.lat));
  var lat2 = toRad(Number(to.lat));
  var dLon = toRad(Number(to.lon) - Number(from.lon));
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return normalize(toDeg(Math.atan2(y, x)));
}

function distanceNm(from, to) {
  var radiusNm = 3440.065;
  var lat1 = toRad(Number(from.lat));
  var lat2 = toRad(Number(to.lat));
  var dLat = toRad(Number(to.lat) - Number(from.lat));
  var dLon = toRad(Number(to.lon) - Number(from.lon));
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return radiusNm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function destinationPoint(from, bearing, distanceNmValue) {
  var radiusNm = 3440.065;
  var angularDistance = distanceNmValue / radiusNm;
  var brng = toRad(bearing);
  var lat1 = toRad(Number(from.lat));
  var lon1 = toRad(Number(from.lon));
  var lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
    Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(brng)
  );
  var lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(angularDistance) * Math.cos(lat1),
    Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
  );

  return {
    lat: toDeg(lat2),
    lon: ((toDeg(lon2) + 540) % 360) - 180
  };
}

function normalize(angle) {
  return ((angle % 360) + 360) % 360;
}

function signedAngle(angle) {
  return ((angle + 540) % 360) - 180;
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function toDeg(radians) {
  return radians * 180 / Math.PI;
}
