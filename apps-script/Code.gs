/**
 * ============================================================
 *  LSCMUN 2026 — registration endpoint + sorted storage
 *
 *  HOW THE STORAGE IS ORGANISED
 *
 *  "All Registrations"  — the master sheet. Every submission lands
 *                         here, one row each. THIS IS THE ONLY PLACE
 *                         ANYONE SHOULD TYPE. Finance marks payments
 *                         verified here; Logistics fills allocations
 *                         here.
 *
 *  "Delegates", "Chairpersons", "Press", "Security", "Runners"
 *                       — one tab per category. These are LIVE VIEWS
 *                         built with a QUERY formula, not copies. They
 *                         update themselves the instant the master
 *                         changes. Do not type into them: anything you
 *                         enter will be overwritten.
 *
 *  "Summary"            — live counts: how many per category, how many
 *                         paid, money collected, and demand per council
 *                         so Logistics can see which rooms are
 *                         oversubscribed.
 *
 *  Nothing is duplicated, so nothing can fall out of sync.
 *
 *  SETUP
 *  1. Open your Sheet -> Extensions -> Apps Script
 *  2. Replace everything in Code.gs with this file
 *  3. Set SHEET_ID below
 *  4. Run `setup` once (authorise when prompted). This builds every tab.
 *  5. Deploy -> New deployment -> Web app
 *       Execute as:      Me
 *       Who has access:  Anyone
 *  6. Paste the /exec URL into `sheetEndpoint` in assets/js/config.js
 * ============================================================
 */

/* ---- 1. CONFIGURE THIS ------------------------------------ */

// From your Sheet's URL: docs.google.com/spreadsheets/d/THIS_PART/edit
var SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

var MASTER_TAB   = 'All Registrations';
var SUMMARY_TAB  = 'Summary';
var DRIVE_FOLDER = 'LSCMUN 2026 — Payment Proofs';
var ID_PREFIX    = 'LSC26';

/* ---- 2. COLUMN ORDER --------------------------------------
   Add or remove a row here and every tab, formula and summary
   re-points itself. Nothing else needs editing.
   ----------------------------------------------------------- */

var COLUMNS = [
  ['id',            'Reference'],
  ['submittedAt',   'Submitted (UTC)'],
  ['fullName',      'Full name'],
  ['email',         'Christ email'],
  ['phone',         'Phone'],
  ['course',        'Course & year'],
  ['role',          'Role'],
  ['experience',    'MUN experience'],
  ['council1',      'Council pref 1'],
  ['council2',      'Council pref 2'],
  ['council3',      'Council pref 3'],
  ['countryPref',   'Country preference'],
  ['paymentMethod', 'Payment method'],
  ['utr',           'UTR / reference'],
  ['amountPaid',    'Amount paid'],
  ['paymentDate',   'Payment date'],
  ['proofUrl',      'Payment proof'],
  ['access',        'Accessibility'],
  ['emergency',     'Emergency contact'],
  /* ---- Chairperson application only (blank for every other role) ---- */
  ['chairCommittee1',        'Chair pref 1'],
  ['chairCommittee2',        'Chair pref 2'],
  ['chairExpDelegating',     'Experience: delegating'],
  ['chairExpChairing',       'Experience: chairing'],
  ['chairExpSecretariat',    'Experience: secretariat'],
  ['chairedDetails',         'Chaired before (conference & committee)'],
  ['chairQuality',           'What makes a good chair'],
  ['chairTrainingAvailable', 'Available for chair training'],
  ['chairScenario',          'Scenario response'],
  ['paymentStatus', 'Payment verified'],   // Finance fills this in
  ['allocation',    'Allocated council'],  // Logistics fills this in
  ['country',       'Allocated country'],  // Logistics fills this in
  /* Added after the sheet was already live — appended at the end so
     existing columns and data don't shift. */
  ['foodPreference', 'Food preference'],
  ['pressWing',       'Press wing']          // Press role only
];

/* Categories the registrations get split into. The `match` value must
   match exactly what the website sends in the Role field. */
var CATEGORIES = [
  { tab: 'Delegates',    match: 'Delegate'    },
  { tab: 'Chairpersons', match: 'Chairperson' },
  { tab: 'Press',        match: 'Press'       },
  { tab: 'Security',     match: 'Security'    },
  { tab: 'Runners',      match: 'Runner'      }
];

/* Reference-number prefixes, so LSC26-DEL-0007 tells Finance the
   category at a glance without a lookup. */
var ROLE_CODE = {
  'Delegate': 'DEL', 'Chairperson': 'CHR', 'Press': 'PRS',
  'Security': 'SEC', 'Runner': 'RUN'
};

/* ---- 3. ENDPOINT ------------------------------------------ */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);                    // serialise writes so rows never collide

    var data  = JSON.parse(e.postData.contents);
    var sheet = getMaster_();

    data.id            = nextId_(sheet, data.role);
    data.proofUrl      = data.proofData ? saveProof_(data.proofData, data.proofName, data.id) : '';
    data.paymentStatus = 'Pending';

    sheet.appendRow(COLUMNS.map(function (c) { return data[c[0]] || ''; }));

    return json_({ ok: true, id: data.id });

  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return json_({ ok: true, message: 'LSCMUN 2026 registration endpoint is live.' });
}

/* ---- 4. SHEET PLUMBING ------------------------------------ */

function colLetter_(key) {
  for (var i = 0; i < COLUMNS.length; i++) {
    if (COLUMNS[i][0] === key) {
      var n = i + 1, s = '';
      while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; }
      return s;
    }
  }
  throw new Error('Unknown column: ' + key);
}

function getMaster_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(MASTER_TAB) || ss.insertSheet(MASTER_TAB);
  if (sheet.getLastRow() === 0) {
    var headers = COLUMNS.map(function (c) { return c[1]; });
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
         .setFontWeight('bold').setBackground('#2E2317').setFontColor('#F1EACD');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

/* Sequential per category: LSC26-DEL-0001, LSC26-DEL-0002, ... */
function nextId_(sheet, role) {
  var code = ROLE_CODE[role] || 'GEN';
  var n = 1;
  if (sheet.getLastRow() > 1) {
    var roleCol = COLUMNS.map(function (c) { return c[0]; }).indexOf('role') + 1;
    var used = sheet.getRange(2, roleCol, sheet.getLastRow() - 1, 1).getValues();
    used.forEach(function (r) { if (r[0] === role) n++; });
  }
  return ID_PREFIX + '-' + code + '-' + ('000' + n).slice(-4);
}

function saveProof_(dataUrl, filename, id) {
  try {
    var parts = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
    if (!parts) return '';
    var blob = Utilities.newBlob(
      Utilities.base64Decode(parts[2]), parts[1], id + '_' + (filename || 'proof')
    );
    var folders = DriveApp.getFoldersByName(DRIVE_FOLDER);
    var folder  = folders.hasNext() ? folders.next() : DriveApp.createFolder(DRIVE_FOLDER);
    return folder.createFile(blob).getUrl();
  } catch (err) {
    return 'UPLOAD FAILED: ' + err;
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}

/* ---- 5. CATEGORY TABS (live views, not copies) ------------ */

function buildCategoryTabs_() {
  var ss      = SpreadsheetApp.openById(SHEET_ID);
  var lastCol = colLetter_(COLUMNS[COLUMNS.length - 1][0]);
  var roleCol = colLetter_('role');

  CATEGORIES.forEach(function (cat) {
    var sh = ss.getSheetByName(cat.tab) || ss.insertSheet(cat.tab);
    sh.clear();

    sh.getRange('A1').setValue(cat.tab + ' — live view. Do not type here; edit "' +
                MASTER_TAB + '" instead.')
      .setFontWeight('bold').setFontColor('#8A6A2F');

    // One formula rebuilds the whole table whenever the master changes.
    sh.getRange('A3').setFormula(
      '=IFERROR(QUERY(\'' + MASTER_TAB + '\'!A:' + lastCol +
      ', "select * where ' + roleCol + ' = \'' + cat.match + '\'", 1),' +
      ' "No ' + cat.tab.toLowerCase() + ' registered yet.")'
    );
    sh.setFrozenRows(3);
  });
}

/* ---- 6. SUMMARY ------------------------------------------- */

function buildSummary_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(SUMMARY_TAB) || ss.insertSheet(SUMMARY_TAB, 0);
  sh.clear();

  var M   = "'" + MASTER_TAB + "'!";
  var rC  = M + colLetter_('role')          + ':' + colLetter_('role');
  var pC  = M + colLetter_('paymentStatus') + ':' + colLetter_('paymentStatus');
  var aC  = M + colLetter_('amountPaid')    + ':' + colLetter_('amountPaid');
  var c1  = M + colLetter_('council1')      + ':' + colLetter_('council1');
  var c2  = M + colLetter_('council2')      + ':' + colLetter_('council2');
  var c3  = M + colLetter_('council3')      + ':' + colLetter_('council3');

  var rows = [['LSCMUN 2026 — registration summary', '', ''],
              ['Updates automatically. Nothing here needs typing.', '', ''],
              ['', '', ''],
              ['BY CATEGORY', 'Registered', 'Payment verified']];

  CATEGORIES.forEach(function (cat) {
    rows.push([
      cat.tab,
      '=COUNTIF(' + rC + ',"' + cat.match + '")',
      '=COUNTIFS(' + rC + ',"' + cat.match + '",' + pC + ',"Verified")'
    ]);
  });

  rows.push(['', '', '']);
  rows.push(['TOTALS', '', '']);
  rows.push(['Registrations',        '=COUNTA(' + M + colLetter_('id') + ':' + colLetter_('id') + ')-1', '']);
  rows.push(['Payments verified',    '=COUNTIF(' + pC + ',"Verified")', '']);
  rows.push(['Payments pending',     '=COUNTIF(' + pC + ',"Pending")', '']);
  rows.push(['Amount collected (₹)', '=SUMIF(' + pC + ',"Verified",' + aC + ')', '']);
  rows.push(['Amount outstanding (₹)', '=SUMIF(' + pC + ',"Pending",' + aC + ')', '']);
  rows.push(['', '', '']);
  rows.push(['COUNCIL DEMAND', 'First choice', 'Any of three']);

  COUNCIL_CODES.forEach(function (code) {
    rows.push([
      code,
      '=COUNTIF(' + c1 + ',"' + code + '")',
      '=COUNTIF(' + c1 + ',"' + code + '")+COUNTIF(' + c2 + ',"' + code +
        '")+COUNTIF(' + c3 + ',"' + code + '")'
    ]);
  });

  sh.getRange(1, 1, rows.length, 3).setValues(rows);
  sh.getRange('A1').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2').setFontColor('#777777');
  [4, 4 + CATEGORIES.length + 2, 4 + CATEGORIES.length + 9].forEach(function (r) {
    sh.getRange(r, 1, 1, 3).setFontWeight('bold')
      .setBackground('#2E2317').setFontColor('#F1EACD');
  });
  sh.setColumnWidth(1, 240);
}

/* Must match the council codes in assets/js/data.js. */
var COUNCIL_CODES = ['WCC','WHO','UNEP','UNODC','IAEA','UNOOSA',
                     'UNSC','UNCSW','ECOSOC'];

/* ---- 7. RUN ONCE ------------------------------------------
   Select `setup` in the toolbar dropdown and press Run. Builds
   the master sheet, all five category tabs and the summary, and
   triggers the Google authorisation prompt.

   Safe to run again at any time — it rebuilds the views without
   touching a single row of registration data.
   ----------------------------------------------------------- */
function setup() {
  getMaster_();
  buildCategoryTabs_();
  buildSummary_();
  Logger.log('Ready. Master "%s" + %s category tabs + summary.',
             MASTER_TAB, CATEGORIES.length);
}

/* Optional: verify end-to-end without touching the website. */
function testSubmission() {
  var fake = {
    postData: { contents: JSON.stringify({
      submittedAt: new Date().toISOString(),
      fullName: 'Test Delegate', email: 'test@christuniversity.in', phone: '+91 90000 00000',
      course: '3 BSc Biotechnology',
      role: 'Delegate', experience: 'None — this is my first',
      council1: 'WHO', council2: 'UNEP', council3: 'UNSC', countryPref: 'None',
      paymentMethod: 'UPI', utr: '123456789012', amountPaid: '699', paymentDate: '2026-09-10',
      access: 'None', emergency: 'Test contact, +91 90000 00001'
    })}
  };
  Logger.log(doPost(fake).getContent());
}
