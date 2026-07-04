export const SPREADSHEET_TEMPLATE_INFO = `
Struktur Kolom Spreadsheet (Google Sheets) untuk Impor Siswa:

1. Sheet: "Daftar_Siswa"
Kolom:
- A: NIS (Nomor Induk Siswa - Teks / Angka Unik, e.g. 22231001)
- B: NISN (Nomor Induk Siswa Nasional - Teks / 10 digit, e.g. 0082910482)
- C: NAMA_LENGKAP (Teks)
- D: JENIS_KELAMIN (L / P)
- E: TEMPAT_LAHIR (Teks)
- F: TANGGAL_LAHIR (Format: YYYY-MM-DD, e.g. 2008-05-14)
- G: AGAMA (Islam, Kristen, Katolik, Hindu, Buddha, Khonghucu)
- H: ALAMAT (Teks)
- I: NO_TELEPON (Teks)
- J: NAMA_AYAH (Teks)
- K: NAMA_IBU (Teks)
- L: PEKERJAAN_ORANG_TUA (Teks)
- M: TELEPON_ORANG_TUA (Teks)
- N: TANGGAL_MASUK (Format: YYYY-MM-DD, e.g. 2024-07-15)
- O: SEKOLAH_ASAL (Teks)
- P: STATUS (active / graduated / transferred / dropped_out)

2. Sheet: "Catatan_Siswa"
Kolom:
- A: NIS_SISWA (Teks / Angka)
- B: TIPE (prestasi / pelanggaran / kehadiran / catatan)
- C: TANGGAL (YYYY-MM-DD)
- D: JUDUL_CATATAN (Teks)
- E: DESKRIPSI (Teks)
- F: PELAPOR (Teks - Nama Guru)
`;

export const CODE_GS_TEMPLATE = `/**
 * Google Apps Script (code.gs)
 * Untuk mengintegrasikan Buku Induk Siswa Digital dengan Google Sheets Anda.
 * Deploy ini sebagai "Web App" dengan akses "Anyone" (Siapa Saja) agar bisa disinkronkan.
 */

const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_ANDA_DISINI";

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Sistem Buku Induk Siswa Digital')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Handler POST dari web app
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const result = handleAction(params);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function executeServerAction(params) {
  try {
    return JSON.stringify(handleAction(params));
  } catch(e) {
    return JSON.stringify({ status: "error", message: e.toString() });
  }
}

// Fungsi inti pemrosesan aksi
function handleAction(params) {
  const action = params.action;
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  if (action === "syncSiswa") {
    const sheet = ss.getSheetByName("Daftar_Siswa") || ss.insertSheet("Daftar_Siswa");
    sheet.clear();
    sheet.appendRow([
      "NIS", "NISN", "NAMA LENGKAP", "GENDER", "TEMPAT LAHIR", "TANGGAL LAHIR", 
      "AGAMA", "ALAMAT", "TELEPON", "NAMA AYAH", "NAMA IBU", "PEKERJAAN ORTU", 
      "TELEPON ORTU", "TANGGAL MASUK", "SEKOLAH ASAL", "STATUS"
    ]);
    
    params.data.forEach(function(item) {
      sheet.appendRow([
        item.nis,
        item.nisn,
        item.name,
        item.gender,
        item.pob,
        item.dob,
        item.religion,
        item.address,
        item.phone,
        item.fatherName,
        item.motherName,
        item.parentOccupation,
        item.parentPhone,
        item.enrollmentDate,
        item.previousSchool,
        item.status
      ]);
    });
    return { status: "success", message: "Data Buku Induk Siswa berhasil disinkronkan ke Google Sheets" };
  }
  
  if (action === "syncCatatan") {
    const sheet = ss.getSheetByName("Catatan_Siswa") || ss.insertSheet("Catatan_Siswa");
    sheet.clear();
    sheet.appendRow(["NIS SISWA", "TIPE", "TANGGAL", "JUDUL CATATAN", "DESKRIPSI", "PELAPOR"]);
    
    params.data.forEach(function(item) {
      sheet.appendRow([
        item.siswaNis,
        item.type,
        item.date,
        item.title,
        item.description,
        item.reporter
      ]);
    });
    return { status: "success", message: "Data Catatan & Prestasi Siswa berhasil disinkronkan" };
  }
  
  return { status: "error", message: "Aksi tidak dikenal" };
}
`;

export const INDEX_HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 min-h-screen text-slate-100 p-4 md:p-8 flex items-center justify-center">
  <div class="w-full max-w-xl bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-6 md:p-8 space-y-6">
    <div class="border-b border-slate-700 pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-lg font-bold text-white tracking-tight">Portal Buku Induk Sekolah</h1>
        <p class="text-xs text-slate-400 mt-1">Formulir Pengecekan Integrasi Google Sheets</p>
      </div>
      <div class="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
        Apps Script
      </div>
    </div>
    
    <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
      <p class="text-xs text-indigo-200">
        Web App ini aktif dan terhubung ke Google Sheets yang ditargetkan. Silakan lakukan sinkronisasi data dari dashboard admin aplikasi Buku Induk Siswa Digital.
      </p>
    </div>
  </div>
</body>
</html>
`;
