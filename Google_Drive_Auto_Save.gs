/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 💍 كود جوجل درايف الأوتوماتيكي الكامل — خطوبة أحمد & ندى (Ahmed & Nada)
 * ═══════════════════════════════════════════════════════════════════════════════
 * ماذا يفعل هذا الكود تلقائياً؟
 * 1. ينشئ فولدر رئيسي في Google Drive عندك باسم:
 *    "💍 ألبوم ودفتر تهاني خطوبة أحمد وندى (Ahmed & Nada)"
 * 2. ينشئ بداخله:
 *    - فولدر "📸 صور المعازيم والفلتر" (يتحفظ فيه أي صورة يرفعها الضيف من موبايله أو يتصورها بالفلتر أو الخاتم 3D)
 *    - فولدر "🎤 التهاني الصوتية" (يتحفظ فيه أي تسجيل صوتي من المعازيم)
 *    - ملف "📖 دفتر التهاني وطلبات الأغاني - أحمد وندى" (جدول Google Sheet منظم فيه كل التهاني والصور واللينكات والأغاني)
 *    - ملف نصي "💌 كل التهاني المكتوبة.txt" جوه الفولدر يتحدث أوتوماتيك مع كل تهنئة جديدة!
 * ═══════════════════════════════════════════════════════════════════════════════
 */

function setupWeddingDrive() {
  var resources = getOrCreateWeddingResources_();
  Logger.log('✅ تم تجهيز فولدر جوجل درايف ودفتر التهاني بنجاح!');
  Logger.log('📂 رابط فولدر جوجل درايف (شارك هذا الرابط أو احتفظ به): ' + resources.mainFolderUrl);
  Logger.log('📊 رابط جدول التهاني (Google Sheet): ' + resources.sheetUrl);
  return resources;
}

function getOrCreateWeddingResources_() {
  var props = PropertiesService.getScriptProperties();
  var mainFolderId = props.getProperty('MAIN_FOLDER_ID');
  var photosFolderId = props.getProperty('PHOTOS_FOLDER_ID');
  var voiceFolderId = props.getProperty('VOICE_FOLDER_ID');
  var sheetId = props.getProperty('SHEET_ID');
  var textFileId = props.getProperty('TEXT_FILE_ID');

  var mainFolder, photosFolder, voiceFolder, ss, textFile;

  // 1. الفولدر الرئيسي
  if (mainFolderId) {
    try { mainFolder = DriveApp.getFolderById(mainFolderId); } catch (e) { mainFolder = null; }
  }
  if (!mainFolder) {
    mainFolder = DriveApp.createFolder('💍 ألبوم ودفتر تهاني خطوبة أحمد وندى (Ahmed & Nada)');
    try {
      mainFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}
    props.setProperty('MAIN_FOLDER_ID', mainFolder.getId());
  }

  // 2. فولدر الصور
  if (photosFolderId) {
    try { photosFolder = DriveApp.getFolderById(photosFolderId); } catch (e) { photosFolder = null; }
  }
  if (!photosFolder) {
    photosFolder = mainFolder.createFolder('📸 صور المعازيم والفلتر - Ahmed & Nada');
    props.setProperty('PHOTOS_FOLDER_ID', photosFolder.getId());
  }

  // 3. فولدر التسجيلات الصوتية
  if (voiceFolderId) {
    try { voiceFolder = DriveApp.getFolderById(voiceFolderId); } catch (e) { voiceFolder = null; }
  }
  if (!voiceFolder) {
    voiceFolder = mainFolder.createFolder('🎤 التهاني الصوتية - Ahmed & Nada');
    props.setProperty('VOICE_FOLDER_ID', voiceFolder.getId());
  }

  // 4. جدول Google Sheet لدفتر التهاني وطلبات الأغاني
  if (sheetId) {
    try { ss = SpreadsheetApp.openById(sheetId); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('📖 دفتر التهاني وطلبات الأغاني — أحمد وندى');
    var ssFile = DriveApp.getFileById(ss.getId());
    mainFolder.addFile(ssFile);
    try { DriveApp.getRootFolder().removeFile(ssFile); } catch (e) {}

    // تهيئة ورقة التهاني والصور
    var wishesSheet = ss.getActiveSheet();
    wishesSheet.setName('دفتر التهاني والصور');
    wishesSheet.appendRow(['التاريخ والوقت', 'اسم الضيف', 'نوع المشاركة', 'نص التهنئة / الكلمة', 'رابط الصورة أو الصوت في الدرايف', 'المصدر']);
    wishesSheet.setFrozenRows(1);
    wishesSheet.setRightToLeft(true);

    // تهيئة ورقة طلبات الأغاني
    var songsSheet = ss.insertSheet('طلبات الأغاني');
    songsSheet.appendRow(['التاريخ والوقت', 'اسم الضيف', 'اسم الأغنية', 'الفنان', 'إهداء / رسالة']);
    songsSheet.setFrozenRows(1);
    songsSheet.setRightToLeft(true);

    props.setProperty('SHEET_ID', ss.getId());
  }

  // 5. ملف نصي تجميعي لكل التهاني داخل الدرايف مباشرة
  if (textFileId) {
    try { textFile = DriveApp.getFileById(textFileId); } catch (e) { textFile = null; }
  }
  if (!textFile) {
    var header = '═══════════════════════════════════════════════════════\r\n' +
                 '💍 دفتر تهاني وذكريات خطوبة أحمد & ندى (Ahmed & Nada)\r\n' +
                 '📅 الجمعة ٢٠ نوفمبر ٢٠٢٦ — Vera Lounge\r\n' +
                 '═══════════════════════════════════════════════════════\r\n\r\n';
    textFile = mainFolder.createFile('💌 كل التهاني المكتوبة - أحمد وندى.txt', header, MimeType.PLAIN_TEXT);
    props.setProperty('TEXT_FILE_ID', textFile.getId());
  }

  return {
    mainFolder: mainFolder,
    photosFolder: photosFolder,
    voiceFolder: voiceFolder,
    ss: ss,
    textFile: textFile,
    mainFolderUrl: mainFolder.getUrl(),
    photosFolderUrl: photosFolder.getUrl(),
    sheetUrl: ss.getUrl()
  };
}

/**
 * عند فتح رابط الـ Web App في المتصفح يعرض لوحة تحكم أنيقة فيها رابط الدرايف ورابط الشيت
 */
function doGet(e) {
  var res = getOrCreateWeddingResources_();
  var html = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>ألبوم ودفتر تهاني خطوبة أحمد وندى</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&display=swap" rel="stylesheet">' +
    '<style>body{font-family:Cairo,sans-serif;background:#FAF6F0;color:#2C1E12;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center}' +
    '.box{background:#fff;border:2px solid #C5A059;border-radius:24px;padding:32px 24px;max-width:480px;width:100%;box-shadow:0 15px 40px rgba(0,0,0,0.1)}' +
    'h1{color:#6E502D;font-size:24px;margin:0 0 8px}p{color:#5A4632;font-size:14px;line-height:1.7}' +
    '.btn{display:block;text-decoration:none;padding:14px 20px;border-radius:16px;font-weight:800;margin:12px 0;font-size:15px;transition:0.2s}' +
    '.btn-drive{background:linear-gradient(135deg,#6E502D,#967142);color:#fff;box-shadow:0 6px 18px rgba(110,80,45,0.3)}' +
    '.btn-sheet{background:#FAF0D7;color:#4A341B;border:1.5px solid #C5A059}' +
    '</style></head><body><div class="box">' +
    '<div style="font-size:48px;margin-bottom:8px">💍✨</div>' +
    '<h1>ألبوم ودفتر تهاني أحمد & ندى</h1>' +
    '<p>تم تفعيل الحفظ التلقائي بنجاح! أي تهنئة أو صورة يرفعها المعازيم أو يتصوروها بالفلتر بتتحفظ فوراً هنا:</p>' +
    '<a class="btn btn-drive" href="' + res.mainFolderUrl + '" target="_blank">📂 فتح فولدر Google Drive (الصور والتهاني)</a>' +
    '<a class="btn btn-sheet" href="' + res.photosFolderUrl + '" target="_blank">📸 فتح فولدر صور المعازيم مباشرة</a>' +
    '<a class="btn btn-sheet" href="' + res.sheetUrl + '" target="_blank">📊 فتح جدول دفتر التهاني والأغاني (Google Sheet)</a>' +
    '</div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('ألبوم ودفتر تهاني خطوبة أحمد وندى');
}

/**
 * يستقبل التهاني النصية، الصور المرفوعة، صور الفلتر، التسجيلات الصوتية، وطلبات الأغاني
 */
function doPost(e) {
  try {
    var res = getOrCreateWeddingResources_();
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    var now = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyy-MM-dd hh:mm:ss a');
    var action = data.action || 'wish';
    var guestName = (data.name || 'ضيف كريم').toString().trim();
    var safeName = guestName.replace(/[\\/:*?"<>|]/g, '_');
    var message = (data.message || '').toString().trim();
    var source = (data.source || 'website').toString();

    var wishesSheet = res.ss.getSheetByName('دفتر التهاني والصور') || res.ss.getSheets()[0];
    var songsSheet = res.ss.getSheetByName('طلبات الأغاني') || res.ss.getSheets()[0];

    var fileUrl = '';

    // 1. لو الضيف رافع صورة أو متصور بالفلتر أو مرفق صورة مع التهنئة
    if (data.image && data.image.indexOf('base64,') !== -1) {
      var parts = data.image.split('base64,');
      var mimeMatch = parts[0].match(/data:(.*?);/);
      var mimeType = (mimeMatch && mimeMatch[1]) ? mimeMatch[1] : 'image/jpeg';
      var ext = mimeType.indexOf('png') !== -1 ? '.png' : '.jpg';
      var bytes = Utilities.base64Decode(parts[1]);
      var stamp = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyyMMdd_HHmmss');
      var fileName = 'صورة_' + safeName + '_' + stamp + ext;
      var blob = Utilities.newBlob(bytes, mimeType, fileName);
      var savedImg = res.photosFolder.createFile(blob);
      if (message) {
        savedImg.setDescription('من: ' + guestName + ' | الرسالة: ' + message);
      }
      fileUrl = savedImg.getUrl();
    }

    // 2. لو الضيف مسجل تهنئة صوتية
    if (data.audio && data.audio.indexOf('base64,') !== -1) {
      var aParts = data.audio.split('base64,');
      var aMimeMatch = aParts[0].match(/data:(.*?);/);
      var aMime = (aMimeMatch && aMimeMatch[1]) ? aMimeMatch[1] : 'audio/webm';
      var aBytes = Utilities.base64Decode(aParts[1]);
      var aStamp = Utilities.formatDate(new Date(), 'Africa/Cairo', 'yyyyMMdd_HHmmss');
      var aFileName = 'تهنئة_صوتية_' + safeName + '_' + aStamp + '.webm';
      var aBlob = Utilities.newBlob(aBytes, aMime, aFileName);
      var savedAudio = res.voiceFolder.createFile(aBlob);
      fileUrl = savedAudio.getUrl();
    }

    // 3. لو طلب أغنية
    if (action === 'song_request') {
      songsSheet.appendRow([
        now,
        guestName,
        data.songTitle || '',
        data.songArtist || '',
        message
      ]);
    } else {
      // تهنئة كتابية أو صورة مرفوعة أو صورة فلتر أو تسجيل صوتي
      var typeLabel = '✍️ تهنئة كتابية';
      if (action === 'guest_photo') typeLabel = '📸 صورة مضافة من الضيف';
      else if (action === 'photo') typeLabel = '🤳 صورة بفلتر الخطوبة';
      else if (action === 'voice') typeLabel = '🎤 تهنئة صوتية';
      else if (fileUrl) typeLabel = '✍️📸 تهنئة مع صورة';

      wishesSheet.appendRow([
        now,
        guestName,
        typeLabel,
        message || (action === 'photo' ? 'صورة تذكارية بفلتر الخطوبة' : 'صورة مضافة لألبوم العروسين'),
        fileUrl,
        source
      ]);

      // إضافة التهنئة للملف النصي داخل فولدر الدرايف أيضاً
      if (message || fileUrl) {
        try {
          var currentTxt = res.textFile.getBlob().getDataAsString('UTF-8');
          var entry = '📅 ' + now + '\r\n' +
                      '👤 الاسم: ' + guestName + ' (' + typeLabel + ')\r\n' +
                      (message ? '💌 الرسالة: ' + message + '\r\n' : '') +
                      (fileUrl ? '🔗 رابط الملف في الدرايف: ' + fileUrl + '\r\n' : '') +
                      '───────────────────────────────────────────────\r\n';
          res.textFile.setContent(currentTxt + entry);
        } catch (txtErr) {}
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      driveFolderUrl: res.mainFolderUrl,
      fileUrl: fileUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
