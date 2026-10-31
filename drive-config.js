/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 💍 إعدادات ربط جوجل درايف ودفتر التهاني وألبوم الصور — خطوبة أحمد & ندى
 * Ahmed & Nada Engagement — Google Drive & Guestbook Auto-Save Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ضع رابط Web App الخاص بـ Google Apps Script هنا في خانة SCRIPT_URL
 * وضع رابط فولدر Google Drive الخاص بكم في خانة DRIVE_FOLDER_URL
 * (أو افتح ملف setup-drive.html لربط حسابك وتوليد هذا الملف بضغطة زر واحدة!)
 */
window.ENGAGEMENT_CONFIG = {
    // 1. رابط السكربت الأوتوماتيكي (يرسل التهاني + الصور المرفوعة + صور الفلتر + التسجيلات الصوتية + الأغاني إلى درايف وشيت تلقائياً)
    SCRIPT_URL: localStorage.getItem('ahmed_nada_script_url') || 'https://script.google.com/macros/s/AKfycbw9nA1BfxhA6-jlbe6wR-dDB6HkG_4ztiSaOaKVc4uoUVHctyp9rNx3ROKRG1oIigGdgw/exec',

    // 2. رابط فولدر جوجل درايف المشترك (اختياري — يظهر بعد رفع الصور لو حابب المعازيم يشوفوا الألبوم أو تفتحه مباشرة)
    DRIVE_FOLDER_URL: localStorage.getItem('ahmed_nada_drive_folder_url') || ''
};
