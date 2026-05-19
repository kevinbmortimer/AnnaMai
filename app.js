(function () {
  'use strict';

  var STORE_KEY = 'raceBridge.ircEuropeans2026.v3';
  var APP_VERSION = '0.7.3';
  var APP_BUILD = '2026-05-18';
  var CACHE_NAME = 'anna-mai-v27';
  var gpsWatchId = null;
  var compassWatchActive = false;
  var compassLastSave = 0;
  var BOAT = {
    name: 'Anna Mai',
    type: 'Swan 36',
    handicap: '0.892',
    className: 'IRC3',
    classFlag: 'IC numeral 3'
  };

  var RACE_AREA = {
    latitude: 50.6667,
    longitude: -1.895,
    label: 'RED course area, approx 50 40.00N 001 53.70W'
  };

  var CORE_MARKS = ['COM', 'PIN', '3', '3A', '4S', '4P', 'FIN', 'B', 'C', 'D', 'E', 'F', 'I', 'K', 'N', 'O', 'Q', 'S', 'U', 'V', 'W'];

  var RACES = [
    { id: 'R1', day: 'Friday 22 May', date: '2026-05-22', apiTime: '11:48', firstWarning: '11:25', annaMaiWarning: '11:43', annaMaiStart: '11:48', slot: 'Daily race 1', tideKey: 'fri' },
    { id: 'R2', day: 'Friday 22 May', date: '2026-05-22', apiTime: '13:15', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'fri' },
    { id: 'R3', day: 'Friday 22 May', date: '2026-05-22', apiTime: '14:45', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'fri' },
    { id: 'R4', day: 'Saturday 23 May', date: '2026-05-23', apiTime: '10:48', firstWarning: '10:25', annaMaiWarning: '10:43', annaMaiStart: '10:48', slot: 'Daily race 1', tideKey: 'sat' },
    { id: 'R5', day: 'Saturday 23 May', date: '2026-05-23', apiTime: '12:15', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'sat' },
    { id: 'R6', day: 'Saturday 23 May', date: '2026-05-23', apiTime: '13:45', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'sat' },
    { id: 'R7', day: 'Sunday 24 May', date: '2026-05-24', apiTime: '10:48', firstWarning: '10:25', annaMaiWarning: '10:43', annaMaiStart: '10:48', slot: 'Daily race 1', tideKey: 'sun' },
    { id: 'R8', day: 'Sunday 24 May', date: '2026-05-24', apiTime: '12:15', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'sun' },
    { id: 'R9', day: 'Sunday 24 May', date: '2026-05-24', apiTime: '13:45', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'sun' },
    { id: 'R10', day: 'Monday 25 May', date: '2026-05-25', apiTime: '10:48', firstWarning: '10:25', annaMaiWarning: '10:43', annaMaiStart: '10:48', slot: 'Daily race 1', tideKey: 'mon' },
    { id: 'R11', day: 'Monday 25 May', date: '2026-05-25', apiTime: '12:15', firstWarning: 'Back-to-back', annaMaiWarning: 'TBC', annaMaiStart: 'TBC', slot: 'Additional race', tideKey: 'mon' }
  ];

  var TIDES = {
    fri: [
      ['00:19', '2.0m'],
      ['08:14', '0.7m'],
      ['13:22', '1.8m'],
      ['20:53', '1.2m']
    ],
    sat: [
      ['00:45', '1.9m'],
      ['09:17', '0.8m'],
      ['18:29', '2.1m'],
      ['21:59', '1.2m']
    ],
    sun: [
      ['01:27', '1.8m'],
      ['10:22', '0.9m'],
      ['19:27', '2.1m'],
      ['23:02', '1.2m']
    ],
    mon: [
      ['02:25', '1.7m'],
      ['11:24', '0.9m'],
      ['20:26', '2.1m']
    ]
  };

  var POLAR_SOURCE = 'ORC certificate 03510001T3K UPOARS 2022 baseline';
  var POLAR_SEED = {
    upwind: [
      { tws: 6, speed: 4.44, angle: 43 },
      { tws: 8, speed: 5.19, angle: 41 },
      { tws: 10, speed: 5.92, angle: 41 },
      { tws: 12, speed: 6.35, angle: 40 },
      { tws: 14, speed: 6.53, angle: 39 },
      { tws: 16, speed: 6.62, angle: 38 },
      { tws: 20, speed: 6.68, angle: 38 }
    ],
    downwind: [
      { tws: 6, speed: 4.20, angle: 146 },
      { tws: 8, speed: 5.04, angle: 151 },
      { tws: 10, speed: 5.89, angle: 152 },
      { tws: 12, speed: 6.50, angle: 156 },
      { tws: 14, speed: 6.71, angle: 166 },
      { tws: 16, speed: 7.03, angle: 177 },
      { tws: 20, speed: 7.65, angle: 179 }
    ],
    reach: [
      { tws: 6, speed: 5.45, angle: 75 },
      { tws: 8, speed: 6.46, angle: 110 },
      { tws: 10, speed: 7.12, angle: 110 },
      { tws: 12, speed: 7.49, angle: 110 },
      { tws: 14, speed: 7.80, angle: 110 },
      { tws: 16, speed: 8.11, angle: 120 },
      { tws: 20, speed: 8.72, angle: 120 }
    ]
  };

  var DEFAULT_MARKS = [
    { code: 'COM', name: 'Flair V committee vessel, SI approximate', lat: '50.66667', lon: '-1.89500', role: 'start' },
    { code: 'PIN', name: 'Outer start mark IRC1/2/3', lat: '', lon: '', role: 'start' },
    { code: '3', name: 'IRC3 windward mark, International Paint orange', lat: '', lon: '', role: 'windward' },
    { code: '3A', name: 'IRC3 offset mark, orange tetrahedron', lat: '', lon: '', role: 'windward' },
    { code: '4S', name: 'Gate starboard, orange tetrahedron', lat: '', lon: '', role: 'leeward' },
    { code: '4P', name: 'Gate port, orange tetrahedron', lat: '', lon: '', role: 'leeward' },
    { code: 'FIN', name: 'Outer finish mark, dan buoy blue flag', lat: '', lon: '', role: 'finish' },
    { code: 'B', name: 'Bar Buoy No. 1', lat: '50.65550', lon: '-1.91950', role: 'rtc' },
    { code: 'C', name: 'Boscombe Outfall Buoy', lat: '50.71483', lon: '-1.83983', role: 'rtc' },
    { code: 'D', name: 'Bournemouth Outfall Buoy', lat: '50.71000', lon: '-1.87183', role: 'rtc' },
    { code: 'E', name: 'Branksome Outfall Buoy', lat: '50.70417', lon: '-1.90517', role: 'rtc' },
    { code: 'F', name: 'Magnum', lat: '50.67183', lon: '-1.87417', role: 'rtc' },
    { code: 'I', name: 'Stoneways Insurance', lat: '50.67183', lon: '-1.90033', role: 'rtc' },
    { code: 'K', name: 'Peveril Ledge Buoy', lat: '50.60617', lon: '-1.93500', role: 'rtc' },
    { code: 'N', name: 'The Rig Shop', lat: '50.68467', lon: '-1.90433', role: 'rtc' },
    { code: 'O', name: 'Southbourne Outfall Buoy', lat: '50.71533', lon: '-1.81850', role: 'rtc' },
    { code: 'Q', name: 'Parkstone Yacht Club', lat: '50.66017', lon: '-1.92000', role: 'rtc' },
    { code: 'S', name: 'Jenkins Marine Race Mark', lat: '50.68733', lon: '-1.87783', role: 'rtc' },
    { code: 'U', name: 'Needles Fairway Buoy', lat: '50.63733', lon: '-1.64967', role: 'rtc' },
    { code: 'V', name: 'Christchurch Ledge Race Mark', lat: '50.69167', lon: '-1.69333', role: 'rtc' },
    { code: 'W', name: 'Christchurch Inshore Mark', lat: '50.70583', lon: '-1.74033', role: 'rtc' }
  ];

  var state = loadState();

  function defaultForecast(race) {
    return {
      start: race && race.annaMaiStart !== 'TBC' ? race.annaMaiStart : '',
      windDir: '',
      windSpeed: '',
      windGust: '',
      tideState: '',
      tideRate: '',
      tideDir: '',
      seaLevel: '',
      swellHeight: '',
      swellPeriod: '',
      swellDir: '',
      waveHeight: '',
      wavePeriod: '',
      waveDir: '',
      apiUpdated: '',
      apiSource: '',
      tideTimeline: [],
      notes: ''
    };
  }

  function defaultCourse() {
    return {
      type: 'wl',
      committee: 'COM',
      pin: 'PIN',
      wlCourse: 'normal',
      windward: '3',
      offset: '3A',
      gatePort: '4P',
      gateStbd: '4S',
      finish: 'FIN',
      lineBearing: '',
      boatSpeed: '5.5',
      tackAngle: '42',
      cans: []
    };
  }

  function defaultActual() {
    return {
      legIndex: 0,
      boatLat: '',
      boatLon: '',
      startTime: '',
      startEpoch: '',
      startSource: '',
      lineSpeed: '',
      gpsAccuracy: '',
      gpsSpeed: '',
      gpsCourse: '',
      gpsMode: '',
      lastFix: ''
    };
  }

  function defaultSettings() {
    return {
      apiTimes: {},
      apiProvider: 'Open-Meteo',
      refreshMinutes: '60',
      lastSettingsSaved: '',
      gpsStatus: '',
      lastGps: '',
      lastGpsLat: '',
      lastGpsLon: '',
      lastGpsTime: '',
      gpsAccuracy: '',
      gpsSpeed: '',
      gpsCourse: '',
      compassHeading: '',
      compassTime: '',
      mapZoom: '1',
      mapPanX: '',
      mapPanY: '',
      motionStatus: '',
      lastMotion: '',
      motionTime: '',
      wakeStatus: '',
      wakeTime: '',
      soundStatus: '',
      soundTime: ''
    };
  }

  function loadState() {
    var saved;
    try {
      saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch (err) {
      saved = {};
    }

    var savedRaceTab = saved.raceTab || 'plan';
    if (savedRaceTab === 'prediction') savedRaceTab = 'plan';
    if (savedRaceTab === 'actual') savedRaceTab = 'course';

    var next = {
      selectedRace: saved.selectedRace || 'R1',
      currentView: saved.currentView || 'forecast',
      raceTab: savedRaceTab,
      forecasts: saved.forecasts || {},
      courses: saved.courses || {},
      actuals: saved.actuals || {},
      settings: Object.assign(defaultSettings(), saved.settings || {}),
      polarSamples: Array.isArray(saved.polarSamples) ? saved.polarSamples : [],
      marks: Array.isArray(saved.marks) && saved.marks.length ? saved.marks : DEFAULT_MARKS.slice()
    };

    RACES.forEach(function (race) {
      next.forecasts[race.id] = Object.assign(defaultForecast(race), next.forecasts[race.id] || {});
      next.courses[race.id] = Object.assign(defaultCourse(), next.courses[race.id] || {});
      next.actuals[race.id] = Object.assign(defaultActual(), next.actuals[race.id] || {});
      if (!next.settings.apiTimes[race.id] || next.settings.apiTimes[race.id] === race.apiTime) {
        next.settings.apiTimes[race.id] = defaultApiTime(race);
      }
    });

    DEFAULT_MARKS.forEach(function (mark) {
      if (!next.marks.some(function (existing) { return existing.code === mark.code; })) {
        next.marks.push(mark);
      }
    });

    return next;
  }

  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function toNumber(value) {
    var number = parseFloat(value);
    return Number.isFinite(number) ? number : null;
  }

  function activeRaceId() {
    return state.selectedRace || 'R1';
  }

  function activeRace() {
    return RACES.find(function (race) { return race.id === activeRaceId(); }) || RACES[0];
  }

  function activeForecast() {
    return state.forecasts[activeRaceId()];
  }

  function activeCourse() {
    return state.courses[activeRaceId()];
  }

  function activeActual() {
    return state.actuals[activeRaceId()];
  }

  function activeSettings() {
    state.settings = Object.assign(defaultSettings(), state.settings || {});
    state.settings.apiTimes = state.settings.apiTimes || {};
    return state.settings;
  }

  function apiLookupTime(race) {
    var settings = activeSettings();
    return settings.apiTimes[race.id] || defaultApiTime(race);
  }

  function defaultApiTime(race) {
    if (race.firstWarning && race.firstWarning !== 'Back-to-back') {
      return addMinutes(race.firstWarning, 6);
    }
    return addMinutes(race.apiTime, -17);
  }

  function addMinutes(hhmm, minutes) {
    var match = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/);
    if (!match) return hhmm || '';
    var total = (Number(match[1]) * 60 + Number(match[2]) + minutes + 1440) % 1440;
    return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  }

  function showView(name) {
    state.currentView = name;
    saveState();

    document.querySelectorAll('.view').forEach(function (view) {
      view.classList.toggle('active', view.id === 'v-' + name);
    });

    document.querySelectorAll('#nav .nt').forEach(function (tab) {
      var onclick = tab.getAttribute('onclick') || '';
      tab.classList.toggle('active', onclick.indexOf("'" + name + "'") !== -1);
    });

    var scroller = byId('views');
    if (scroller) scroller.scrollTop = 0;

    renderCurrentView();
  }

  function renderCurrentView() {
    if (state.currentView === 'marks') renderMarks();
    else if (state.currentView === 'race') renderRace();
    else if (state.currentView === 'settings') renderSettings();
    else renderForecast();
    updateTimestamp();
  }

  function selectRace(raceId) {
    state.selectedRace = raceId;
    saveState();
    renderCurrentView();
  }

  function raceStrip() {
    return '<div class="race-strip">' + RACES.map(function (race) {
      var label = state.forecasts[race.id].start || race.annaMaiStart || 'TBC';
      return '<div class="rp ' + (race.id === activeRaceId() ? 'active' : '') + '" style="border-color:rgba(212,160,23,.35)" onclick="selectRace(\'' + race.id + '\')">' +
        '<div class="rp-n">' + race.id + '</div>' +
        '<div class="rp-t">' + esc(label) + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function card(title, body, right) {
    return '<div class="card"><div class="ct">' + title + (right ? '<span class="ct-r">' + right + '</span>' : '') + '</div>' + body + '</div>';
  }

  function row(label, control) {
    return '<div class="input-row"><label>' + label + '</label>' + control + '</div>';
  }

  function input(id, value, placeholder, type, attrs) {
    return '<input id="' + id + '" type="' + (type || 'text') + '" value="' + esc(value) + '" placeholder="' + esc(placeholder || '') + '" ' + (attrs || '') + '/>';
  }

  function select(id, value, options) {
    return '<select id="' + id + '">' + options.map(function (option) {
      var selected = String(option.value) === String(value) ? ' selected' : '';
      return '<option value="' + esc(option.value) + '"' + selected + '>' + esc(option.label) + '</option>';
    }).join('') + '</select>';
  }

  function markOptions(selected, includeBlank) {
    var options = includeBlank ? [{ value: '', label: 'Not set' }] : [];
    state.marks.forEach(function (mark) {
      options.push({ value: mark.code, label: mark.code + ' - ' + mark.name });
    });
    return select('', selected, options).replace('<select id="">', '<select>');
  }

  function markSelect(id, selected, includeBlank) {
    return markOptions(selected, includeBlank).replace('<select>', '<select id="' + id + '">');
  }

  function renderForecast() {
    var raceId = activeRaceId();
    var race = activeRace();
    var forecast = activeForecast();
    var summary = forecastSummary(forecast);

    byId('v-forecast').innerHTML = raceStrip() +
      card(raceId + ' Forecast', summary, BOAT.name + ' / ' + BOAT.className) +
      racePlanCard(race) +
      card('Forecast Source',
        '<div class="api-note" id="api-status">Wind, tide, swell and notes are managed in Settings. Values shown here feed the Race tab for ' + BOAT.name + ', ' + BOAT.type + ', ' + BOAT.className + '.</div>'
      );
  }

  function apiFetchCard() {
    var forecast = activeForecast();
    var last = forecast.apiUpdated ? 'Last API update: ' + forecast.apiUpdated : 'No API forecast loaded yet';
    return card('API Forecast',
      '<div class="ctrl-row">' +
        '<div class="ctrl go-btn" onclick="fetchForecastApi()">FETCH<br>ALL RACES</div>' +
        '<div class="ctrl set" onclick="saveForecast()">SAVE<br>MANUAL</div>' +
      '</div>' +
      '<div class="api-note" id="api-status">' + esc(last) + '. Uses Open-Meteo wind plus marine wave/current model at the RED course area and the Class 1 warning times in Settings.</div>'
    );
  }

  function forecastEditorCard() {
    var race = activeRace();
    var forecast = activeForecast();
    return card(activeRaceId() + ' Wind / Tide Forecast',
      row('Start', input('fc-start', forecast.start, race.annaMaiStart === 'TBC' ? 'TBC / B2B' : race.annaMaiStart)) +
      row('Wind dir', input('fc-wind-dir', forecast.windDir, 'degrees true', 'number', 'min="0" max="359" inputmode="numeric"')) +
      row('Wind', input('fc-wind-speed', forecast.windSpeed, 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Gust', input('fc-wind-gust', forecast.windGust, 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Tide', select('fc-tide-state', forecast.tideState, [
        { value: '', label: 'Not set' },
        { value: 'Flood', label: 'Flood' },
        { value: 'Ebb', label: 'Ebb' },
        { value: 'Slack', label: 'Slack' },
        { value: 'E set', label: 'E set' },
        { value: 'W set', label: 'W set' },
        { value: 'Current', label: 'Current' }
      ])) +
      row('Tide rate', input('fc-tide-rate', forecast.tideRate, 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Tide dir', input('fc-tide-dir', forecast.tideDir, 'degrees flowing to', 'number', 'min="0" max="359" inputmode="numeric"')) +
      row('Swell ht', input('fc-swell-height', forecast.swellHeight, 'metres', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Swell per', input('fc-swell-period', forecast.swellPeriod, 'seconds', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Swell dir', input('fc-swell-dir', forecast.swellDir, 'degrees from', 'number', 'min="0" max="359" inputmode="numeric"')) +
      row('Notes', input('fc-notes', forecast.notes, 'race briefing notes')) +
      '<button class="btn-full" onclick="saveForecast()">SAVE FORECAST</button>' +
      '<div class="api-note">These values drive Race Plan, Start and Course tactical calls.</div>',
      BOAT.name + ' / ' + BOAT.className
    );
  }

  function racePlanCard(race) {
    var tide = tideStrip(race.tideKey);
    return card('Programme',
      '<div class="stat-row">' +
        statCell('Day', race.day, race.slot) +
        statCell('First warn', race.firstWarning, 'all classes') +
        statCell('IRC3 warn', race.annaMaiWarning, 'earliest') +
        statCell('IRC3 start', race.annaMaiStart, 'earliest') +
        statCell('Class 1 warn', apiLookupTime(race), race.annaMaiStart === 'TBC' ? 'estimate' : 'warning') +
      '</div>' +
      '<div class="tide-events">' + tide + '</div>' +
      '<div class="api-note">RC course intentions by 08:30 on WhatsApp. VHF 77 is the primary race channel; Flag O switches to VHF 6.</div>',
      'SI 6 / Appendix B'
    );
  }

  function renderSettings() {
    var settings = activeSettings();
    var scheduleRows = RACES.map(function (race) {
      return row(race.id + ' C1 warn', input('set-api-' + race.id, apiLookupTime(race), 'HH:MM', 'time'));
    }).join('');

    byId('v-settings').innerHTML = raceStrip() +
      iphonePermissionsCard(settings) +
      apiFetchCard() +
      forecastEditorCard() +
      card('API Schedule',
        scheduleRows +
        row('Refresh note', input('set-refresh-minutes', settings.refreshMinutes, 'minutes', 'number', 'step="5" inputmode="numeric"')) +
        row('Provider', select('set-api-provider', settings.apiProvider, [
          { value: 'Open-Meteo', label: 'Open-Meteo' }
        ])) +
        '<button class="btn-full" onclick="saveSettings()">SAVE SETTINGS</button>' +
        '<div class="api-note">Forecast and tide API samples are taken from the Class 1 warning signal. First races use first warning + 6 min; back-to-back races use the estimated IRC3 start minus 17 min.</div>',
        settings.lastSettingsSaved || 'not saved'
      ) +
      actualLogCard(activeRace()) +
      card('Version',
        '<div class="version-list">' +
          versionRow('App', APP_VERSION) +
          versionRow('Build', APP_BUILD) +
          versionRow('Storage', STORE_KEY) +
          versionRow('Cache', CACHE_NAME) +
          versionRow('Forecast API', 'api.open-meteo.com') +
          versionRow('Marine API', 'marine-api.open-meteo.com') +
          versionRow('Polar', POLAR_SOURCE) +
        '</div>'
      );
  }

  function iphonePermissionsCard(settings) {
    return card('iPhone Permissions',
      '<div class="stat-row">' +
        statCell('GPS', settings.gpsStatus || 'Not checked', settings.lastGpsTime || 'tap request') +
        statCell('Last fix', settings.lastGps || '--', settings.gpsAccuracy || 'settings test') +
        statCell('SOG / COG', gpsMotionLabel(settings), 'from location') +
        statCell('Compass', settings.compassHeading ? settings.compassHeading + ' deg' : settings.motionStatus || 'Not checked', settings.compassTime || settings.lastMotion || 'phone bearing') +
        statCell('Awake', settings.wakeStatus || 'Not checked', settings.wakeTime || 'screen lock') +
        statCell('Sound', settings.soundStatus || 'Not checked', settings.soundTime || 'countdown alerts') +
      '</div>' +
      '<div class="ctrl-row">' +
        '<div class="ctrl go-btn" onclick="requestGpsPermission()">GPS<br>FIX</div>' +
        '<div class="ctrl sync" onclick="toggleLiveGps()">LIVE<br>GPS</div>' +
        '<div class="ctrl set" onclick="requestMotionPermission()">MOTION<br>COMPASS</div>' +
      '</div>' +
      '<div class="ctrl-row">' +
        '<div class="ctrl sync" onclick="requestWakeLock()">KEEP<br>AWAKE</div>' +
        '<div class="ctrl set" onclick="requestSoundPermission()">SOUND<br>HAPTIC</div>' +
      '</div>',
      'iOS prompt'
    );
  }

  function versionRow(label, value) {
    return '<div class="version-row"><span>' + esc(label) + '</span><span>' + esc(value) + '</span></div>';
  }

  function gpsMotionLabel(settings) {
    var parts = [];
    if (settings.gpsSpeed) parts.push(settings.gpsSpeed);
    if (settings.gpsCourse) parts.push(settings.gpsCourse);
    return parts.length ? parts.join(' / ') : '--';
  }

  function saveSettings() {
    var settings = activeSettings();
    RACES.forEach(function (race) {
      settings.apiTimes[race.id] = valueOf('set-api-' + race.id) || defaultApiTime(race);
    });
    settings.refreshMinutes = valueOf('set-refresh-minutes') || settings.refreshMinutes;
    settings.apiProvider = valueOf('set-api-provider') || settings.apiProvider;
    settings.lastSettingsSaved = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    saveState();
    renderSettings();
  }

  function requestGpsPermission() {
    if (!navigator.geolocation) {
      activeSettings().gpsStatus = 'Unavailable';
      saveState();
      renderSettings();
      flash('GPS is not available in this WebView.');
      return;
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      storeGpsPosition(position, 'settings');
    }, function (err) {
      var settings = activeSettings();
      settings.gpsStatus = err.code === 1 ? 'Denied' : 'Failed';
      settings.lastGpsTime = err.message;
      saveState();
      renderSettings();
      flash('GPS permission failed: ' + err.message);
    }, { enableHighAccuracy: true, timeout: 10000 });
  }

  function requestMotionPermission() {
    Promise.all([
      sensorPermission('DeviceMotionEvent'),
      sensorPermission('DeviceOrientationEvent')
    ]).then(function (results) {
      var denied = results.some(function (result) { return result === 'denied'; });
      var unavailable = results.every(function (result) { return result === 'unavailable'; });
      var settings = activeSettings();
      if (denied) {
        settings.motionStatus = 'Denied';
        settings.lastMotion = 'iOS blocked sensor access';
        settings.motionTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        saveState();
        renderSettings();
        return;
      }
      if (unavailable) {
        settings.motionStatus = 'Unavailable';
        settings.lastMotion = 'needs native/WebKit support';
        settings.motionTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        saveState();
        renderSettings();
        return;
      }

      settings.motionStatus = 'Listening';
      settings.lastMotion = 'move phone to sample';
      settings.motionTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      saveState();
      renderSettings();
      startCompassWatch();
      listenForMotionSample();
    }).catch(function (err) {
      var settings = activeSettings();
      settings.motionStatus = 'Failed';
      settings.lastMotion = err.message;
      settings.motionTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      saveState();
      renderSettings();
    });
  }

  function sensorPermission(name) {
    var ctor = window[name];
    if (!ctor) return Promise.resolve('unavailable');
    if (typeof ctor.requestPermission === 'function') return ctor.requestPermission();
    return Promise.resolve('granted');
  }

  function listenForMotionSample() {
    var done = false;
    function finish(label) {
      if (done) return;
      done = true;
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('devicemotion', onMotion);
      var settings = activeSettings();
      settings.motionStatus = settings.compassHeading ? 'Live' : 'Granted';
      settings.lastMotion = label;
      settings.motionTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      saveState();
      renderSettings();
      startCompassWatch();
    }
    function onOrientation(event) {
      var heading = compassHeadingFromEvent(event);
      if (heading != null) recordCompassHeading(heading, true);
      finish(heading == null ? 'orientation ok' : 'heading ' + Math.round(heading) + 'deg');
    }
    function onMotion(event) {
      var rate = event.rotationRate;
      if (rate && (rate.alpha || rate.beta || rate.gamma)) finish('motion ok');
    }
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('devicemotion', onMotion);
    setTimeout(function () {
      finish('permission ok, no sample');
    }, 1800);
  }

  function startCompassWatch() {
    if (compassWatchActive || !window.addEventListener) return;
    compassWatchActive = true;
    window.addEventListener('deviceorientation', onCompassOrientation, true);
    window.addEventListener('deviceorientationabsolute', onCompassOrientation, true);
  }

  function onCompassOrientation(event) {
    var heading = compassHeadingFromEvent(event);
    if (heading == null) return;
    recordCompassHeading(heading, false);
  }

  function compassHeadingFromEvent(event) {
    if (!event) return null;
    if (event.webkitCompassHeading != null && Number.isFinite(Number(event.webkitCompassHeading))) {
      return normalize(Number(event.webkitCompassHeading));
    }
    if (event.alpha != null && Number.isFinite(Number(event.alpha))) {
      return normalize(Number(event.alpha));
    }
    return null;
  }

  function recordCompassHeading(heading, forceSave) {
    var rounded = Math.round(normalize(heading));
    var settings = activeSettings();
    var now = Date.now();
    settings.compassHeading = String(rounded);
    settings.compassTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    settings.motionStatus = 'Live';
    settings.lastMotion = 'heading ' + rounded + 'deg';
    updateCompassViewer(rounded);
    if (forceSave || now - compassLastSave > 1000) {
      compassLastSave = now;
      saveState();
      if (state.currentView === 'settings' && !isEditingField()) renderSettings();
    }
  }

  function requestWakeLock() {
    var settings = activeSettings();
    if (!navigator.wakeLock || !navigator.wakeLock.request) {
      settings.wakeStatus = 'Unavailable';
      settings.wakeTime = 'needs native idle timer';
      saveState();
      renderSettings();
      return;
    }

    navigator.wakeLock.request('screen').then(function (sentinel) {
      window.annaMaiWakeLock = sentinel;
      settings.wakeStatus = 'Active';
      settings.wakeTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      sentinel.addEventListener('release', function () {
        activeSettings().wakeStatus = 'Released';
        activeSettings().wakeTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        saveState();
        if (state.currentView === 'settings') renderSettings();
      });
      saveState();
      renderSettings();
    }).catch(function (err) {
      settings.wakeStatus = 'Failed';
      settings.wakeTime = err.message;
      saveState();
      renderSettings();
    });
  }

  function requestSoundPermission() {
    var AudioCtor = window.AudioContext || window.webkitAudioContext;
    var settings = activeSettings();
    if (!AudioCtor) {
      settings.soundStatus = 'Unavailable';
      settings.soundTime = 'no Web Audio';
      saveState();
      renderSettings();
      return;
    }

    var ctx = window.annaMaiAudioContext || new AudioCtor();
    window.annaMaiAudioContext = ctx;
    ctx.resume().then(function () {
      playPermissionTone(ctx);
      if (navigator.vibrate) navigator.vibrate(35);
      settings.soundStatus = navigator.vibrate ? 'Sound + haptic' : 'Sound ready';
      settings.soundTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      saveState();
      renderSettings();
    }).catch(function (err) {
      settings.soundStatus = 'Failed';
      settings.soundTime = err.message;
      saveState();
      renderSettings();
    });
  }

  function playPermissionTone(ctx) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  function statCell(label, value, sub) {
    return '<div class="stat-cell"><div class="sc-label">' + esc(label) + '</div><div class="sc-val">' + esc(value || 'TBC') + '</div><div class="sc-sub">' + esc(sub || '') + '</div></div>';
  }

  function tideStrip(key) {
    return (TIDES[key] || []).map(function (entry, index) {
      return '<div class="te ' + (index % 2 ? 'lw' : 'hw') + '"><div class="te-l">Predicted tide</div><div class="te-t">' + entry[0] + '</div><div class="te-h">' + entry[1] + '</div></div>';
    }).join('');
  }

  function forecastSummary(forecast) {
    return '<div class="wgrid">' +
      summaryCell('Wind', windLabel(forecast), forecast.windGust ? 'gust ' + forecast.windGust + 'kt' : 'TWD / TWS') +
      summaryCell('Tide', tideLabel(forecast), forecast.tideDir ? 'to ' + forecast.tideDir + '&deg;' : 'model/current') +
      summaryCell('Swell', swellLabel(forecast), forecast.swellDir ? 'from ' + forecast.swellDir + '&deg;' : 'height / period') +
    '</div>' +
    '<div class="bias-result">' +
      esc(forecast.notes || 'No notes saved for this race yet.') +
      (forecast.apiUpdated ? '<br/>API updated ' + esc(forecast.apiUpdated) + ' from ' + esc(forecast.apiSource || 'Open-Meteo') + '.' : '') +
    '</div>';
  }

  function summaryCell(label, value, unit) {
    return '<div class="wc"><div class="wl">' + label + '</div><div class="wv">' + value + '</div><div class="wu">' + unit + '</div></div>';
  }

  function windLabel(forecast) {
    if (!forecast.windDir && !forecast.windSpeed) return '--';
    return (forecast.windDir || '---') + '&deg; / ' + (forecast.windSpeed || '--') + 'kt';
  }

  function tideLabel(forecast) {
    if (!forecast.tideState && !forecast.tideRate) return '--';
    return (forecast.tideState || 'Tide') + ' ' + (forecast.tideRate || '--') + 'kt';
  }

  function swellLabel(forecast) {
    if (!forecast.swellHeight && !forecast.swellPeriod) return '--';
    return (forecast.swellHeight || '--') + 'm / ' + (forecast.swellPeriod || '--') + 's';
  }

  function saveForecast() {
    var existing = activeForecast();
    state.forecasts[activeRaceId()] = {
      start: valueOf('fc-start'),
      windDir: valueOf('fc-wind-dir'),
      windSpeed: valueOf('fc-wind-speed'),
      windGust: valueOf('fc-wind-gust'),
      tideState: valueOf('fc-tide-state'),
      tideRate: valueOf('fc-tide-rate'),
      tideDir: valueOf('fc-tide-dir'),
      tideTimeline: existing.tideTimeline || [],
      seaLevel: existing.seaLevel || '',
      swellHeight: valueOf('fc-swell-height'),
      swellPeriod: valueOf('fc-swell-period'),
      swellDir: valueOf('fc-swell-dir'),
      waveHeight: existing.waveHeight || '',
      wavePeriod: existing.wavePeriod || '',
      waveDir: existing.waveDir || '',
      apiUpdated: existing.apiUpdated || '',
      apiSource: existing.apiSource || '',
      notes: valueOf('fc-notes')
    };
    saveState();
    renderCurrentView();
  }

  function fetchForecastApi() {
    var status = byId('api-status');
    if (status) status.textContent = 'Fetching Open-Meteo wind, marine and modelled tide/current data...';

    Promise.all([
      fetch(openMeteoWeatherUrl()).then(checkResponse).then(function (response) { return response.json(); }),
      fetch(openMeteoMarineUrl()).then(checkResponse).then(function (response) { return response.json(); })
    ]).then(function (results) {
      applyApiForecasts(results[0], results[1]);
      saveState();
      renderCurrentView();
    }).catch(function (err) {
      if (status) status.textContent = 'API fetch failed: ' + err.message;
      flash('API fetch failed: ' + err.message);
    });
  }

  function checkResponse(response) {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response;
  }

  function openMeteoWeatherUrl() {
    var params = new URLSearchParams({
      latitude: RACE_AREA.latitude,
      longitude: RACE_AREA.longitude,
      hourly: 'wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      wind_speed_unit: 'kn',
      timezone: 'Europe/London',
      start_date: '2026-05-22',
      end_date: '2026-05-25'
    });
    return 'https://api.open-meteo.com/v1/forecast?' + params.toString();
  }

  function openMeteoMarineUrl() {
    var params = new URLSearchParams({
      latitude: RACE_AREA.latitude,
      longitude: RACE_AREA.longitude,
      hourly: 'wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,sea_level_height_msl,ocean_current_velocity,ocean_current_direction',
      length_unit: 'metric',
      timezone: 'Europe/London',
      start_date: '2026-05-22',
      end_date: '2026-05-25'
    });
    return 'https://marine-api.open-meteo.com/v1/marine?' + params.toString();
  }

  function applyApiForecasts(weather, marine) {
    var updated = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    RACES.forEach(function (race) {
      var lookupTime = apiLookupTime(race);
      var target = race.date + 'T' + lookupTime;
      var weatherIndex = nearestIndex(weather.hourly && weather.hourly.time, target);
      var marineIndex = nearestIndex(marine.hourly && marine.hourly.time, target);
      var forecast = state.forecasts[race.id] || defaultForecast(race);
      var currentKmh = valueAtIso(marine, 'ocean_current_velocity', target);
      if (currentKmh == null) currentKmh = valueAt(marine, 'ocean_current_velocity', marineIndex);
      var currentKn = currentKmh == null ? null : currentKmh * 0.539957;
      var currentDir = directionAtIso(marine, 'ocean_current_direction', target);
      if (currentDir == null) currentDir = valueAt(marine, 'ocean_current_direction', marineIndex);
      var tideState = tideStateFromCurrent(currentKn, currentDir);
      var tideTimeline = buildTideTimeline(marine, race, lookupTime);
      var waveHeight = valueAt(marine, 'wave_height', marineIndex);
      var wavePeriod = valueAt(marine, 'wave_period', marineIndex);
      var waveDir = valueAt(marine, 'wave_direction', marineIndex);

      state.forecasts[race.id] = Object.assign({}, forecast, {
        start: forecast.start || (race.annaMaiStart !== 'TBC' ? race.annaMaiStart : lookupTime + ' est'),
        windDir: cleanNumber(valueAt(weather, 'wind_direction_10m', weatherIndex), 0, forecast.windDir),
        windSpeed: cleanNumber(valueAt(weather, 'wind_speed_10m', weatherIndex), 1, forecast.windSpeed),
        windGust: cleanNumber(valueAt(weather, 'wind_gusts_10m', weatherIndex), 1, forecast.windGust),
        tideState: tideState || forecast.tideState,
        tideRate: cleanNumber(currentKn, 2, forecast.tideRate),
        tideDir: cleanNumber(currentDir, 0, forecast.tideDir),
        tideTimeline: tideTimeline.length ? tideTimeline : forecast.tideTimeline || [],
        seaLevel: cleanNumber(valueAt(marine, 'sea_level_height_msl', marineIndex), 2, forecast.seaLevel),
        swellHeight: cleanNumber(valueAt(marine, 'swell_wave_height', marineIndex), 2, forecast.swellHeight || cleanNumber(waveHeight, 2, '')),
        swellPeriod: cleanNumber(valueAt(marine, 'swell_wave_period', marineIndex), 1, forecast.swellPeriod || cleanNumber(wavePeriod, 1, '')),
        swellDir: cleanNumber(valueAt(marine, 'swell_wave_direction', marineIndex), 0, forecast.swellDir || cleanNumber(waveDir, 0, '')),
        waveHeight: cleanNumber(waveHeight, 2, forecast.waveHeight),
        wavePeriod: cleanNumber(wavePeriod, 1, forecast.wavePeriod),
        waveDir: cleanNumber(waveDir, 0, forecast.waveDir),
        apiUpdated: updated,
        apiSource: 'Open-Meteo'
      });
    });
  }

  function nearestIndex(times, targetIso) {
    if (!Array.isArray(times) || !times.length) return -1;
    var target = isoMinutes(targetIso);
    var best = 0;
    var bestDiff = Infinity;
    times.forEach(function (time, index) {
      var diff = Math.abs(isoMinutes(time) - target);
      if (diff < bestDiff) {
        best = index;
        bestDiff = diff;
      }
    });
    return best;
  }

  function valueAt(payload, key, index) {
    if (!payload || !payload.hourly || !payload.hourly[key] || index < 0) return null;
    var value = payload.hourly[key][index];
    return value == null || Number.isNaN(value) ? null : value;
  }

  function valueAtIso(payload, key, targetIso) {
    var bracket = hourlyBracket(payload, key, targetIso);
    if (!bracket) return null;
    if (bracket.low === bracket.high) return bracket.lowValue;
    return bracket.lowValue + (bracket.highValue - bracket.lowValue) * bracket.pct;
  }

  function directionAtIso(payload, key, targetIso) {
    var bracket = hourlyBracket(payload, key, targetIso);
    if (!bracket) return null;
    if (bracket.low === bracket.high) return normalize(bracket.lowValue);
    return normalize(bracket.lowValue + signedAngle(bracket.highValue - bracket.lowValue) * bracket.pct);
  }

  function hourlyBracket(payload, key, targetIso) {
    var times = payload && payload.hourly && payload.hourly.time;
    var values = payload && payload.hourly && payload.hourly[key];
    if (!Array.isArray(times) || !Array.isArray(values) || !times.length) return null;

    var target = isoMinutes(targetIso);
    var last = times.length - 1;
    if (target <= isoMinutes(times[0])) return hourlyBracketValues(values, 0, 0, 0);
    if (target >= isoMinutes(times[last])) return hourlyBracketValues(values, last, last, 0);

    for (var i = 1; i < times.length; i += 1) {
      var highTime = isoMinutes(times[i]);
      if (target <= highTime) {
        var lowTime = isoMinutes(times[i - 1]);
        var pct = highTime === lowTime ? 0 : (target - lowTime) / (highTime - lowTime);
        return hourlyBracketValues(values, i - 1, i, pct);
      }
    }
    return null;
  }

  function hourlyBracketValues(values, low, high, pct) {
    var lowValue = values[low];
    var highValue = values[high];
    if (lowValue == null || highValue == null || Number.isNaN(lowValue) || Number.isNaN(highValue)) return null;
    return {
      low: low,
      high: high,
      lowValue: Number(lowValue),
      highValue: Number(highValue),
      pct: pct
    };
  }

  function buildTideTimeline(marine, race, lookupTime) {
    return [0, 15, 30, 45, 60].map(function (offset) {
      var target = localIsoAddMinutes(race.date, lookupTime, offset);
      var currentKmh = valueAtIso(marine, 'ocean_current_velocity', target);
      var currentDir = directionAtIso(marine, 'ocean_current_direction', target);
      var currentKn = currentKmh == null ? null : currentKmh * 0.539957;
      if (currentKn == null && currentDir == null) return null;
      return {
        offset: offset,
        time: target.slice(11, 16),
        rate: currentKn == null ? '' : Number(currentKn.toFixed(2)),
        dir: currentDir == null ? '' : Math.round(currentDir),
        state: tideStateFromCurrent(currentKn, currentDir)
      };
    }).filter(Boolean);
  }

  function localIsoAddMinutes(date, hhmm, offsetMinutes) {
    var match = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/);
    if (!date || !match) return date + 'T00:00';
    var target = new Date(date + 'T' + match[1].padStart(2, '0') + ':' + match[2] + ':00');
    target.setMinutes(target.getMinutes() + offsetMinutes);
    return target.getFullYear() + '-' +
      String(target.getMonth() + 1).padStart(2, '0') + '-' +
      String(target.getDate()).padStart(2, '0') + 'T' +
      String(target.getHours()).padStart(2, '0') + ':' +
      String(target.getMinutes()).padStart(2, '0');
  }

  function cleanNumber(value, places, fallback) {
    if (value == null || !Number.isFinite(Number(value))) return fallback || '';
    return Number(value).toFixed(places);
  }

  function tideStateFromCurrent(speed, direction) {
    if (speed == null) return '';
    if (speed < 0.2) return 'Slack';
    if (direction == null) return 'Current';
    var dir = normalize(direction);
    if (dir >= 45 && dir <= 135) return 'E set';
    if (dir >= 225 && dir <= 315) return 'W set';
    return 'Current';
  }

  function isoMinutes(value) {
    var match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!match) return 0;
    return Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5])
    ) / 60000;
  }

  function renderMarks() {
    var course = activeCourse();
    var editor = course.type === 'rtc' ? renderCansEditor(course) : renderWindwardLeewardEditor(course);

    byId('v-marks').innerHTML = raceStrip() +
      '<div class="mark-tabs">' +
        '<div class="mt-btn ' + (course.type === 'wl' ? 'active' : '') + '" onclick="setCourseType(\'wl\')">Windward Leeward</div>' +
        '<div class="mt-btn ' + (course.type === 'rtc' ? 'active' : '') + '" onclick="setCourseType(\'rtc\')">Round the Cans</div>' +
      '</div>' +
      editor +
      (course.type === 'wl' ? renderWlMarkBearings(course) : '') +
      renderMarkLibrary();
  }

  function renderWindwardLeewardEditor(course) {
    return card('IRC3 Windward Leeward',
      row('Model', select('mk-wl-course', wlModel(course), [
        { value: 'normal', label: 'Normal - WL2' },
        { value: 'long', label: 'Long - WL3' }
      ])) +
      row('Committee', markSelect('mk-committee', course.committee, false)) +
      row('Pin', markSelect('mk-pin', course.pin, false)) +
      row('Line brg', input('mk-line-bearing', course.lineBearing, 'pin to committee, deg', 'number', 'min="0" max="359" inputmode="numeric"')) +
      row('Boat spd', input('mk-boat-speed', course.boatSpeed, 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Tack ang', input('mk-tack-angle', course.tackAngle, 'degrees', 'number', 'step="1" inputmode="numeric"')) +
      '<button class="btn-full" onclick="saveWindwardLeeward()">SAVE COURSE</button>' +
      coursePreview(course) +
      '<div class="api-note">Normal uses the SI IRC3 WL2 pattern. Long uses the SI IRC3 WL3 pattern. The WL mark entry below only includes marks used by this selected course.</div>'
    );
  }

  function renderCansEditor(course) {
    return card('Round the Cans Setup',
      row('Committee', markSelect('mk-committee', course.committee, false)) +
      row('Pin', markSelect('mk-pin', course.pin, false)) +
      row('Line brg', input('mk-line-bearing', course.lineBearing, 'pin to committee, deg', 'number', 'min="0" max="359" inputmode="numeric"')) +
      row('Boat spd', input('mk-boat-speed', course.boatSpeed, 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Tack ang', input('mk-tack-angle', course.tackAngle, 'degrees', 'number', 'step="1" inputmode="numeric"')) +
      '<div class="active-course-seq">' + cansSequence(course) + '</div>' +
      '<div class="course-builder-marks">' + state.marks.map(function (mark) {
        return '<div class="cbm" onclick="addCansMark(\'' + esc(mark.code) + '\')">' +
          '<div class="cbm-dot"><div class="cbm-inner">' + esc(mark.code) + '</div></div>' +
          '<div class="cbm-body"><div class="cbm-code">' + esc(mark.code) + '</div><div class="cbm-name">' + esc(mark.name) + '</div></div>' +
          '<div class="cbm-add">+</div>' +
        '</div>';
      }).join('') + '</div>' +
      '<button class="btn-full" onclick="saveCansSettings()">SAVE COURSE</button>'
    );
  }

  function coursePreview(course) {
    return '<hr class="dim"/><div class="active-course-seq">' + courseSequence(course).map(function (entry, index) {
      return '<div class="acs-item">' +
        (index ? '<span class="acs-arrow">&rarr;</span>' : '') +
        '<span class="acs-code">' + esc(entry.code) + '</span>' +
        '<span class="acs-rnd ' + entry.rounding + '">' + entry.rounding.toUpperCase() + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  function cansSequence(course) {
    if (!course.cans.length) {
      return '<span class="cs-empty">Tap marks below to build this race course.</span>';
    }

    return course.cans.map(function (entry, index) {
      return '<div class="acs-item">' +
        (index ? '<span class="acs-arrow">&rarr;</span>' : '') +
        '<span class="acs-code">' + esc(entry.code) + '</span>' +
        '<span class="acs-rnd ' + entry.rounding + '" onclick="toggleCanRounding(' + index + ')">' + entry.rounding.toUpperCase() + '</span>' +
        '<span class="acs-rm" onclick="removeCansMark(' + index + ')">x</span>' +
      '</div>';
    }).join('');
  }

  function renderWlMarkBearings(course) {
    var marks = wlCourseMarks(course);
    var committee = findMark(course.committee || 'COM');
    var committeeText = committee && hasCoords(committee) ? coordLabel(committee) : 'set COM first';
    var rows = marks.length ? marks.map(function (mark) {
      return renderWlMarkBearingRow(mark);
    }).join('') : '<div class="err">Save the WL course model before entering mark bearings.</div>';

    return card('WL Mark Bearings From Committee',
      '<div class="wlbd-list">' + rows + '</div>' +
      '<button class="btn-full" onclick="saveWlMarksFromCommittee()">SET WL MARK POSITIONS</button>' +
      '<div class="api-note">Enter the RC supplied true bearing and distance for each course mark. The app projects each position from ' + esc(course.committee || 'COM') + '; gate midpoint navigation uses both 4S and 4P once set.</div>',
      committeeText
    );
  }

  function wlCourseMarks(course) {
    var seen = {};
    var marks = [];
    courseSequence(course).forEach(function (entry) {
      entry.code.split('/').forEach(function (code) {
        if (seen[code]) return;
        seen[code] = true;
        var mark = findMark(code);
        if (mark) marks.push(mark);
      });
    });
    return marks;
  }

  function renderWlMarkBearingRow(mark) {
    var codeId = markCodeInputId(mark.code);
    return '<div class="wlbd-row">' +
      '<div class="wlbd-code">' + esc(mark.code) + '</div>' +
      '<div class="wlbd-body">' +
        '<div class="wlbd-name">' + esc(mark.name || 'Course mark') + '</div>' +
        '<div class="wlbd-pos">' + coordLabel(mark) + '</div>' +
        '<div class="wlbd-inputs">' +
          input('wlbd-' + codeId + '-bearing', mark.rcBearing || '', 'bearing true', 'number', 'min="0" max="359" inputmode="numeric"') +
          input('wlbd-' + codeId + '-distance', mark.rcDistance || '', 'distance nm', 'number', 'step="0.01" inputmode="decimal"') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function markCodeInputId(code) {
    return String(code).replace(/[^A-Za-z0-9_-]/g, '-');
  }

  function renderMarkLibrary() {
    return card('Mark Library',
      row('Code', input('lib-code', '', 'W1')) +
      row('Name', input('lib-name', '', 'mark name')) +
      row('Lat', input('lib-lat', '', '50.xxxxx', 'number', 'step="0.00001" inputmode="decimal"')) +
      row('Lon', input('lib-lon', '', '-1.xxxxx', 'number', 'step="0.00001" inputmode="decimal"')) +
      '<button class="btn-full" onclick="saveMark()">ADD / UPDATE MARK</button>' +
      '<hr class="dim"/>' +
      '<div class="mark-list">' + state.marks.map(markRow).join('') + '</div>'
    );
  }

  function markRow(mark) {
    var canDelete = CORE_MARKS.indexOf(mark.code) === -1;
    return '<div class="mk">' +
      '<div class="mk-dot"><div class="mk-dot-inner">' + esc(mark.code) + '</div></div>' +
      '<div class="mk-body">' +
        '<div class="mk-code">' + esc(mark.code) + '</div>' +
        '<div class="mk-name">' + esc(mark.name) + '</div>' +
        '<div class="mk-pos">' + coordLabel(mark) + '</div>' +
      '</div>' +
      '<div class="mk-actions">' +
        '<button class="mk-btn" onclick="editMark(\'' + esc(mark.code) + '\')">EDIT</button>' +
        (canDelete ? '<button class="mk-btn del" onclick="deleteMark(\'' + esc(mark.code) + '\')">DEL</button>' : '') +
      '</div>' +
    '</div>';
  }

  function coordLabel(mark) {
    return hasCoords(mark) ? Number(mark.lat).toFixed(5) + ', ' + Number(mark.lon).toFixed(5) : 'position not set';
  }

  function setCourseType(type) {
    activeCourse().type = type;
    saveState();
    renderMarks();
  }

  function saveWindwardLeeward() {
    var course = activeCourse();
    course.type = 'wl';
    course.wlCourse = valueOf('mk-wl-course');
    course.committee = valueOf('mk-committee');
    course.pin = valueOf('mk-pin');
    course.windward = '3';
    course.offset = '3A';
    course.gatePort = '4P';
    course.gateStbd = '4S';
    course.finish = 'FIN';
    course.lineBearing = valueOf('mk-line-bearing');
    course.boatSpeed = valueOf('mk-boat-speed');
    course.tackAngle = valueOf('mk-tack-angle');
    saveState();
    renderMarks();
  }

  function saveCansSettings() {
    var course = activeCourse();
    course.type = 'rtc';
    course.committee = valueOf('mk-committee');
    course.pin = valueOf('mk-pin');
    course.lineBearing = valueOf('mk-line-bearing');
    course.boatSpeed = valueOf('mk-boat-speed');
    course.tackAngle = valueOf('mk-tack-angle');
    saveState();
    renderMarks();
  }

  function addCansMark(code) {
    activeCourse().cans.push({ code: code, rounding: 'port' });
    saveState();
    renderMarks();
  }

  function removeCansMark(index) {
    activeCourse().cans.splice(index, 1);
    saveState();
    renderMarks();
  }

  function toggleCanRounding(index) {
    var entry = activeCourse().cans[index];
    if (!entry) return;
    entry.rounding = entry.rounding === 'port' ? 'stbd' : 'port';
    saveState();
    renderMarks();
  }

  function saveMark() {
    var code = valueOf('lib-code').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    var name = valueOf('lib-name').trim();
    var lat = valueOf('lib-lat');
    var lon = valueOf('lib-lon');

    if (!code || !name) {
      flash('Mark needs at least a code and name.');
      return;
    }

    var existing = state.marks.find(function (mark) { return mark.code === code; });
    var next = { code: code, name: name, lat: lat, lon: lon, role: existing ? existing.role : 'custom' };
    if (existing) Object.assign(existing, next);
    else state.marks.push(next);

    saveState();
    renderMarks();
  }

  function editMark(code) {
    var mark = findMark(code);
    if (!mark) return;
    byId('lib-code').value = mark.code;
    byId('lib-name').value = mark.name;
    byId('lib-lat').value = mark.lat;
    byId('lib-lon').value = mark.lon;
  }

  function deleteMark(code) {
    if (CORE_MARKS.indexOf(code) !== -1) return;
    state.marks = state.marks.filter(function (mark) { return mark.code !== code; });
    Object.keys(state.courses).forEach(function (raceId) {
      state.courses[raceId].cans = state.courses[raceId].cans.filter(function (entry) {
        return entry.code !== code;
      });
    });
    saveState();
    renderMarks();
  }

  function saveMarkFromCommittee() {
    var code = valueOf('bd-mark');
    var bearing = toNumber(valueOf('bd-bearing'));
    var distance = toNumber(valueOf('bd-distance'));
    var committee = findMark('COM');
    var mark = findMark(code);

    if (!mark || bearing == null || distance == null) {
      flash('Choose a mark and enter bearing plus distance from the committee boat.');
      return;
    }

    if (!committee || !hasCoords(committee)) {
      flash('Set the committee boat COM position before projecting a mark from it.');
      return;
    }

    var point = destinationPoint(committee, bearing, distance);
    mark.lat = point.lat.toFixed(5);
    mark.lon = point.lon.toFixed(5);
    saveState();
    renderMarks();
  }

  function saveWlMarksFromCommittee() {
    var course = activeCourse();
    var committee = findMark(course.committee || 'COM');
    var marks = wlCourseMarks(course);
    var updated = 0;

    if (!committee || !hasCoords(committee)) {
      flash('Set the committee boat COM position before projecting WL marks.');
      return;
    }

    for (var i = 0; i < marks.length; i += 1) {
      var mark = marks[i];
      var codeId = markCodeInputId(mark.code);
      var bearingRaw = valueOf('wlbd-' + codeId + '-bearing');
      var distanceRaw = valueOf('wlbd-' + codeId + '-distance');
      var bearing = toNumber(bearingRaw);
      var distance = toNumber(distanceRaw);

      if (!bearingRaw && !distanceRaw) continue;
      if (bearing == null || distance == null) {
        flash('Enter both bearing and distance for ' + mark.code + ', or leave both blank.');
        return;
      }

      var point = destinationPoint(committee, normalize(bearing), distance);
      mark.lat = point.lat.toFixed(5);
      mark.lon = point.lon.toFixed(5);
      mark.rcBearing = String(Math.round(normalize(bearing)));
      mark.rcDistance = String(distanceRaw);
      updated += 1;
    }

    if (!updated) {
      flash('Enter at least one WL mark bearing and distance.');
      return;
    }

    saveState();
    renderMarks();
  }

  function renderRace() {
    var raceId = activeRaceId();
    var race = activeRace();
    var forecast = activeForecast();
    var course = activeCourse();
    var tab = state.raceTab === 'start' || state.raceTab === 'course' ? state.raceTab : 'plan';
    state.raceTab = tab;

    byId('v-race').innerHTML = raceStrip() +
      '<div class="mark-tabs">' +
        raceTabButton('plan', 'Plan') +
        raceTabButton('start', 'Start') +
        raceTabButton('course', 'Course') +
      '</div>' +
      (tab === 'start'
        ? renderStartRace(raceId, race, forecast, course)
        : tab === 'course'
          ? renderCourseRace(race, forecast, course)
          : renderPlanRace(raceId, race, forecast, course));
  }

  function raceTabButton(tab, label) {
    return '<div class="mt-btn ' + (state.raceTab === tab ? 'active' : '') + '" onclick="setRaceTab(\'' + tab + '\')">' + label + '</div>';
  }

  function setRaceTab(tab) {
    state.raceTab = tab === 'start' || tab === 'course' ? tab : 'plan';
    saveState();
    renderRace();
  }

  function renderPlanRace(raceId, race, forecast, course) {
    return card(raceId + ' Conditions', forecastSummary(forecast), forecast.start || 'time TBC') +
      raceOpsCard(race, course) +
      predictionAdviceCard(forecast, course) +
      startLineCard(forecast, course) +
      courseCard(course) +
      laylineCard(forecast, course);
  }

  function renderStartRace(raceId, race, forecast, course) {
    return card(raceId + ' Conditions', forecastSummary(forecast), forecast.start || 'time TBC') +
      startTimerCard(race, forecast, course) +
      startLineDistanceCard(course) +
      startLineCard(forecast, course) +
      raceOpsCard(race, course);
  }

  function renderCourseRace(race, forecast, course) {
    return card(activeRaceId() + ' Conditions', forecastSummary(forecast), forecast.start || 'time TBC') +
      actualNavCard(forecast, course) +
      courseCard(course);
  }

  function countdownCard(race, forecast) {
    var actual = activeActual();
    var startInfo = raceStartInfo(race, forecast, actual);
    var start = startInfo.label;
    var seconds = startInfo.seconds;
    var display = seconds == null ? '--:--' : seconds >= 0 ? formatDuration(seconds) : '+' + formatDuration(Math.abs(seconds));
    var status = seconds == null ? 'Set the Race Start field.' : seconds >= 0 ? 'To start' : 'After start';

    return card('Countdown',
      '<div class="countdown-card" style="margin-bottom:8px">' +
        '<div class="cd-label">' + esc(status) + '</div>' +
        '<div class="cd-time ' + (seconds != null && seconds <= 60 && seconds >= 0 ? 'warn' : seconds != null && seconds < 0 ? 'go' : '') + '">' + display + '</div>' +
        '<div class="cd-status">' + esc(start || 'No start time') + '</div>' +
      '</div>' +
      row('Race start', input('actual-start', start, 'HH:MM', 'time')) +
      '<button class="btn-full" onclick="saveActualStart()">SAVE START TIME</button>',
      race.day
    );
  }

  function startTimerCard(race, forecast, course) {
    var actual = activeActual();
    var startInfo = raceStartInfo(race, forecast, actual);
    var metrics = startLineMetrics(actualBoatPosition(actual), course);
    var speed = toNumber(actual.lineSpeed) || toNumber(course.boatSpeed) || 5.5;
    var timeToLine = metrics && speed > 0 ? Math.round(metrics.distance / speed * 3600) : null;
    var kill = startInfo.seconds == null || timeToLine == null ? null : startInfo.seconds - timeToLine;
    var display = startInfo.seconds == null ? '--:--' : startInfo.seconds >= 0 ? formatDuration(startInfo.seconds) : '+' + formatDuration(Math.abs(startInfo.seconds));
    var status = startInfo.seconds == null ? 'Sync from RC VHF' : startInfo.seconds >= 0 ? 'To start' : 'Started';
    var afterStart = startInfo.seconds != null && startInfo.seconds < 0
      ? '<button class="btn-full" onclick="setRaceTab(\'course\')">GO TO COURSE NAV</button>'
      : '';

    return card('RC Start Timer',
      '<div class="countdown-card">' +
        '<div class="cd-label">' + esc(status) + '</div>' +
        '<div class="cd-time ' + (startInfo.seconds != null && startInfo.seconds <= 60 && startInfo.seconds >= 0 ? 'warn' : startInfo.seconds != null && startInfo.seconds < 0 ? 'go' : '') + '">' + display + '</div>' +
        '<div class="cd-status">' + esc(startInfo.source || 'Waiting for RC time check') + '</div>' +
      '</div>' +
      '<div class="sync-row">' +
        '<div class="sync-btn" onclick="syncRcStart(300)">5:00</div>' +
        '<div class="sync-btn" onclick="syncRcStart(240)">4:00</div>' +
        '<div class="sync-btn" onclick="syncRcStart(60)">1:00</div>' +
        '<div class="sync-btn" onclick="syncRcStart(0)">START</div>' +
      '</div>' +
      '<div class="start-grid">' +
        startMetric('Line', metrics ? metrics.distance.toFixed(2) : '--', 'nm', '') +
        startMetric('Time line', timeToLine == null ? '--' : formatDuration(timeToLine), 'at ' + speed.toFixed(1) + 'kt', '') +
        startMetric('Kill', kill == null ? '--' : (kill >= 0 ? formatDuration(kill) : '-' + formatDuration(Math.abs(kill))), kill == null ? 'needs fix' : kill >= 0 ? 'spare' : 'late', kill == null ? '' : kill >= 20 ? 'good' : kill >= 0 ? 'warn' : 'late') +
      '</div>' +
      afterStart +
      row('RC start', input('actual-start', actual.startTime || forecast.start || race.annaMaiStart || '', 'HH:MM', 'time')) +
      row('Approach BSP', input('actual-line-speed', actual.lineSpeed || course.boatSpeed || '5.5', 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      '<button class="btn-full" onclick="saveStartPage()">SAVE START SETUP</button>',
      'VHF 77 / Flag O VHF 6'
    );
  }

  function startMetric(label, value, unit, cls) {
    return '<div class="start-cell ' + (cls || '') + '"><div class="sc-k">' + esc(label) + '</div><div class="sc-n">' + value + '</div><div class="sc-u">' + esc(unit || '') + '</div></div>';
  }

  function startLineDistanceCard(course) {
    var actual = activeActual();
    var metrics = startLineMetrics(actualBoatPosition(actual), course);
    var boat = actualBoatPosition(actual);
    var fixLabel = actual.lastFix || activeSettings().lastGpsTime || 'enable GPS in Settings';
    var body = metrics
      ? '<div class="stat-row">' +
          statCell('Line length', metrics.length.toFixed(2) + 'nm', 'pin to committee') +
          statCell('To pin', metrics.pinDistance.toFixed(2) + 'nm', metrics.position) +
          statCell('To committee', metrics.committeeDistance.toFixed(2) + 'nm', metrics.side) +
        '</div>'
      : '<div class="err">Set COM and PIN positions, then enable GPS in Settings.</div>';

    return card('Distance To Line',
      body +
      '<div class="stat-row">' +
        statCell('GPS lat', boat ? Number(boat.lat).toFixed(5) : '--', fixLabel) +
        statCell('GPS lon', boat ? Number(boat.lon).toFixed(5) : '--', actual.gpsAccuracy || 'phone position') +
      '</div>',
      metrics ? metrics.distance.toFixed(2) + 'nm' : 'needs line'
    );
  }

  function predictionAdviceCard(forecast, course) {
    var windSpeed = toNumber(forecast.windSpeed) || 10;
    var target = polarTarget(windSpeed, 'upwind');
    var downwind = polarTarget(windSpeed, 'downwind');
    var legs = timedCourseLegs(courseLegs(course), forecast, course);
    var tideModel = tideModelSummary(forecast);
    var legNote = legs.length
      ? legs.map(function (leg) {
        var legForecast = tideForecastForElapsed(forecast, leg.startMinutes);
        var title = 'L' + (leg.index + 1) + ' +' + Math.round(leg.startMinutes) + 'm ' + leg.label;
        return '<div class="leg-rec"><div class="leg-rec-title">' + esc(title) + '</div><div class="leg-rec-body">' + legPrediction(leg, legForecast, course) + '</div></div>';
      }).join('')
      : coursePatternAdvice(forecast, course);

    return card('Crew Prediction',
      '<div class="stat-row">' +
        statCell('Upwind target', target.speed.toFixed(1) + 'kt', target.angle + ' deg TWA') +
        statCell('Downwind target', downwind.speed.toFixed(1) + 'kt', downwind.angle + ' deg TWA') +
        statCell('Tack angle', course.tackAngle || '42', 'degrees') +
        statCell('Tide model', tideModel.value, tideModel.sub) +
      '</div>' +
      legNote +
      '<div class="api-note">Recommendations render the full selected course. Tide is applied per leg from the API timeline when available; otherwise the single forecast tide set is used. Targets start from the ' + esc(POLAR_SOURCE) + ' and blend with Actual tab samples as they are logged.</div>'
    );
  }

  function coursePatternAdvice(forecast, course) {
    if (course.type === 'wl') {
      var model = wlModel(course) === 'long' ? 'Long WL3' : 'Normal WL2';
      return '<div class="leg-rec">' +
        '<div class="leg-rec-title">' + model + ' selected</div>' +
        '<div class="leg-rec-body">' + wlModelText(course) + ' Enter the RC mark positions for 3, 3A, 4S/4P and FIN when available to unlock bearing, distance and tide-specific leg calls.</div>' +
      '</div>' +
      '<div class="leg-rec">' +
        '<div class="leg-rec-title">Crew focus</div>' +
        '<div class="leg-rec-body">' + genericCrewFocus(forecast, course) + '</div>' +
      '</div>';
    }

    return '<div class="err">Build the Round the Cans sequence and set mark positions before leg-specific prediction is available.</div>';
  }

  function wlModelText(course) {
    if (wlModel(course) === 'long') {
      return 'Course pattern: Start, 3 port, 3A port, 4S/4P gate, 3 port, 3A port, 4S/4P gate, 3 port, 3A port, 4P port, Finish.';
    }
    return 'Course pattern: Start, 3 port, 3A port, 4S/4P gate, 3 port, 3A port, 4P port, Finish.';
  }

  function genericCrewFocus(forecast, course) {
    var wind = toNumber(forecast.windSpeed);
    var gust = toNumber(forecast.windGust);
    var tide = toNumber(forecast.tideRate);
    var notes = [];
    notes.push('Start with clean air and hit the first beat target numbers.');
    if (wind != null && wind < 8) notes.push('Light-air mode: keep height secondary to flow and acceleration.');
    if (wind != null && wind >= 14) notes.push('Powered-up mode: depower early and keep the boat flat through manoeuvres.');
    if (gust != null && wind != null && gust - wind >= 6) notes.push('Gust spread is large; call pressure before it arrives.');
    if (tide != null && tide >= 0.4) notes.push('Current is meaningful; confirm set at the start line and protect the down-tide layline.');
    notes.push(course.type === 'wl' ? 'At the gate, choose the mark that gives the cleanest exit and best side of the next beat.' : 'On RTC legs, avoid extra distance unless current relief is clear.');
    return notes.join(' ');
  }

  function legPrediction(leg, forecast, course) {
    var windDir = toNumber(forecast.windDir);
    var windSpeed = toNumber(forecast.windSpeed) || 10;
    var tideRate = toNumber(forecast.tideRate);
    var tideDir = toNumber(forecast.tideDir);
    var text = 'Bearing ' + Math.round(leg.bearing) + '&deg;, distance ' + leg.distance.toFixed(2) + 'nm. ';
    if (leg.durationMinutes != null) text += 'Approx ' + Math.round(leg.durationMinutes) + 'm leg. ';
    if (windDir != null) {
      var twa = Math.abs(signedAngle(leg.bearing - windDir));
      if (twa < 70) {
        text += 'Treat as a beat; target ' + targetCall(windSpeed, 'upwind') + ', protect lanes and hit target height. ';
      } else if (twa > 120) {
        text += 'Treat as a run; target ' + targetCall(windSpeed, 'downwind') + ', keep transitions clean and avoid sailing extra distance. ';
      } else {
        text += 'Likely reaching leg; target ' + targetCall(windSpeed, 'reach') + ', prioritise speed and clear air. ';
      }
    }
    if (tideRate != null && tideDir != null && tideRate >= 0.2) {
      var cross = Math.sin(toRad(signedAngle(tideDir - leg.bearing)));
      text += cross > 0 ? 'Current pushes right of track.' : 'Current pushes left of track.';
      if (forecast.tideSourceTime) text += ' Tide sample ' + forecast.tideSourceTime + '.';
    }
    return text;
  }

  function timedCourseLegs(legs, forecast, course) {
    var elapsed = 0;
    return legs.map(function (leg, index) {
      var speed = legTimingSpeed(leg, forecast, course);
      var duration = speed > 0 ? leg.distance / speed * 60 : null;
      var timed = Object.assign({}, leg, {
        index: index,
        startMinutes: elapsed,
        durationMinutes: duration
      });
      if (duration != null) elapsed += duration;
      return timed;
    });
  }

  function legTimingSpeed(leg, forecast, course) {
    var windDir = toNumber(forecast.windDir);
    var windSpeed = toNumber(forecast.windSpeed) || 10;
    var fallback = toNumber(course.boatSpeed) || 5.5;
    if (windDir == null) return fallback;

    var twa = Math.abs(signedAngle(leg.bearing - windDir));
    var mode = twa < 70 ? 'upwind' : twa > 120 ? 'downwind' : 'reach';
    return polarTarget(windSpeed, mode).speed || fallback;
  }

  function tideModelSummary(forecast) {
    var timeline = Array.isArray(forecast.tideTimeline) ? forecast.tideTimeline.filter(validTideSample) : [];
    if (timeline.length > 1) {
      var first = timeline[0];
      var last = timeline[timeline.length - 1];
      return {
        value: '+0 to +' + Math.round(last.offset) + 'm',
        sub: tideSampleLabel(first) + ' -> ' + tideSampleLabel(last)
      };
    }
    if (forecast.tideRate || forecast.tideDir) {
      return {
        value: 'single set',
        sub: (forecast.tideRate || '--') + 'kt to ' + (forecast.tideDir || '--') + ' deg'
      };
    }
    return { value: 'not set', sub: 'no current data' };
  }

  function tideForecastForElapsed(forecast, elapsedMinutes) {
    var timeline = Array.isArray(forecast.tideTimeline) ? forecast.tideTimeline.filter(validTideSample) : [];
    if (timeline.length < 2) return forecast;

    var target = Math.max(0, elapsedMinutes || 0);
    var low = timeline[0];
    var high = timeline[timeline.length - 1];

    for (var i = 1; i < timeline.length; i += 1) {
      if (target <= timeline[i].offset) {
        low = timeline[i - 1];
        high = timeline[i];
        break;
      }
    }

    var span = high.offset - low.offset;
    var pct = span <= 0 ? 0 : Math.max(0, Math.min(1, (target - low.offset) / span));
    var rate = Number(low.rate) + (Number(high.rate) - Number(low.rate)) * pct;
    var dir = normalize(Number(low.dir) + signedAngle(Number(high.dir) - Number(low.dir)) * pct);

    return Object.assign({}, forecast, {
      tideRate: rate.toFixed(2),
      tideDir: String(Math.round(dir)),
      tideState: tideStateFromCurrent(rate, dir),
      tideSourceTime: '+' + Math.round(target) + 'm / ' + interpolatedTimeLabel(low, high, pct)
    });
  }

  function validTideSample(sample) {
    return sample && toNumber(sample.rate) != null && toNumber(sample.dir) != null;
  }

  function tideSampleLabel(sample) {
    return sample.rate + 'kt to ' + sample.dir + ' deg';
  }

  function interpolatedTimeLabel(low, high, pct) {
    if (!low.time || !high.time) return 'API tide';
    if (pct <= 0.02) return low.time;
    if (pct >= 0.98) return high.time;
    var lowMinutes = clockMinutes(low.time);
    var highMinutes = clockMinutes(high.time);
    if (highMinutes < lowMinutes) highMinutes += 1440;
    var minutes = Math.round(lowMinutes + (highMinutes - lowMinutes) * pct) % 1440;
    return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
  }

  function clockMinutes(value) {
    var match = String(value || '').match(/^(\d{1,2}):(\d{2})/);
    return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
  }

  function targetCall(windSpeed, mode) {
    var target = polarTarget(windSpeed, mode);
    return target.speed.toFixed(1) + 'kt at ' + target.angle + '&deg; TWA';
  }

  function polarTarget(tws, mode) {
    var base = interpolatePolar(POLAR_SEED[mode] || POLAR_SEED.upwind, tws);
    var samples = state.polarSamples.filter(function (sample) {
      return sample.mode === mode && Math.abs(sample.tws - tws) <= 2.5;
    });
    if (!samples.length) return base;

    var observed = samples.reduce(function (sum, sample) {
      return sum + sample.speed;
    }, 0) / samples.length;

    return {
      speed: base.speed * 0.65 + observed * 0.35,
      angle: base.angle
    };
  }

  function interpolatePolar(table, tws) {
    if (tws <= table[0].tws) return { speed: table[0].speed, angle: table[0].angle };
    for (var i = 1; i < table.length; i += 1) {
      if (tws <= table[i].tws) {
        var low = table[i - 1];
        var high = table[i];
        var pct = (tws - low.tws) / (high.tws - low.tws);
        return {
          speed: low.speed + (high.speed - low.speed) * pct,
          angle: Math.round(low.angle + (high.angle - low.angle) * pct)
        };
      }
    }
    var last = table[table.length - 1];
    return { speed: last.speed, angle: last.angle };
  }

  function blendedPolarTable() {
    var modes = ['upwind', 'downwind', 'reach'];
    var result = {};
    modes.forEach(function (mode) {
      result[mode] = POLAR_SEED[mode].map(function (row) {
        var target = polarTarget(row.tws, mode);
        return {
          tws: row.tws,
          baselineSpeed: row.speed,
          blendedSpeed: Number(target.speed.toFixed(2)),
          angle: target.angle
        };
      });
    });
    return result;
  }

  function actualNavCard(forecast, course) {
    var actual = activeActual();
    var sequence = courseSequence(course);
    var legIndex = Math.min(Math.max(parseInt(actual.legIndex || 0, 10), 0), Math.max(sequence.length - 1, 0));
    actual.legIndex = legIndex;
    var next = sequence[legIndex];
    var mark = next ? markForCourseEntry(next) : null;
    var boat = actualBoatPosition(actual);
    var nav = boat && mark && hasCoords(mark) ? actualNavNumbers(boat, mark, forecast, course) : null;
    var displayLat = actual.boatLat || (boat ? Number(boat.lat).toFixed(5) : '');
    var displayLon = actual.boatLon || (boat ? Number(boat.lon).toFixed(5) : '');
    var fixLabel = actual.lastFix || activeSettings().lastGpsTime || 'no position';
    var gpsStatus = actual.gpsMode === 'live' ? 'live GPS' : actual.gpsMode === 'fix' ? 'GPS fix' : boat ? 'phone GPS' : 'manual';

    var selectorControl = select('actual-leg', legIndex, sequence.map(function (entry, index) {
      return { value: index, label: (index + 1) + ' - ' + entry.code + ' ' + entry.rounding.toUpperCase() };
    })).replace('<select id="actual-leg">', '<select id="actual-leg" onchange="selectActualLeg()">');
    var selector = row('Next mark', selectorControl);

    return card('Actual - Next Mark',
      (sequence.length ? selector : '<div class="err">Set a course before using Actual navigation.</div>') +
      '<div class="nav-hero">' +
        actualBig('Bearing', nav ? Math.round(nav.bearing) : '--', 'deg', next ? next.code : 'no mark') +
        actualBig('Distance', nav ? nav.distance.toFixed(2) : '--', 'nm', fixLabel) +
      '</div>' +
      tacticalMapPanel(nav, next, boat, mark, forecast, course, legIndex, actual) +
      '<div class="ll-hero">' +
        actualLaylineCard('Port layline', nav && nav.portStatus !== 'no wind' ? Math.round(nav.port) : '--', nav ? nav.portStatus : 'needs fix', 'deg') +
        actualLaylineCard('Stbd layline', nav && nav.stbdStatus !== 'no wind' ? Math.round(nav.stbd) : '--', nav ? nav.stbdStatus : 'needs fix', 'deg') +
      '</div>' +
      '<div class="ll-hero">' +
        actualLaylineCard('Dist to port', nav && nav.portDistance != null ? nav.portDistance.toFixed(2) : '--', 'cross-track', 'nm') +
        actualLaylineCard('Dist to stbd', nav && nav.stbdDistance != null ? nav.stbdDistance.toFixed(2) : '--', 'cross-track', 'nm') +
      '</div>' +
      '<div class="stat-row">' +
        statCell('GPS lat', displayLat || '--', fixLabel) +
        statCell('GPS lon', displayLon || '--', actual.gpsSpeed || 'phone position') +
      '</div>' +
      '<div class="api-note">Position source: ' + esc(gpsStatus) + (actual.gpsAccuracy ? ' / ' + esc(actual.gpsAccuracy) : '') + '</div>' +
      '<div class="ll-advice">' + (nav ? nav.advice : 'Enable GPS in Settings and make sure the next mark has a position.') + '</div>',
      mark && hasCoords(mark) ? coordLabel(mark) : 'mark position needed'
    );
  }

  function actualBig(label, value, unit, sub) {
    return '<div class="nav-big"><div class="nb-label">' + label + '</div><div class="nb-val">' + value + '</div><div class="nb-unit">' + unit + '</div><div class="nb-sub">' + esc(sub || '') + '</div></div>';
  }

  function actualLaylineCard(label, value, status, unit) {
    var display = value === '--' ? '--' : esc(value) + '<span class="ll-unit">' + esc(unit || 'deg') + '</span>';
    return '<div class="ll-card" style="border-color:rgba(212,160,23,.28)"><div class="ll-tack">' + label + '</div><div class="ll-dist">' + display + '</div><div class="ll-status ll-crossed">' + esc(status) + '</div></div>';
  }

  function tacticalMapPanel(nav, next, boat, mark, forecast, course, legIndex, actual) {
    var title = '<div class="map-title"><span>Tactical Map</span><span>COG track / TWD forecast</span></div>';
    if (!boat || !mark || !hasCoords(mark)) {
      return '<div class="ll-svg-wrap">' + title +
        '<div class="err">Map needs iPhone GPS from Settings and a next mark position.</div>' +
      '</div>';
    }
    if (!nav) {
      return '<div class="ll-svg-wrap">' + title +
        '<div class="err">Map needs a valid next mark for the selected course leg.</div>' +
      '</div>';
    }

    var context = tacticalMapContext(nav, next, boat, mark, forecast, course, legIndex, actual);
    var boatSvg = context.project(context.boatPoint);
    var mapViewBox = '0 0 320 300';
    var nextSvg = context.project(context.nextPoint);
    var routePoints = [context.boatPoint].concat(context.routeMarks.map(function (item) { return item.point; }));
    var routeSvg = routePoints.map(function (point) { return svgPointText(context.project(point)); }).join(' ');
    var portSvg = context.portBack ? context.project(context.portBack) : null;
    var stbdSvg = context.stbdBack ? context.project(context.stbdBack) : null;
    var cogSvg = context.cogEnd ? context.project(context.cogEnd) : null;
    var interceptSvg = context.intercept ? context.project(context.intercept.point) : null;
    var windDir = toNumber(forecast.windDir);
    var windPoint = windDir == null ? null : svgPoint(286, 52, normalize(windDir + 180), 28);
    var legText = nav.distance.toFixed(2) + 'nm / ' + Math.round(nav.bearing) + 'deg';
    var insight = tacticalInsightPanel(nav, boat, mark, forecast, context);
    var compass = compassBearingPanel(nav, next, context);
    var chartTiles = chartTileLayerSvg(context);
    var markLabels = context.routeMarks.map(function (item, index) {
      var point = context.project(item.point);
      var label = item.label || item.mark.code || 'MARK';
      return '<circle class="' + (index === 0 ? 'mark-dot' : 'route-dot') + '" cx="' + svgNumber(point.x) + '" cy="' + svgNumber(point.y) + '" r="' + (index === 0 ? 6 : 4) + '"></circle>' +
        '<text x="' + boundedLabelX(point.x) + '" y="' + boundedLabelY(point.y - 8) + '">' + esc(label) + '</text>';
    }).join('');

    return '<div class="ll-svg-wrap">' + title +
      mapZoomControls(context) +
      '<svg id="tactical-map-svg" class="layline-svg" viewBox="' + mapViewBox + '" role="img" aria-label="Live tactical layline map" data-span-x="' + svgNumber(context.viewSpanX) + '" data-span-y="' + svgNumber(context.viewSpanY) + '" data-boat-x="' + svgNumber(boatSvg.x) + '" data-boat-y="' + svgNumber(boatSvg.y) + '" onpointerdown="return startTacticalPan(event)" onpointermove="return moveTacticalPan(event)" onpointerup="return endTacticalPan(event)" onpointercancel="return endTacticalPan(event)" ontouchstart="return startTacticalPan(event)" ontouchmove="return moveTacticalPan(event)" ontouchend="return endTacticalPan(event)" ontouchcancel="return endTacticalPan(event)">' +
        '<defs>' +
          '<marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#80CBC4"></path></marker>' +
          '<marker id="boatarr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#fff"></path></marker>' +
          '<clipPath id="chartclip"><rect x="16" y="16" width="288" height="252" rx="4"></rect></clipPath>' +
        '</defs>' +
        chartTiles +
        '<rect class="sail-area" x="16" y="16" width="288" height="252" rx="4"></rect>' +
        '<line class="thin" x1="16" y1="79" x2="304" y2="79"></line>' +
        '<line class="thin" x1="16" y1="142" x2="304" y2="142"></line>' +
        '<line class="thin" x1="16" y1="205" x2="304" y2="205"></line>' +
        '<line class="thin" x1="88" y1="16" x2="88" y2="268"></line>' +
        '<line class="thin" x1="160" y1="16" x2="160" y2="268"></line>' +
        '<line class="thin" x1="232" y1="16" x2="232" y2="268"></line>' +
        '<text x="154" y="18">N</text>' +
        '<text class="chart-attrib" x="18" y="30">Map tiles: OpenStreetMap / OpenSeaMap</text>' +
        '<text x="18" y="286">VIEW ' + esc(context.viewLabel) + (context.panLabel ? ' / ' + esc(context.panLabel) : '') + '</text>' +
        (windPoint ? '<line class="wind-line" x1="286" y1="52" x2="' + windPoint.x + '" y2="' + windPoint.y + '"></line><text x="245" y="34">TWD ' + Math.round(windDir) + '</text>' : '') +
        '<polyline class="course-route" points="' + routeSvg + '"></polyline>' +
        (portSvg ? '<line class="port-line" x1="' + svgNumber(nextSvg.x) + '" y1="' + svgNumber(nextSvg.y) + '" x2="' + svgNumber(portSvg.x) + '" y2="' + svgNumber(portSvg.y) + '"></line>' : '') +
        (stbdSvg ? '<line class="stbd-line" x1="' + svgNumber(nextSvg.x) + '" y1="' + svgNumber(nextSvg.y) + '" x2="' + svgNumber(stbdSvg.x) + '" y2="' + svgNumber(stbdSvg.y) + '"></line>' : '') +
        '<line class="mark-line" x1="' + svgNumber(boatSvg.x) + '" y1="' + svgNumber(boatSvg.y) + '" x2="' + svgNumber(nextSvg.x) + '" y2="' + svgNumber(nextSvg.y) + '"></line>' +
        (cogSvg ? '<line class="boat-arrow" x1="' + svgNumber(boatSvg.x) + '" y1="' + svgNumber(boatSvg.y) + '" x2="' + svgNumber(cogSvg.x) + '" y2="' + svgNumber(cogSvg.y) + '"></line><text x="' + boundedLabelX(cogSvg.x) + '" y="' + boundedLabelY(cogSvg.y) + '">COG ' + Math.round(context.cog) + '</text>' : '') +
        markLabels +
        '<circle class="boat-dot" cx="' + svgNumber(boatSvg.x) + '" cy="' + svgNumber(boatSvg.y) + '" r="6"></circle>' +
        '<text x="' + boundedLabelX(boatSvg.x) + '" y="' + boundedLabelY(boatSvg.y + 16) + '">BOAT</text>' +
        (portSvg ? '<text x="' + boundedLabelX(portSvg.x) + '" y="' + boundedLabelY(portSvg.y) + '">PORT ' + Math.round(nav.port) + '</text>' : '') +
        (stbdSvg ? '<text x="' + boundedLabelX(stbdSvg.x) + '" y="' + boundedLabelY(stbdSvg.y) + '">STBD ' + Math.round(nav.stbd) + '</text>' : '') +
        (interceptSvg ? '<circle class="intercept-dot" cx="' + svgNumber(interceptSvg.x) + '" cy="' + svgNumber(interceptSvg.y) + '" r="5"></circle><text x="' + boundedLabelX(interceptSvg.x) + '" y="' + boundedLabelY(interceptSvg.y - 9) + '">INT ' + esc(context.interceptTimeLabel) + '</text>' : '') +
        '<text x="206" y="286">' + legText + '</text>' +
      '</svg>' +
      compass +
      insight +
      (nav.portStatus === 'no wind' ? '<div class="err">Enter forecast wind direction to draw laylines. Course line is shown.</div>' : '') +
    '</div>';
  }

  function tacticalMapContext(nav, next, boat, mark, forecast, course, legIndex, actual) {
    var sequence = courseSequence(course);
    var routeMarks = [{ mark: mark, label: next ? next.code : mark.code, point: null }];
    sequence.slice(legIndex + 1).forEach(function (entry) {
      var routeMark = markForCourseEntry(entry);
      if (routeMark && hasCoords(routeMark)) {
        routeMarks.push({ mark: routeMark, label: entry.code, point: null });
      }
    });

    var latTotal = Number(boat.lat);
    var latCount = 1;
    routeMarks.forEach(function (item) {
      latTotal += Number(item.mark.lat);
      latCount += 1;
    });

    var originLat = latTotal / latCount;
    var boatPoint = localNmPoint(boat, originLat);
    routeMarks.forEach(function (item) {
      item.point = localNmPoint(item.mark, originLat);
    });

    var nextPoint = routeMarks[0].point;
    var hasLaylines = nav.portStatus !== 'no wind' && nav.stbdStatus !== 'no wind';
    var laylineLength = Math.max(nav.distance * 1.8, 0.6);
    var portBack = hasLaylines ? offsetPoint(nextPoint, normalize(nav.port + 180), laylineLength) : null;
    var stbdBack = hasLaylines ? offsetPoint(nextPoint, normalize(nav.stbd + 180), laylineLength) : null;
    var cog = gpsCourseNumber(actual);
    var sog = gpsSpeedNumber(actual);
    var cogEnd = cog == null ? null : offsetPoint(boatPoint, cog, Math.max(0.16, Math.min(nav.distance * 0.45, 0.7)));
    var tack = hasLaylines && cog != null ? currentTackFromCog(cog, nav) : null;
    var intercept = tack ? lineRayLaylineIntercept(boatPoint, nextPoint, cog, tack.targetHeading) : null;
    var interceptBearing = intercept ? bearingBetweenLocalPoints(boatPoint, intercept.point) : null;
    var speed = sog;
    var speedSource = speed != null && speed > 0.2 ? 'GPS SOG' : '';

    if ((speed == null || speed <= 0.2) && course) {
      speed = toNumber(course.boatSpeed);
      speedSource = speed ? 'target BSP' : '';
    }

    var interceptSeconds = intercept && speed && speed > 0.2 ? intercept.distance / speed * 3600 : null;
    var interceptTimeLabel = interceptSeconds == null ? '--' : formatDurationShort(interceptSeconds);
    var boundsPoints = [boatPoint, nextPoint].concat(routeMarks.map(function (item) { return item.point; }));
    if (portBack) boundsPoints.push(portBack);
    if (stbdBack) boundsPoints.push(stbdBack);
    if (cogEnd) boundsPoints.push(cogEnd);
    if (intercept && intercept.distance <= Math.max(nav.distance * 8, 3)) boundsPoints.push(intercept.point);
    var rawBounds = tacticalMapBounds(boundsPoints);
    var zoom = tacticalMapZoom();
    var pan = tacticalMapPan();
    var zoomBounds = zoomedMapBounds(rawBounds, boatPoint, zoom);
    var bounds = pannedMapBounds(zoomBounds, pan);
    var viewSpanX = bounds.spanX;
    var viewSpanY = bounds.spanY;

    return {
      boatPoint: boatPoint,
      nextPoint: nextPoint,
      routeMarks: routeMarks,
      portBack: portBack,
      stbdBack: stbdBack,
      cog: cog,
      sog: sog,
      cogEnd: cogEnd,
      tack: tack,
      intercept: intercept,
      interceptBearing: interceptBearing,
      interceptSeconds: interceptSeconds,
      interceptTimeLabel: interceptTimeLabel,
      speed: speed,
      speedSource: speedSource,
      zoom: zoom,
      pan: pan,
      areaLabel: rawBounds.spanX.toFixed(2) + ' x ' + rawBounds.spanY.toFixed(2) + 'nm',
      viewSpanX: viewSpanX,
      viewSpanY: viewSpanY,
      viewLabel: viewSpanX.toFixed(2) + ' x ' + viewSpanY.toFixed(2) + 'nm',
      panLabel: pan.x || pan.y ? 'PAN ' + pan.x.toFixed(2) + ',' + pan.y.toFixed(2) + 'nm' : '',
      originLat: originLat,
      bounds: bounds,
      rawBounds: rawBounds,
      project: tacticalMapProjector(bounds)
    };
  }

  function mapZoomControls(context) {
    return '<div class="map-tools">' +
      '<button type="button" onclick="return zoomTacticalMap(-0.5)">-</button>' +
      '<span>ZOOM ' + context.zoom.toFixed(2) + 'x / ' + esc(context.viewLabel) + '</span>' +
      '<button type="button" onclick="return zoomTacticalMap(0.5)">+</button>' +
      '<button type="button" onclick="return fitTacticalMap()">FIT</button>' +
    '</div>';
  }

  function zoomTacticalMap(delta) {
    return changeTacticalZoom(delta);
  }

  function changeTacticalZoom(eventOrDelta, maybeDelta) {
    if (eventOrDelta && eventOrDelta.preventDefault) eventOrDelta.preventDefault();
    var delta = maybeDelta == null ? Number(eventOrDelta) : Number(maybeDelta);
    var settings = activeSettings();
    var next = clampTacticalZoom(tacticalMapZoom() + delta);
    settings.mapZoom = next.toFixed(2);
    saveState();
    renderCurrentView();
    return false;
  }

  function resetTacticalZoom(event) {
    if (event && event.preventDefault) event.preventDefault();
    var settings = activeSettings();
    settings.mapZoom = '1';
    settings.mapPanX = '';
    settings.mapPanY = '';
    saveState();
    renderCurrentView();
    return false;
  }

  function tacticalMapZoom() {
    return clampTacticalZoom(toNumber(activeSettings().mapZoom) || 1);
  }

  function clampTacticalZoom(value) {
    return Math.max(0.75, Math.min(4, Number(value) || 1));
  }

  function zoomedMapBounds(bounds, center, zoom) {
    if (!zoom || Math.abs(zoom - 1) < 0.01) return bounds;
    var spanX = bounds.spanX / zoom;
    var spanY = bounds.spanY / zoom;
    var cx = center ? center.x : (bounds.minX + bounds.maxX) / 2;
    var cy = center ? center.y : (bounds.minY + bounds.maxY) / 2;
    return {
      minX: cx - spanX / 2,
      maxX: cx + spanX / 2,
      minY: cy - spanY / 2,
      maxY: cy + spanY / 2,
      spanX: spanX,
      spanY: spanY
    };
  }

  function tacticalMapPan() {
    var settings = activeSettings();
    return {
      x: toNumber(settings.mapPanX) || 0,
      y: toNumber(settings.mapPanY) || 0
    };
  }

  function pannedMapBounds(bounds, pan) {
    if (!pan || (!pan.x && !pan.y)) return bounds;
    return {
      minX: bounds.minX + pan.x,
      maxX: bounds.maxX + pan.x,
      minY: bounds.minY + pan.y,
      maxY: bounds.maxY + pan.y,
      spanX: bounds.spanX,
      spanY: bounds.spanY
    };
  }

  function startTacticalPan(event) {
    if (window.annaMaiMapGesture && event && String(event.type || '').indexOf('pointer') === 0) {
      if (event.preventDefault) event.preventDefault();
      return false;
    }

    var target = event.currentTarget || byId('tactical-map-svg');
    var pinch = tacticalPinchInfo(event);
    if (pinch && target) {
      window.annaMaiMapGesture = {
        mode: 'pinch',
        startDistance: pinch.distance,
        startZoom: tacticalMapZoom(),
        nextZoom: tacticalMapZoom(),
        moved: false,
        target: target
      };
      if (event.preventDefault) event.preventDefault();
      return false;
    }

    var point = tacticalPanPoint(event);
    if (!point) return false;
    if (target && target.setPointerCapture && event.pointerId != null) {
      try { target.setPointerCapture(event.pointerId); } catch (err) {}
    }
    window.annaMaiMapGesture = {
      mode: 'pan',
      x: point.x,
      y: point.y,
      moved: false,
      spanX: toNumber(target && target.getAttribute('data-span-x')) || 1,
      spanY: toNumber(target && target.getAttribute('data-span-y')) || 1,
      startPan: tacticalMapPan(),
      nextPan: tacticalMapPan(),
      target: target
    };
    if (event.preventDefault) event.preventDefault();
    return false;
  }

  function moveTacticalPan(event) {
    var gesture = window.annaMaiMapGesture;
    if (!gesture) return false;

    if (gesture.mode === 'pinch') {
      var pinch = tacticalPinchInfo(event);
      if (!pinch || !gesture.startDistance) return false;
      var nextZoom = clampTacticalZoom(gesture.startZoom * (pinch.distance / gesture.startDistance));
      gesture.nextZoom = nextZoom;
      gesture.moved = true;
      updateMapZoomLabel(nextZoom, gesture.target);
      if (event.preventDefault) event.preventDefault();
      return false;
    }

    var point = tacticalPanPoint(event);
    if (!point) return false;
    var dxPx = point.x - gesture.x;
    var dyPx = point.y - gesture.y;
    if (Math.abs(dxPx) + Math.abs(dyPx) > 2) gesture.moved = true;
    var dxNm = -dxPx / 320 * gesture.spanX;
    var dyNm = dyPx / 300 * gesture.spanY;
    gesture.nextPan = {
      x: gesture.startPan.x + dxNm,
      y: gesture.startPan.y + dyNm
    };
    updateMapPanLabel(gesture.nextPan, gesture.target);
    if (event.preventDefault) event.preventDefault();
    return false;
  }

  function endTacticalPan(event) {
    var gesture = window.annaMaiMapGesture;
    if (event && event.preventDefault && gesture && gesture.moved) event.preventDefault();
    if (gesture && gesture.moved) {
      var settings = activeSettings();
      if (gesture.mode === 'pinch') {
        settings.mapZoom = clampTacticalZoom(gesture.nextZoom).toFixed(2);
      } else if (gesture.mode === 'pan' && gesture.nextPan) {
        settings.mapPanX = gesture.nextPan.x.toFixed(4);
        settings.mapPanY = gesture.nextPan.y.toFixed(4);
      }
      saveState();
      renderCurrentView();
    }
    window.annaMaiMapGesture = null;
    return false;
  }

  function tacticalPanPoint(event) {
    var source = event && event.touches && event.touches.length ? event.touches[0]
      : event && event.changedTouches && event.changedTouches.length ? event.changedTouches[0]
        : event;
    if (!source || source.clientX == null || source.clientY == null) return null;
    return { x: source.clientX, y: source.clientY };
  }

  function tacticalPinchInfo(event) {
    if (!event || !event.touches || event.touches.length < 2) return null;
    var a = event.touches[0];
    var b = event.touches[1];
    var dx = b.clientX - a.clientX;
    var dy = b.clientY - a.clientY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (!distance || distance < 10) return null;
    return {
      distance: distance,
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2
    };
  }

  function updateMapZoomLabel(zoom, target) {
    var label = target && target.parentNode ? target.parentNode.querySelector('.map-tools span') : null;
    if (label) label.textContent = 'ZOOM ' + zoom.toFixed(2) + 'x / release to redraw';
  }

  function updateMapPanLabel(pan, target) {
    var label = target && target.parentNode ? target.parentNode.querySelector('.map-tools span') : null;
    if (label) label.textContent = 'PAN ' + pan.x.toFixed(2) + ',' + pan.y.toFixed(2) + 'nm / release to redraw';
  }

  function compassBearingPanel(nav, next, context) {
    var phoneHeading = phoneCompassHeading();
    var basis = phoneHeading != null ? phoneHeading : context.cog;
    var basisLabel = phoneHeading != null ? 'phone compass' : context.cog != null ? 'COG fallback' : 'needs Motion Compass';
    var markRel = basis == null ? null : signedAngle(nav.bearing - basis);
    var markMeters = Math.round(nav.distance * 1852);
    var laylineMeters = context.intercept ? Math.round(context.intercept.distance * 1852) + 'm' : '--';
    var laylineTime = context.intercept ? context.interceptTimeLabel : '--';
    var laylineLabel = context.intercept && context.tack ? context.tack.targetLayline + ' layline ahead' : 'layline';
    var laylineSub = context.intercept && context.tack
      ? laylineTime + ' at current speed'
      : context.cog == null ? 'needs GPS COG' : 'no forward intercept on current COG';
    var portLaylineLabel = nav.portStatus === 'no wind' ? '--' : 'P ' + Math.round(nav.port);
    var stbdLaylineLabel = nav.stbdStatus === 'no wind' ? '--' : 'S ' + Math.round(nav.stbd);
    var headingText = phoneHeading == null ? '--' : Math.round(phoneHeading) + ' deg';
    var markText = markRel == null ? Math.round(nav.bearing) + ' deg true' : relativeAngleLabel(markRel);
    var markCode = next ? next.code : 'MARK';

    return '<div id="phone-compass-panel" class="bearing-panel" data-mark-bearing="' + svgNumber(nav.bearing) + '" data-port-bearing="' + (nav.portStatus === 'no wind' ? '' : svgNumber(nav.port)) + '" data-stbd-bearing="' + (nav.stbdStatus === 'no wind' ? '' : svgNumber(nav.stbd)) + '" data-intercept-bearing="' + (context.interceptBearing == null ? '' : svgNumber(context.interceptBearing)) + '" data-cog-bearing="' + (context.cog == null ? '' : svgNumber(context.cog)) + '">' +
      '<div class="bearing-readout">' +
        '<div><span>Next mark</span><strong id="compass-mark-angle">' + esc(markText) + '</strong><em>' + esc(markCode) + ' / ' + markMeters + 'm</em></div>' +
        '<div><span>Laylines</span><strong>' + esc(portLaylineLabel) + ' / ' + esc(stbdLaylineLabel) + '</strong><em>port / starboard headings</em></div>' +
        '<div><span>' + esc(laylineLabel) + '</span><strong>' + esc(laylineMeters) + '</strong><em>' + esc(laylineSub) + '</em></div>' +
      '</div>' +
      '<div class="bearing-readout single">' +
        '<div><span>Phone heading</span><strong id="compass-phone-heading">' + esc(headingText) + '</strong><em id="compass-heading-source">' + esc(basisLabel) + '</em></div>' +
      '</div>' +
      '<svg class="bearing-svg" viewBox="0 0 220 220" role="img" aria-label="Phone compass bearing to next mark and laylines">' +
        '<circle class="bearing-ring" cx="110" cy="110" r="92"></circle>' +
        '<circle class="bearing-ring inner" cx="110" cy="110" r="48"></circle>' +
        '<line class="bearing-axis" x1="110" y1="18" x2="110" y2="202"></line>' +
        '<line class="bearing-axis" x1="18" y1="110" x2="202" y2="110"></line>' +
        '<text x="104" y="16">AHEAD</text>' +
        '<text x="102" y="216">ASTERN</text>' +
        '<text x="5" y="113">L</text>' +
        '<text x="208" y="113">R</text>' +
        '<line class="phone-forward" x1="110" y1="110" x2="110" y2="26"></line>' +
        compassArrow('compass-mark-arrow', 'mark', nav.bearing, basis, markCode) +
        (nav.portStatus === 'no wind' ? '' : compassArrow('compass-port-arrow', 'port', nav.port, basis, 'P')) +
        (nav.stbdStatus === 'no wind' ? '' : compassArrow('compass-stbd-arrow', 'stbd', nav.stbd, basis, 'S')) +
        (context.interceptBearing == null ? '' : compassArrow('compass-intercept-arrow', 'intercept', context.interceptBearing, basis, 'LL')) +
        (context.cog == null ? '' : compassArrow('compass-cog-arrow', 'cog', context.cog, basis, 'COG')) +
        '<circle class="bearing-center" cx="110" cy="110" r="5"></circle>' +
      '</svg>' +
      (phoneHeading == null ? '<div class="api-note">Use Settings &gt; Motion Compass for the arrow to move as the phone turns. Until then this uses COG when available.</div>' : '') +
    '</div>';
  }

  function compassArrow(id, cls, bearing, basis, label) {
    if (bearing == null || !Number.isFinite(Number(bearing))) return '';
    var relative = basis == null ? 0 : signedAngle(Number(bearing) - basis);
    return '<g id="' + id + '" class="bearing-arrow ' + cls + '" data-bearing="' + svgNumber(Number(bearing)) + '" transform="rotate(' + svgNumber(relative) + ' 110 110)">' +
      '<line x1="110" y1="110" x2="110" y2="34"></line>' +
      '<path d="M110 24 L103 40 L117 40 Z"></path>' +
      '<text x="121" y="45">' + esc(label) + '</text>' +
    '</g>';
  }

  function phoneCompassHeading() {
    return toNumber(activeSettings().compassHeading);
  }

  function relativeAngleLabel(angle) {
    if (angle == null || !Number.isFinite(Number(angle))) return '--';
    var rounded = Math.round(signedAngle(angle));
    if (Math.abs(rounded) <= 2) return 'AHEAD';
    if (Math.abs(Math.abs(rounded) - 180) <= 2) return 'ASTERN';
    return Math.abs(rounded) + ' deg ' + (rounded < 0 ? 'L' : 'R');
  }

  function updateCompassViewer(heading) {
    var panel = byId('phone-compass-panel');
    var phoneHeading = toNumber(heading);
    if (!panel || phoneHeading == null) return;

    updateCompassArrow('compass-mark-arrow', phoneHeading);
    updateCompassArrow('compass-port-arrow', phoneHeading);
    updateCompassArrow('compass-stbd-arrow', phoneHeading);
    updateCompassArrow('compass-intercept-arrow', phoneHeading);
    updateCompassArrow('compass-cog-arrow', phoneHeading);

    var markBearing = toNumber(panel.getAttribute('data-mark-bearing'));
    var markEl = byId('compass-mark-angle');
    var headingEl = byId('compass-phone-heading');
    var sourceEl = byId('compass-heading-source');
    if (markEl && markBearing != null) markEl.textContent = relativeAngleLabel(signedAngle(markBearing - phoneHeading));
    if (headingEl) headingEl.textContent = Math.round(phoneHeading) + ' deg';
    if (sourceEl) sourceEl.textContent = 'phone compass';
  }

  function updateCompassArrow(id, phoneHeading) {
    var el = byId(id);
    if (!el) return;
    var bearing = toNumber(el.getAttribute('data-bearing'));
    if (bearing == null) return;
    el.setAttribute('transform', 'rotate(' + svgNumber(signedAngle(bearing - phoneHeading)) + ' 110 110)');
  }

  function tacticalInsightPanel(nav, boat, mark, forecast, context) {
    var windDir = toNumber(forecast.windDir);
    var tideRate = toNumber(forecast.tideRate);
    var tideDir = toNumber(forecast.tideDir);
    var correction = nav.correction == null ? '--' : signedDegreesText(nav.correction);
    var closer = nav.closerLayline || '--';
    var closerDistance = nav.closerDistance == null ? '--' : nav.closerDistance.toFixed(2) + 'nm';
    var tideText = tideRate == null || tideDir == null
      ? 'tide not set'
      : tideRate.toFixed(2) + 'kt to ' + Math.round(tideDir) + ' deg';
    var cogText = context.cog == null ? '--' : Math.round(context.cog) + ' deg';
    var sogText = context.sog == null ? '--' : context.sog.toFixed(1) + 'kt';
    var tackText = context.tack ? context.tack.currentTack : '--';
    var interceptText = context.intercept ? context.tack.targetLayline + ' layline' : '--';
    var interceptSub = context.intercept
      ? context.interceptTimeLabel + (context.speedSource ? ' using ' + context.speedSource : '')
      : context.cog == null ? 'needs GPS COG' : 'no crossing on current COG';
    var markOffCog = context.cog == null ? '--' : relativeAngleLabel(signedAngle(nav.bearing - context.cog));
    var interceptMeters = context.intercept ? Math.round(context.intercept.distance * 1852) + 'm' : '--';

    return '<div style="width:100%;margin-top:8px">' +
      '<div class="stat-row">' +
        statCell('Current GPS', coordLabel(boat), activeActual().gpsAccuracy || activeSettings().gpsAccuracy || 'phone') +
        statCell('Next mark', coordLabel(mark), mark.code || 'mark') +
      '</div>' +
      '<div class="stat-row">' +
        statCell('Bearing / Dist', Math.round(nav.bearing) + ' deg / ' + nav.distance.toFixed(2) + 'nm', 'to mark') +
        statCell('Forecast TWD', windDir == null ? '--' : Math.round(windDir) + ' deg', 'from forecast') +
        statCell('Tide set', tideText, 'layline correction ' + correction) +
      '</div>' +
      '<div class="stat-row">' +
        statCell('Port LL', nav.portStatus === 'no wind' ? '--' : Math.round(nav.port) + ' deg', nav.portDistance == null ? 'needs TWD' : nav.portDistance.toFixed(2) + 'nm away') +
        statCell('Stbd LL', nav.stbdStatus === 'no wind' ? '--' : Math.round(nav.stbd) + ' deg', nav.stbdDistance == null ? 'needs TWD' : nav.stbdDistance.toFixed(2) + 'nm away') +
        statCell('Best call', closer, closerDistance) +
      '</div>' +
      '<div class="stat-row">' +
        statCell('Boat COG / SOG', cogText + ' / ' + sogText, context.speedSource || 'GPS movement') +
        statCell('Mark off COG', markOffCog, 'track relative') +
        statCell('Current tack', tackText, context.tack ? 'from GPS COG' : 'needs COG') +
        statCell('Intercept', interceptText, interceptMeters + ' / ' + interceptSub) +
      '</div>' +
      '<div class="ll-advice">' + tacticalInsightText(nav, tideRate, tideDir, context) + '</div>' +
    '</div>';
  }

  function tacticalInsightText(nav, tideRate, tideDir, context) {
    var text = 'Track to mark is ' + Math.round(nav.bearing) + '&deg; for ' + nav.distance.toFixed(2) + 'nm. ';
    if (context && context.intercept) {
      text += 'On the current COG, intercept the ' + context.tack.targetLayline + ' layline in ' + context.intercept.distance.toFixed(2) + 'nm';
      if (context.interceptSeconds != null) text += ' / ' + context.interceptTimeLabel;
      text += '. ';
    } else if (context && context.cog == null) {
      text += 'Move with live GPS enabled in Settings to get COG and layline intercept time. ';
    } else if (nav.portStatus === 'no wind') {
      text += 'Enter forecast wind direction before layline interception can be calculated. ';
    } else {
      text += 'Current COG does not cross the target layline in the plotted sailing area. ';
    }
    if (nav.closerLayline) {
      text += nav.closerLayline + ' layline is closer at ' + nav.closerDistance.toFixed(2) + 'nm cross-track. ';
    }
    if (nav.correction != null && Math.abs(nav.correction) >= 1) {
      text += 'Current is moving the apparent layline by ' + signedDegrees(nav.correction) + '. ';
    }
    if (tideRate != null && tideDir != null && tideRate >= 0.3) {
      text += 'Validate the tide set on deck before committing to the layline.';
    } else {
      text += 'Treat laylines as a clean-air guide until tide is confirmed.';
    }
    return text;
  }

  function signedDegrees(value) {
    return (value > 0 ? '+' : '') + Math.round(value) + '&deg;';
  }

  function signedDegreesText(value) {
    return (value > 0 ? '+' : '') + Math.round(value) + ' deg';
  }

  function svgPoint(cx, cy, bearing, length) {
    return {
      x: Math.round(cx + Math.sin(toRad(bearing)) * length),
      y: Math.round(cy - Math.cos(toRad(bearing)) * length)
    };
  }

  function svgPointText(point) {
    return svgNumber(point.x) + ',' + svgNumber(point.y);
  }

  function svgNumber(value) {
    return String(Math.round(value * 10) / 10);
  }

  function boundedLabelX(value) {
    return Math.max(8, Math.min(286, Math.round(value + 8)));
  }

  function boundedLabelY(value) {
    return Math.max(18, Math.min(286, Math.round(value)));
  }

  function tacticalMapBounds(points) {
    var minX = points[0].x;
    var maxX = points[0].x;
    var minY = points[0].y;
    var maxY = points[0].y;

    points.forEach(function (point) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });

    var spanX = Math.max(maxX - minX, 0.2);
    var spanY = Math.max(maxY - minY, 0.2);
    var pad = Math.max(spanX, spanY) * 0.14 + 0.04;
    return {
      minX: minX - pad,
      maxX: maxX + pad,
      minY: minY - pad,
      maxY: maxY + pad,
      spanX: spanX + pad * 2,
      spanY: spanY + pad * 2
    };
  }

  function tacticalMapProjector(bounds) {
    var width = 320;
    var height = 300;
    var pad = 22;
    var scale = Math.min((width - pad * 2) / bounds.spanX, (height - pad * 2) / bounds.spanY);
    var drawWidth = bounds.spanX * scale;
    var drawHeight = bounds.spanY * scale;
    var offsetX = (width - drawWidth) / 2;
    var offsetY = (height - drawHeight) / 2;

    return function (point) {
      return {
        x: offsetX + (point.x - bounds.minX) * scale,
        y: height - offsetY - (point.y - bounds.minY) * scale
      };
    };
  }

  function chartTileLayerSvg(context) {
    var tilePlan = chartTilePlan(context);
    if (!tilePlan.tiles.length) return '';

    return '<g class="chart-bg" clip-path="url(#chartclip)">' +
      tilePlan.tiles.map(function (tile) {
        return '<image class="chart-tile" href="https://tile.openstreetmap.org/' + tilePlan.zoom + '/' + tile.x + '/' + tile.y + '.png" x="' + svgNumber(tile.x1) + '" y="' + svgNumber(tile.y1) + '" width="' + svgNumber(tile.width) + '" height="' + svgNumber(tile.height) + '" preserveAspectRatio="none"></image>' +
          '<image class="seamark-tile" href="https://tiles.openseamap.org/seamark/' + tilePlan.zoom + '/' + tile.x + '/' + tile.y + '.png" x="' + svgNumber(tile.x1) + '" y="' + svgNumber(tile.y1) + '" width="' + svgNumber(tile.width) + '" height="' + svgNumber(tile.height) + '" preserveAspectRatio="none"></image>';
      }).join('') +
    '</g>';
  }

  function chartTilePlan(context) {
    var geo = localBoundsToGeo(context.bounds, context.originLat);
    var zoom = chartZoomForSpan(Math.max(context.bounds.spanX, context.bounds.spanY));
    var plan = buildChartTilePlan(context, geo, zoom);

    while (plan.tiles.length > 18 && zoom > 10) {
      zoom -= 1;
      plan = buildChartTilePlan(context, geo, zoom);
    }
    return plan;
  }

  function buildChartTilePlan(context, geo, zoom) {
    var maxTile = Math.pow(2, zoom) - 1;
    var xMin = clampTile(lonToTileX(geo.west, zoom), maxTile);
    var xMax = clampTile(lonToTileX(geo.east, zoom), maxTile);
    var yMin = clampTile(latToTileY(geo.north, zoom), maxTile);
    var yMax = clampTile(latToTileY(geo.south, zoom), maxTile);
    var tiles = [];

    for (var x = xMin; x <= xMax; x += 1) {
      for (var y = yMin; y <= yMax; y += 1) {
        var west = tileXToLon(x, zoom);
        var east = tileXToLon(x + 1, zoom);
        var north = tileYToLat(y, zoom);
        var south = tileYToLat(y + 1, zoom);
        var nw = context.project(localNmPoint({ lat: north, lon: west }, context.originLat));
        var se = context.project(localNmPoint({ lat: south, lon: east }, context.originLat));
        var x1 = Math.min(nw.x, se.x);
        var y1 = Math.min(nw.y, se.y);
        var width = Math.abs(se.x - nw.x);
        var height = Math.abs(se.y - nw.y);
        if (width > 0 && height > 0) {
          tiles.push({ x: x, y: y, x1: x1, y1: y1, width: width, height: height });
        }
      }
    }

    return { zoom: zoom, tiles: tiles };
  }

  function chartZoomForSpan(spanNm) {
    if (spanNm <= 0.8) return 15;
    if (spanNm <= 1.6) return 14;
    if (spanNm <= 3.2) return 13;
    if (spanNm <= 6.4) return 12;
    return 11;
  }

  function localBoundsToGeo(bounds, originLat) {
    var lonScale = 60 * Math.cos(toRad(originLat));
    return {
      west: bounds.minX / lonScale,
      east: bounds.maxX / lonScale,
      south: Math.max(-85, bounds.minY / 60),
      north: Math.min(85, bounds.maxY / 60)
    };
  }

  function lonToTileX(lon, zoom) {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  }

  function latToTileY(lat, zoom) {
    var latRad = toRad(Math.max(-85, Math.min(85, lat)));
    return Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom));
  }

  function tileXToLon(x, zoom) {
    return x / Math.pow(2, zoom) * 360 - 180;
  }

  function tileYToLat(y, zoom) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
    return toDeg(Math.atan((Math.exp(n) - Math.exp(-n)) / 2));
  }

  function clampTile(value, maxTile) {
    return Math.max(0, Math.min(maxTile, value));
  }

  function offsetPoint(point, bearing, distance) {
    var unit = bearingUnit(bearing);
    return {
      x: point.x + unit.x * distance,
      y: point.y + unit.y * distance
    };
  }

  function bearingUnit(bearing) {
    return {
      x: Math.sin(toRad(bearing)),
      y: Math.cos(toRad(bearing))
    };
  }

  function gpsCourseNumber(actual) {
    var settings = activeSettings();
    var actualCourse = toNumber(actual && actual.gpsCourse);
    if (actualCourse != null) return actualCourse;
    return toNumber(settings.gpsCourse);
  }

  function gpsSpeedNumber(actual) {
    var settings = activeSettings();
    var actualSpeed = toNumber(actual && actual.gpsSpeed);
    if (actualSpeed != null) return actualSpeed;
    return toNumber(settings.gpsSpeed);
  }

  function currentTackFromCog(cog, nav) {
    var portDiff = Math.abs(signedAngle(cog - nav.port));
    var stbdDiff = Math.abs(signedAngle(cog - nav.stbd));
    if (portDiff <= stbdDiff) {
      return {
        currentTack: 'Port',
        targetLayline: 'Starboard',
        targetHeading: nav.stbd,
        headingDiff: portDiff
      };
    }
    return {
      currentTack: 'Starboard',
      targetLayline: 'Port',
      targetHeading: nav.port,
      headingDiff: stbdDiff
    };
  }

  function lineRayLaylineIntercept(boatPoint, markPoint, currentBearing, laylineHeading) {
    var a = bearingUnit(currentBearing);
    var b = bearingUnit(normalize(laylineHeading + 180));
    var dx = markPoint.x - boatPoint.x;
    var dy = markPoint.y - boatPoint.y;
    var det = a.x * b.y - a.y * b.x;
    if (Math.abs(det) < 0.0001) return null;

    var t = (dx * b.y - dy * b.x) / det;
    var s = (a.y * dx - a.x * dy) / det;
    if (t < 0 || s < 0) return null;

    return {
      point: {
        x: boatPoint.x + a.x * t,
        y: boatPoint.y + a.y * t
      },
      distance: t,
      laylineDistance: s
    };
  }

  function bearingBetweenLocalPoints(fromPoint, toPoint) {
    return normalize(toDeg(Math.atan2(toPoint.x - fromPoint.x, toPoint.y - fromPoint.y)));
  }

  function formatDurationShort(totalSeconds) {
    var seconds = Math.max(0, Math.round(totalSeconds));
    if (seconds < 60) return seconds + 's';
    var minutes = Math.floor(seconds / 60);
    var remainder = seconds % 60;
    if (minutes < 60) return minutes + 'm ' + String(remainder).padStart(2, '0') + 's';
    var hours = Math.floor(minutes / 60);
    return hours + 'h ' + String(minutes % 60).padStart(2, '0') + 'm';
  }

  function actualLogCard(race) {
    var recent = state.polarSamples.slice(-3).reverse();
    var recentRows = recent.length
      ? '<div class="version-list">' + recent.map(function (sample) {
        return versionRow(sample.race + ' ' + sample.mode, sample.tws + 'kt TWS / ' + sample.speed + 'kt BSP');
      }).join('') + '</div>'
      : '<div class="api-note">No polar samples saved yet.</div>';

    return card('Polar Recording',
      row('Observed TWS', input('actual-tws', '', 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Observed BSP', input('actual-bsp', '', 'knots', 'number', 'step="0.1" inputmode="decimal"')) +
      row('Mode', select('actual-mode', 'upwind', [
        { value: 'upwind', label: 'Upwind' },
        { value: 'downwind', label: 'Downwind' },
        { value: 'reach', label: 'Reach' }
      ])) +
      '<button class="btn-full" onclick="saveActualPolar()">SAVE POLAR SAMPLE</button>' +
      '<button class="btn-full" onclick="downloadPolarFile()" style="margin-top:7px">DOWNLOAD POLAR FILE</button>' +
      '<div class="api-note">Adjustment is automatic: matching samples within 2.5kt TWS are averaged and blended 35% into the ORC baseline target speed. Target angles remain from the baseline.</div>' +
      recentRows,
      race.id + ' / ' + race.day
    );
  }

  function actualBoatPosition(actual) {
    var lat = toNumber(actual.boatLat);
    var lon = toNumber(actual.boatLon);
    if (lat == null || lon == null) {
      var settings = activeSettings();
      lat = toNumber(settings.lastGpsLat);
      lon = toNumber(settings.lastGpsLon);
      if ((lat == null || lon == null) && settings.lastGps) {
        var parts = settings.lastGps.split(',');
        lat = toNumber(parts[0]);
        lon = toNumber(parts[1]);
      }
    }
    if (lat == null || lon == null) return null;
    return { code: 'BOAT', name: BOAT.name, lat: lat, lon: lon };
  }

  function actualNavNumbers(boat, mark, forecast, course) {
    var bearing = bearingTo(boat, mark);
    var distance = distanceNm(boat, mark);
    var windDir = toNumber(forecast.windDir);
    var tackAngle = toNumber(course.tackAngle) || polarTarget(toNumber(forecast.windSpeed) || 10, 'upwind').angle;
    var correction = tideCorrection(forecast, bearing, toNumber(course.boatSpeed) || 5.5);
    var port = windDir == null ? null : normalize(windDir + tackAngle + correction);
    var stbd = windDir == null ? null : normalize(windDir - tackAngle + correction);
    var portDelta = port == null ? null : Math.abs(signedAngle(bearing - port));
    var stbdDelta = stbd == null ? null : Math.abs(signedAngle(bearing - stbd));
    var portDistance = port == null ? null : distanceToLayline(distance, bearing, port);
    var stbdDistance = stbd == null ? null : distanceToLayline(distance, bearing, stbd);
    var closerLayline = portDistance == null || stbdDistance == null ? '' : portDistance < stbdDistance ? 'Port' : 'Starboard';
    var closerDistance = closerLayline === 'Port' ? portDistance : closerLayline === 'Starboard' ? stbdDistance : null;
    var best = portDelta == null ? 'Enter forecast wind direction for layline headings.' : portDelta < stbdDelta ? 'Port tack is closer to the mark bearing.' : 'Starboard tack is closer to the mark bearing.';

    return {
      bearing: bearing,
      distance: distance,
      windDir: windDir,
      tackAngle: tackAngle,
      correction: correction,
      port: port == null ? 0 : port,
      stbd: stbd == null ? 0 : stbd,
      portStatus: portDelta == null ? 'no wind' : Math.round(portDelta) + ' deg off',
      stbdStatus: stbdDelta == null ? 'no wind' : Math.round(stbdDelta) + ' deg off',
      portDistance: portDistance,
      stbdDistance: stbdDistance,
      closerLayline: closerLayline,
      closerDistance: closerDistance,
      advice: 'Bearing to next mark is ' + Math.round(bearing) + '&deg; at ' + distance.toFixed(2) + 'nm. ' + best + laylineDistanceText(portDistance, stbdDistance)
    };
  }

  function distanceToLayline(distance, bearingToMark, laylineHeading) {
    var angle = Math.abs(signedAngle(bearingToMark - laylineHeading));
    if (angle > 90) angle = 180 - angle;
    return Math.abs(distance * Math.sin(toRad(angle)));
  }

  function laylineDistanceText(portDistance, stbdDistance) {
    if (portDistance == null || stbdDistance == null) return '';
    var closer = portDistance < stbdDistance ? 'Port' : 'Starboard';
    var distance = Math.min(portDistance, stbdDistance).toFixed(2);
    return ' ' + closer + ' layline is closer at about ' + distance + 'nm cross-track.';
  }

  function selectActualLeg() {
    var actual = activeActual();
    actual.legIndex = parseInt(valueOf('actual-leg') || '0', 10);
    saveState();
    renderRace();
  }

  function toggleLiveGps() {
    var settings = activeSettings();
    if (!navigator.geolocation) {
      flash('GPS is not available in this WebView.');
      return;
    }
    if (gpsWatchId != null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
      settings.gpsStatus = 'Live stopped';
      settings.lastGpsTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      saveState();
      renderSettings();
      return;
    }
    settings.gpsStatus = 'Live starting';
    saveState();
    renderSettings();
    gpsWatchId = navigator.geolocation.watchPosition(function (position) {
      storeGpsPosition(position, 'live');
    }, function (err) {
      activeSettings().gpsStatus = 'Live failed';
      activeSettings().lastGpsTime = err.message;
      saveState();
      if (state.currentView === 'settings') renderSettings();
      flash('Live GPS failed: ' + err.message);
    }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 });
  }

  function storeGpsPosition(position, mode) {
    var actual = activeActual();
    var settings = activeSettings();
    var lat = position.coords.latitude.toFixed(5);
    var lon = position.coords.longitude.toFixed(5);
    var time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var speedKnots = Number.isFinite(position.coords.speed) ? (position.coords.speed * 1.94384).toFixed(1) + 'kt' : '';
    var course = Number.isFinite(position.coords.heading) ? Math.round(position.coords.heading) + 'deg' : '';
    var accuracy = position.coords.accuracy == null ? '' : 'accuracy ' + Math.round(position.coords.accuracy) + 'm';

    actual.legIndex = parseInt(valueOf('actual-leg') || actual.legIndex || '0', 10);
    actual.boatLat = lat;
    actual.boatLon = lon;
    actual.lineSpeed = valueOf('actual-line-speed') || actual.lineSpeed;
    actual.lastFix = time;
    actual.gpsAccuracy = accuracy;
    actual.gpsSpeed = speedKnots;
    actual.gpsCourse = course;
    actual.gpsMode = mode;

    settings.gpsStatus = 'Granted';
    settings.lastGps = lat + ', ' + lon;
    settings.lastGpsLat = lat;
    settings.lastGpsLon = lon;
    settings.lastGpsTime = time;
    settings.gpsAccuracy = accuracy;
    settings.gpsSpeed = speedKnots;
    settings.gpsCourse = course;

    saveState();
    if (state.currentView === 'race') renderRace();
    else if (state.currentView === 'settings') renderSettings();
  }

  function saveActualPolar() {
    var tws = toNumber(valueOf('actual-tws'));
    var speed = toNumber(valueOf('actual-bsp'));
    var mode = valueOf('actual-mode') || 'upwind';
    if (tws == null || speed == null) {
      flash('Enter observed TWS and boat speed before saving a polar sample.');
      return;
    }

    state.polarSamples.push({
      race: activeRaceId(),
      mode: mode,
      tws: tws,
      speed: speed,
      time: new Date().toISOString()
    });
    saveState();
    renderCurrentView();
  }

  function downloadPolarFile() {
    var payload = {
      boat: BOAT,
      source: POLAR_SOURCE,
      exportedAt: new Date().toISOString(),
      adjustment: {
        automatic: true,
        blend: '65% ORC baseline speed / 35% matching observed sample average',
        twsWindowKt: 2.5,
        angles: 'Baseline ORC target angles retained'
      },
      samples: state.polarSamples,
      blendedPolar: blendedPolarTable()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'anna-mai-polar-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function saveActualStart() {
    var actual = activeActual();
    actual.startTime = valueOf('actual-start');
    actual.startEpoch = startEpochForRaceTime(activeRace(), actual.startTime);
    actual.startSource = 'Manual RC start time';
    saveState();
    renderRace();
  }

  function saveStartPage() {
    var actual = activeActual();
    actual.startTime = valueOf('actual-start') || actual.startTime;
    actual.startEpoch = actual.startTime ? startEpochForRaceTime(activeRace(), actual.startTime) : actual.startEpoch;
    actual.lineSpeed = valueOf('actual-line-speed') || actual.lineSpeed;
    if (actual.startTime) actual.startSource = actual.startSource || 'Manual RC start time';
    saveState();
    renderRace();
  }

  function syncRcStart(offsetSeconds) {
    var actual = activeActual();
    var target = new Date(Date.now() + offsetSeconds * 1000);
    actual.startEpoch = String(target.getTime());
    actual.startTime = target.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    actual.startSource = offsetSeconds ? 'RC VHF sync: ' + formatDuration(offsetSeconds) + ' to start' : 'RC VHF sync: start signal';
    actual.lineSpeed = valueOf('actual-line-speed') || actual.lineSpeed;
    saveState();
    renderRace();
  }

  function raceOpsCard(race, course) {
    var timeLimit = course.type === 'rtc'
      ? 'Mark 1 50 / target 100 / limit 150 / window 60'
      : 'Mark 1 25 / target 50 / limit 75 / window 30';

    return card('Anna Mai Race Ops',
      '<div class="stat-row">' +
        statCell('Boat', BOAT.name, BOAT.type) +
        statCell('Class', BOAT.className, 'IRC ' + BOAT.handicap) +
        statCell('Warning', race.annaMaiWarning, 'earliest') +
        statCell('Start', race.annaMaiStart, 'earliest') +
      '</div>' +
      '<div class="ll-advice">Start order is IRC0, IRC1, IRC2, IRC3. The next class warning is no sooner than one minute after the previous class start. Orange flag is shown at least five minutes before a warning signal. VHF 77; Flag O means VHF 6. DNS applies four minutes after the starting signal.</div>' +
      '<div class="api-note">' + timeLimit + ' minutes.</div>',
      course.type === 'rtc' ? 'RTC limits' : 'WL limits'
    );
  }

  function startLineCard(forecast, course) {
    var windDir = toNumber(forecast.windDir);
    var lineBearing = getLineBearing(course);
    var stream = toNumber(forecast.tideRate);
    var streamText = stream ? ' Modelled current ' + stream.toFixed(2) + 'kt toward ' + (forecast.tideDir || 'TBC') + '&deg;.' : '';

    if (windDir == null || lineBearing == null) {
      return card('Start Line Preference',
        '<div class="err">Enter forecast wind direction and line bearing in Marks. If COM/PIN coordinates are set, line bearing is calculated from pin to committee.</div>'
      );
    }

    var square = normalize(windDir + 90);
    var bias = signedAngle(lineBearing - square);
    var biasAbs = Math.abs(Math.round(bias));
    var end = biasAbs < 3 ? 'EVEN LINE' : bias > 0 ? 'PIN END' : 'COMMITTEE END';
    var cls = biasAbs < 3 ? 'll-inside' : 'll-crossed';

    return card('Start Line Preference',
      '<div class="ll-hero">' +
        '<div class="ll-card" style="border-color:rgba(212,160,23,.35)"><div class="ll-tack">Favoured</div><div class="ll-dist" style="font-size:30px">' + end + '</div><div class="ll-status ' + cls + '">' + biasAbs + '&deg; bias</div></div>' +
        '<div class="ll-card" style="border-color:rgba(144,202,249,.25)"><div class="ll-tack">Line</div><div class="ll-dist">' + Math.round(lineBearing) + '&deg;</div><div class="ll-brg">square ' + Math.round(square) + '&deg;</div></div>' +
      '</div>' +
      '<div class="ll-advice">Bearing is pin to committee. Treat anything under 3&deg; as effectively even; above 8&deg; is meaningful. ' + streamText + '</div>'
    );
  }

  function courseCard(course) {
    var sequence = courseSequence(course);
    var body = '<div class="active-course-seq">' + (sequence.length ? sequence.map(function (entry, index) {
      return '<div class="acs-item">' + (index ? '<span class="acs-arrow">&rarr;</span>' : '') +
        '<span class="acs-code">' + esc(entry.code) + '</span><span class="acs-rnd ' + entry.rounding + '">' + entry.rounding.toUpperCase() + '</span></div>';
    }).join('') : '<span class="cs-empty">No marks set for this race.</span>') + '</div>';

    var title = course.type === 'rtc' ? 'Round the Cans' : 'Windward Leeward - ' + (wlModel(course) === 'long' ? 'Long' : 'Normal');
    return card(title, body);
  }

  function laylineCard(forecast, course) {
    var windDir = toNumber(forecast.windDir);
    if (windDir == null) {
      return card('Laylines', '<div class="err">Enter forecast wind direction before calculating laylines.</div>');
    }

    var legs = timedCourseLegs(courseLegs(course), forecast, course);
    if (!legs.length) {
      return card('Laylines', '<div class="err">Set course marks and mark positions before calculating laylines.</div>');
    }

    var tackAngle = toNumber(course.tackAngle) || 42;
    var boatSpeed = toNumber(course.boatSpeed) || 5.5;
    var portHeading = normalize(windDir + tackAngle);
    var stbdHeading = normalize(windDir - tackAngle);

    var rows = legs.map(function (leg) {
      var legForecast = tideForecastForElapsed(forecast, leg.startMinutes);
      var correction = tideCorrection(legForecast, leg.bearing, boatSpeed);
      return '<tr>' +
        '<td>' + esc('L' + (leg.index + 1) + ' +' + Math.round(leg.startMinutes) + 'm ' + leg.label) + '</td>' +
        '<td>' + Math.round(leg.bearing) + '&deg;</td>' +
        '<td>' + leg.distance.toFixed(2) + 'nm</td>' +
        '<td>' + Math.round(normalize(portHeading + correction)) + '&deg;</td>' +
        '<td>' + Math.round(normalize(stbdHeading + correction)) + '&deg;</td>' +
      '</tr>';
    }).join('');

    return card('Laylines',
      '<table class="ll-table"><thead><tr><th>Leg</th><th>Brg</th><th>Dist</th><th>Port</th><th>Stbd</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="ll-advice" style="margin-top:8px">' + laylineAdvice(forecast, boatSpeed) + '</div>',
      'boat ' + boatSpeed + 'kt'
    );
  }

  function courseSequence(course) {
    if (course.type === 'rtc') {
      return course.cans.slice();
    }

    var sequence = [];
    var repeats = wlModel(course) === 'long' ? 3 : 2;
    for (var lap = 0; lap < repeats; lap += 1) {
      if (course.windward) sequence.push({ code: course.windward, rounding: 'port' });
      if (course.offset) sequence.push({ code: course.offset, rounding: 'port' });
      if (lap < repeats - 1 && course.gatePort && course.gateStbd) {
        sequence.push({ code: course.gateStbd + '/' + course.gatePort, rounding: 'gate' });
      }
    }
    if (course.gatePort) sequence.push({ code: course.gatePort, rounding: 'port' });
    if (course.finish) sequence.push({ code: course.finish, rounding: 'finish' });
    return sequence;
  }

  function wlModel(course) {
    if (course.wlCourse === 'WL3') return 'long';
    if (course.wlCourse === 'WL2') return 'normal';
    return course.wlCourse === 'long' ? 'long' : 'normal';
  }

  function courseLegs(course) {
    var sequence = courseSequence(course);
    var start = startMidpoint(course);
    var legs = [];
    var from = start;

    sequence.forEach(function (entry) {
      var to = markForCourseEntry(entry);
      if (from && to && hasCoords(from) && hasCoords(to)) {
        legs.push({
          label: (from.code || 'START') + '-' + entry.code,
          bearing: bearingTo(from, to),
          distance: distanceNm(from, to)
        });
      }
      if (to) from = to;
    });

    return legs;
  }

  function markForCourseEntry(entry) {
    if (entry.code.indexOf('/') === -1) return findMark(entry.code);
    var parts = entry.code.split('/');
    var a = findMark(parts[0]);
    var b = findMark(parts[1]);
    if (!a || !b || !hasCoords(a) || !hasCoords(b)) return null;
    return {
      code: entry.code,
      name: 'Gate midpoint',
      lat: (Number(a.lat) + Number(b.lat)) / 2,
      lon: (Number(a.lon) + Number(b.lon)) / 2
    };
  }

  function startMidpoint(course) {
    var pin = findMark(course.pin);
    var committee = findMark(course.committee);
    if (!pin || !committee || !hasCoords(pin) || !hasCoords(committee)) return null;
    return {
      code: 'START',
      name: 'Start line midpoint',
      lat: (Number(pin.lat) + Number(committee.lat)) / 2,
      lon: (Number(pin.lon) + Number(committee.lon)) / 2
    };
  }

  function startLineMetrics(boat, course) {
    var pin = findMark(course.pin);
    var committee = findMark(course.committee);
    if (!boat || !pin || !committee || !hasCoords(boat) || !hasCoords(pin) || !hasCoords(committee)) return null;

    var originLat = (Number(pin.lat) + Number(committee.lat) + Number(boat.lat)) / 3;
    var p = localNmPoint(pin, originLat);
    var c = localNmPoint(committee, originLat);
    var b = localNmPoint(boat, originLat);
    var vx = c.x - p.x;
    var vy = c.y - p.y;
    var wx = b.x - p.x;
    var wy = b.y - p.y;
    var len2 = vx * vx + vy * vy;
    if (!len2) return null;

    var t = (wx * vx + wy * vy) / len2;
    var clamped = Math.max(0, Math.min(1, t));
    var nearest = {
      x: p.x + clamped * vx,
      y: p.y + clamped * vy
    };
    var sideValue = vx * wy - vy * wx;

    return {
      distance: Math.sqrt(Math.pow(b.x - nearest.x, 2) + Math.pow(b.y - nearest.y, 2)),
      length: Math.sqrt(len2),
      pinDistance: distanceNm(boat, pin),
      committeeDistance: distanceNm(boat, committee),
      position: t < 0 ? 'pin extension' : t > 1 ? 'committee extension' : 'between ends',
      side: sideValue >= 0 ? 'line port side' : 'line starboard side'
    };
  }

  function localNmPoint(mark, originLat) {
    return {
      x: Number(mark.lon) * 60 * Math.cos(toRad(originLat)),
      y: Number(mark.lat) * 60
    };
  }

  function getLineBearing(course) {
    var manual = toNumber(course.lineBearing);
    if (manual != null) return normalize(manual);

    var pin = findMark(course.pin);
    var committee = findMark(course.committee);
    if (!pin || !committee || !hasCoords(pin) || !hasCoords(committee)) return null;
    return bearingTo(pin, committee);
  }

  function hasCoords(mark) {
    return toNumber(mark.lat) != null && toNumber(mark.lon) != null;
  }

  function findMark(code) {
    return state.marks.find(function (mark) { return mark.code === code; });
  }

  function tideCorrection(forecast, legBearing, boatSpeed) {
    var rate = toNumber(forecast.tideRate);
    var tideDir = toNumber(forecast.tideDir);
    if (rate == null || tideDir == null || !boatSpeed) return 0;
    var ratio = Math.min(Math.abs(rate / boatSpeed), 0.95);
    var cross = Math.sin(toRad(signedAngle(tideDir - legBearing)));
    return toDeg(Math.asin(ratio * cross));
  }

  function laylineAdvice(forecast, boatSpeed) {
    var rate = toNumber(forecast.tideRate);
    var dir = toNumber(forecast.tideDir);
    if (rate == null || dir == null || rate < 0.2) {
      return 'Stream correction is small or not set. Use the headings as a clean-air starting point and confirm against instruments.';
    }
    var correction = Math.round(toDeg(Math.asin(Math.min(rate / boatSpeed, 0.95))));
    return 'A modelled ' + rate.toFixed(2) + 'kt current can move apparent laylines by up to about ' + correction + '&deg; at ' + boatSpeed + 'kt boat speed. Direction entered: ' + Math.round(dir) + '&deg; flowing to. Use the SI tide table and instruments as the authority near shore.';
  }

  function valueOf(id) {
    var el = byId(id);
    return el ? el.value : '';
  }

  function secondsToStart(date, hhmm) {
    var match = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/);
    if (!date || !match) return null;
    var target = new Date(date + 'T' + match[1].padStart(2, '0') + ':' + match[2] + ':00');
    if (Number.isNaN(target.getTime())) return null;
    return Math.round((target.getTime() - Date.now()) / 1000);
  }

  function startEpochForRaceTime(race, hhmm) {
    var match = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/);
    if (!race || !race.date || !match) return '';
    var target = new Date(race.date + 'T' + match[1].padStart(2, '0') + ':' + match[2] + ':00');
    return Number.isNaN(target.getTime()) ? '' : String(target.getTime());
  }

  function raceStartInfo(race, forecast, actual) {
    var epoch = actual && Number(actual.startEpoch);
    if (epoch && Number.isFinite(epoch)) {
      return {
        seconds: Math.round((epoch - Date.now()) / 1000),
        label: new Date(epoch).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        source: actual.startSource || 'RC VHF sync'
      };
    }

    var start = actual && actual.startTime || forecast.start || race.annaMaiStart || '';
    return {
      seconds: secondsToStart(race.date, start),
      label: start,
      source: actual && actual.startTime ? 'Manual RC start time' : 'Schedule reference'
    };
  }

  function formatDuration(totalSeconds) {
    var seconds = Math.max(0, Math.round(totalSeconds));
    var minutes = Math.floor(seconds / 60);
    var remainder = seconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(remainder).padStart(2, '0');
  }

  function refreshAll() {
    renderCurrentView();
  }

  function updateTimestamp() {
    var upd = byId('upd');
    if (!upd) return;
    upd.innerHTML = 'Poole Bay<br>Updated ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function isEditingField() {
    var el = document.activeElement;
    return el && ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(el.tagName) !== -1;
  }

  function flash(message) {
    var overlay = byId('err-overlay');
    var body = byId('err-msg');
    if (!overlay || !body) return;
    body.textContent = message;
    overlay.style.display = 'block';
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

  function init() {
    window.showView = showView;
    window.refreshAll = refreshAll;
    window.selectRace = selectRace;
    window.saveForecast = saveForecast;
    window.fetchForecastApi = fetchForecastApi;
    window.setCourseType = setCourseType;
    window.saveWindwardLeeward = saveWindwardLeeward;
    window.saveCansSettings = saveCansSettings;
    window.addCansMark = addCansMark;
    window.removeCansMark = removeCansMark;
    window.toggleCanRounding = toggleCanRounding;
    window.saveMark = saveMark;
    window.saveMarkFromCommittee = saveMarkFromCommittee;
    window.saveWlMarksFromCommittee = saveWlMarksFromCommittee;
    window.saveWLMarksFromCommittee = saveWlMarksFromCommittee;
    window.saveW1MarksFromCommittee = saveWlMarksFromCommittee;
    window.saveW1MarksFromComitte = saveWlMarksFromCommittee;
    window.editMark = editMark;
    window.deleteMark = deleteMark;
    window.setRaceTab = setRaceTab;
    window.selectActualLeg = selectActualLeg;
    window.changeTacticalZoom = changeTacticalZoom;
    window.zoomTacticalMap = zoomTacticalMap;
    window.resetTacticalZoom = resetTacticalZoom;
    window.fitTacticalMap = resetTacticalZoom;
    window.startTacticalPan = startTacticalPan;
    window.moveTacticalPan = moveTacticalPan;
    window.endTacticalPan = endTacticalPan;
    window.saveActualPolar = saveActualPolar;
    window.saveActualStart = saveActualStart;
    window.saveStartPage = saveStartPage;
    window.syncRcStart = syncRcStart;
    window.saveSettings = saveSettings;
    window.requestGpsPermission = requestGpsPermission;
    window.toggleLiveGps = toggleLiveGps;
    window.requestMotionPermission = requestMotionPermission;
    window.requestWakeLock = requestWakeLock;
    window.requestSoundPermission = requestSoundPermission;
    window.downloadPolarFile = downloadPolarFile;

    if (activeSettings().compassHeading) startCompassWatch();
    showView(state.currentView || 'forecast');
    setInterval(function () {
      updateTimestamp();
      if (state.currentView === 'race' && state.raceTab === 'start' && !isEditingField()) {
        renderRace();
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
