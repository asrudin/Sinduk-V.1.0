import React, { useState, useEffect } from 'react';
import { Siswa, Class, AcademicYear, SubjectGrade, ActivityRecord } from '../types';
import { 
  Printer, 
  X, 
  Settings, 
  FileText, 
  Users, 
  ChevronRight, 
  Sliders, 
  Layout, 
  Check, 
  File, 
  Award, 
  User, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface CetakHvsModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswa: Siswa[];
  classes: Class[];
  academicYears: AcademicYear[];
  subjectGrades: SubjectGrade[];
  activityRecords: ActivityRecord[];
  preselectedSiswaId: string | null;
}

export default function CetakHvsModal({
  isOpen,
  onClose,
  siswa,
  classes,
  academicYears,
  subjectGrades,
  activityRecords,
  preselectedSiswaId
}: CetakHvsModalProps) {
  // Print settings states
  const [printScope, setPrintScope] = useState<'single' | 'class'>('single');
  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [paperSize, setPaperSize] = useState<'a4' | 'f4' | 'letter'>('a4');
  const [fontFamily, setFontFamily] = useState<'Times New Roman' | 'Arial' | 'Georgia' | 'Calibri'>('Times New Roman');
  const [marginPreset, setMarginPreset] = useState<'normal' | 'compact' | 'jilid'>('jilid');
  
  // Custom Kop Surat
  const [showKop, setShowKop] = useState(true);
  const [instansiPusat, setInstansiPusat] = useState('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI');
  const [instansiDaerah, setInstansiDaerah] = useState('DINAS PENDIDIKAN KOTA MALANG');
  const [namaSekolah, setNamaSekolah] = useState('SD NEGERI 1 MALANG');
  const [alamatSekolah, setAlamatSekolah] = useState('Jl. Veteran No. 10, Lowokwaru, Kota Malang, Jawa Timur 65145');
  
  // Custom Penandatangan / Kepala Sekolah
  const [tempatTtd, setTempatTtd] = useState('Malang');
  const [tanggalTtd, setTanggalTtd] = useState('');
  const [jabatanTtd, setJabatanTtd] = useState('Kepala Sekolah');
  const [namaTtd, setNamaTtd] = useState('Drs. H. Mulyono, M.Pd.');
  const [nipTtd, setNipTtd] = useState('19690312 199403 1 002');

  // Show/Hide sections toggle
  const [showIdentitas, setShowIdentitas] = useState(true);
  const [showAkademik, setShowAkademik] = useState(true);
  const [showOrangTua, setShowOrangTua] = useState(true);
  const [showFisik, setShowFisik] = useState(true);
  const [showNilaiEkskul, setShowNilaiEkskul] = useState(true);

  // Set default dates and preselected values
  useEffect(() => {
    // Current date in Indonesian format: e.g., "15 Juli 2026"
    const today = new Date();
    const indonesianMonths = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const formattedDate = `${today.getDate()} ${indonesianMonths[today.getMonth()]} ${today.getFullYear()}`;
    setTanggalTtd(formattedDate);

    if (preselectedSiswaId) {
      setSelectedSiswaId(preselectedSiswaId);
      setPrintScope('single');
      // Find class of preselected student
      const preSiswa = siswa.find(s => s.id === preselectedSiswaId);
      if (preSiswa) {
        setSelectedClassId(preSiswa.classId);
      }
    } else if (siswa.length > 0) {
      setSelectedSiswaId(siswa[0].id);
    }
  }, [preselectedSiswaId, isOpen, siswa]);

  if (!isOpen) return null;

  // Filter students by selected class
  const classStudents = siswa.filter(s => s.classId === selectedClassId);

  const getSiswaToPrint = (): Siswa[] => {
    if (printScope === 'single') {
      const match = siswa.find(s => s.id === selectedSiswaId);
      return match ? [match] : [];
    } else {
      return classStudents;
    }
  };

  const executePrint = () => {
    const listToPrint = getSiswaToPrint();
    if (listToPrint.length === 0) {
      alert('Tidak ada data siswa yang terpilih untuk dicetak.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Pastikan pop-up browser tidak diblokir.');
      return;
    }

    // CSS styling rules depending on settings
    let paperSizeCss = '';
    if (paperSize === 'a4') {
      paperSizeCss = '@page { size: A4 portrait; }';
    } else if (paperSize === 'f4') {
      paperSizeCss = '@page { size: 215mm 330mm portrait; }';
    } else {
      paperSizeCss = '@page { size: letter portrait; }';
    }

    let marginCss = '';
    if (marginPreset === 'normal') {
      marginCss = '@page { margin: 25mm 20mm 25mm 20mm; }';
    } else if (marginPreset === 'compact') {
      marginCss = '@page { margin: 15mm 12mm 15mm 12mm; }';
    } else {
      // Jilid / Binding Margin (standard academic Buku Induk: wider left margin for folder binding ring)
      marginCss = '@page { margin: 25mm 15mm 25mm 30mm; }';
    }

    const compiledContent = listToPrint.map((s, idx) => {
      const sClass = classes.find(c => c.id === s.classId)?.name || '-';
      const sYear = academicYears.find(y => y.id === s.academicYearId)?.year || '-';
      const sGrades = subjectGrades.filter(g => g.siswaId === s.id);
      const sActivities = activityRecords.filter(a => a.siswaId === s.id);

      const isLastItem = idx === listToPrint.length - 1;
      const pageBreakStyle = isLastItem ? '' : 'style="page-break-after: always;"';

      return `
        <div class="hvs-document" ${pageBreakStyle}>
          ${showKop ? `
            <div class="kop-surat">
              <div class="kop-pusat">${instansiPusat}</div>
              <div class="kop-daerah">${instansiDaerah}</div>
              <div class="kop-sekolah">${namaSekolah}</div>
              <div class="kop-alamat">${alamatSekolah}</div>
              <div class="kop-border"></div>
            </div>
          ` : '<div style="height: 10px;"></div>'}

          <div class="title-doc">BUKU REGISTER INDUK PESERTA DIDIK</div>
          <div class="subtitle-doc">NOMOR MATRIKULASI RESMI & REGISTER ARSIP SEKOLAH</div>

          <table class="data-table">
            <!-- A. IDENTITAS -->
            ${showIdentitas ? `
              <tr>
                <td colspan="4" class="section-header">A. KETERANGAN IDENTITAS DIRI SISWA</td>
              </tr>
              <tr>
                <td class="num">1.</td>
                <td class="field">Nama Lengkap Siswa</td>
                <td class="colon">:</td>
                <td class="value font-bold text-uppercase">${s.name}</td>
              </tr>
              <tr>
                <td class="num">2.</td>
                <td class="field">Nomor Induk Siswa (NIS)</td>
                <td class="colon">:</td>
                <td class="value font-mono font-bold">${s.nis}</td>
              </tr>
              <tr>
                <td class="num">3.</td>
                <td class="field">Nomor Induk Siswa Nasional (NISN)</td>
                <td class="colon">:</td>
                <td class="value font-mono">${s.nisn}</td>
              </tr>
              <tr>
                <td class="num">4.</td>
                <td class="field">Jenis Kelamin</td>
                <td class="colon">:</td>
                <td class="value">${s.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}</td>
              </tr>
              <tr>
                <td class="num">5.</td>
                <td class="field">Tempat & Tanggal Lahir</td>
                <td class="colon">:</td>
                <td class="value">${s.pob || '-'}, ${s.dob || '-'}</td>
              </tr>
              <tr>
                <td class="num">6.</td>
                <td class="field">Agama</td>
                <td class="colon">:</td>
                <td class="value">${s.religion || '-'}</td>
              </tr>
              <tr>
                <td class="num">7.</td>
                <td class="field">Alamat Tempat Tinggal</td>
                <td class="colon">:</td>
                <td class="value">${s.address || '-'}</td>
              </tr>
              <tr>
                <td class="num">8.</td>
                <td class="field">Nomor Telepon Seluler</td>
                <td class="colon">:</td>
                <td class="value font-mono">${s.phone || '-'}</td>
              </tr>
            ` : ''}

            <!-- B. AKADEMIK -->
            ${showAkademik ? `
              <tr>
                <td colspan="4" class="section-header">B. KETERANGAN AKADEMIK DAN PENERIMAAN</td>
              </tr>
              <tr>
                <td class="num">9.</td>
                <td class="field">Diterima di Rombel / Kelas</td>
                <td class="colon">:</td>
                <td class="value font-bold">${sClass}</td>
              </tr>
              <tr>
                <td class="num">10.</td>
                <td class="field">Tahun Ajaran Terdaftar</td>
                <td class="colon">:</td>
                <td class="value">${sYear}</td>
              </tr>
              <tr>
                <td class="num">11.</td>
                <td class="field">Tanggal Masuk Sekolah</td>
                <td class="colon">:</td>
                <td class="value">${s.enrollmentDate || '-'}</td>
              </tr>
              <tr>
                <td class="num">12.</td>
                <td class="field">Sekolah Asal (Sebelumnya)</td>
                <td class="colon">:</td>
                <td class="value">${s.previousSchool || 'PAUD / TK Sederajat'}</td>
              </tr>
              <tr>
                <td class="num">13.</td>
                <td class="field">Status Keanggotaan Siswa</td>
                <td class="colon">:</td>
                <td class="value text-uppercase font-bold">${s.status === 'active' ? 'Aktif' : s.status === 'graduated' ? 'Lulus' : s.status === 'transferred' ? 'Pindah' : 'Keluar'}</td>
              </tr>
            ` : ''}

            <!-- C. ORANG TUA / WALI -->
            ${showOrangTua ? `
              <tr>
                <td colspan="4" class="section-header">C. KETERANGAN ORANG TUA / WALI SISWA</td>
              </tr>
              <tr>
                <td class="num">14.</td>
                <td class="field">Nama Lengkap Ayah Kandung</td>
                <td class="colon">:</td>
                <td class="value">${s.fatherName || '-'}</td>
              </tr>
              <tr>
                <td class="num">15.</td>
                <td class="field">Nama Lengkap Ibu Kandung</td>
                <td class="colon">:</td>
                <td class="value">${s.motherName || '-'}</td>
              </tr>
              <tr>
                <td class="num">16.</td>
                <td class="field">Pekerjaan Utama Orang Tua</td>
                <td class="colon">:</td>
                <td class="value">${s.parentOccupation || '-'}</td>
              </tr>
              <tr>
                <td class="num">17.</td>
                <td class="field">Nomor Kontak Orang Tua</td>
                <td class="colon">:</td>
                <td class="value font-mono">${s.parentPhone || '-'}</td>
              </tr>
              <tr>
                <td class="num">18.</td>
                <td class="field">Nama Lengkap Wali (Jika Ada)</td>
                <td class="colon">:</td>
                <td class="value">${s.guardianName || '-'}</td>
              </tr>
            ` : ''}

            <!-- D. DATA FISIK -->
            ${showFisik ? `
              <tr>
                <td colspan="4" class="section-header">D. DATA CIRI FISIK & CATATAN PERILAKU</td>
              </tr>
              <tr>
                <td class="num">19.</td>
                <td class="field">Tinggi & Berat Badan</td>
                <td class="colon">:</td>
                <td class="value">${s.height ? s.height + ' cm' : '-'}  /  ${s.weight ? s.weight + ' kg' : '-'}</td>
              </tr>
              <tr>
                <td class="num">20.</td>
                <td class="field">Golongan Darah</td>
                <td class="colon">:</td>
                <td class="value font-mono">${s.bloodType || '-'}</td>
              </tr>
              <tr>
                <td class="num">21.</td>
                <td class="field">Catatan Karakter / Integritas</td>
                <td class="colon">:</td>
                <td class="value italic">"${s.notes || 'Siswa menunjukkan kedisiplinan dan integritas baik selama pendidikan.'}"</td>
              </tr>
            ` : ''}

            <!-- E. LAPORAN HASIL ASESMEN AKADEMIK -->
            ${showNilaiEkskul ? `
              <tr>
                <td colspan="4" class="section-header">E. LAPORAN HASIL ASESMEN MATA PELAJARAN & KEGIATAN</td>
              </tr>
              <tr>
                <td class="num">22.</td>
                <td class="field" style="vertical-align: top;">Laporan Penilaian Akademik</td>
                <td class="colon" style="vertical-align: top;">:</td>
                <td class="value" style="padding-top: 5px;">
                  ${sGrades.length === 0 ? '<span class="no-data">Belum ada nilai kognitif terinput untuk semester aktif.</span>' : `
                    <table class="sub-report-table">
                      <thead>
                        <tr>
                          <th style="text-align: left;">Mata Pelajaran</th>
                          <th style="width: 50px; text-align: center;">Skor</th>
                          <th style="width: 50px; text-align: center;">Predikat</th>
                          <th style="text-align: left;">Deskripsi Perkembangan Kompetensi</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${sGrades.map(g => `
                          <tr>
                            <td style="font-weight: bold;">${g.subjectName}</td>
                            <td style="text-align: center;">${g.score}</td>
                            <td style="text-align: center; font-weight: bold;">${g.grade}</td>
                            <td style="font-size: 10px; line-height: 1.3;">${g.description}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  `}
                </td>
              </tr>
              <tr>
                <td class="num">23.</td>
                <td class="field" style="vertical-align: top;">Ekstrakurikuler & Kokurikuler</td>
                <td class="colon" style="vertical-align: top;">:</td>
                <td class="value" style="padding-top: 5px;">
                  ${sActivities.length === 0 ? '<span class="no-data">Belum ada aktivitas yang diikuti.</span>' : `
                    <table class="sub-report-table">
                      <thead>
                        <tr>
                          <th style="text-align: left;">Nama Program Kegiatan</th>
                          <th style="width: 90px; text-align: center;">Jenis</th>
                          <th style="width: 70px; text-align: center;">Predikat</th>
                          <th style="text-align: left;">Keterangan & Capaian Bakat</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${sActivities.map(a => `
                          <tr>
                            <td style="font-weight: bold;">${a.activityName}</td>
                            <td style="text-align: center; text-transform: capitalize; font-size: 10px;">${a.type}</td>
                            <td style="text-align: center; font-weight: bold;">${a.predicate}</td>
                            <td style="font-size: 10px; line-height: 1.3;">${a.description}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  `}
                </td>
              </tr>
            ` : ''}
          </table>

          <div class="footer-sign-section">
            <div class="photo-placeholder">
              Pas Foto<br/>
              Siswa Resmi<br/>
              Ukuran 3 x 4
            </div>
            
            <div class="signature-box">
              <div class="sig-place-date">${tempatTtd}, ${tanggalTtd}</div>
              <div class="sig-title">${jabatanTtd},</div>
              <div class="sig-space"></div>
              <div class="sig-name">${namaTtd}</div>
              <div class="sig-nip">NIP. ${nipTtd || '-'}</div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
      `;
    }).join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Buku Induk Kesiswaan Resmi - Cetak HVS</title>
          <meta charset="utf-8">
          <style>
            /* Base settings */
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
              font-family: '${fontFamily}', ${fontFamily === 'Times New Roman' ? 'serif' : 'sans-serif'};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Responsive print sizes */
            ${paperSizeCss}
            ${marginCss}

            /* HVS Page container optimization */
            .hvs-document {
              background-color: #fff;
              width: 100%;
              box-sizing: border-box;
              font-size: 11.5px;
              line-height: 1.4;
            }

            /* Kop Surat (Header) Styles */
            .kop-surat {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 3.5px double #000;
              padding-bottom: 12px;
            }
            .kop-pusat {
              font-size: 13px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .kop-daerah {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .kop-sekolah {
              font-size: 16px;
              font-weight: 800;
              text-transform: uppercase;
              margin-top: 3px;
              letter-spacing: 0.8px;
            }
            .kop-alamat {
              font-size: 10px;
              font-style: italic;
              margin-top: 4px;
              color: #222;
            }

            /* Title document */
            .title-doc {
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              margin-top: 10px;
            }
            .subtitle-doc {
              text-align: center;
              font-size: 10px;
              font-weight: normal;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin-bottom: 15px;
              color: #444;
            }

            /* Data Layout Matrix */
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
            }
            .data-table td {
              padding: 4.5px 6px;
              vertical-align: top;
            }
            .section-header {
              font-weight: bold;
              background-color: #eaeaea !important;
              font-size: 11px;
              padding: 6px 10px !important;
              border: 1px solid #000;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .num {
              width: 3.5%;
              text-align: right;
              font-weight: bold;
              font-size: 11px;
            }
            .field {
              width: 32%;
              font-weight: 500;
            }
            .colon {
              width: 2%;
              text-align: center;
            }
            .value {
              width: 62.5%;
              color: #000;
            }

            /* Utility styles inside table values */
            .font-bold {
              font-weight: bold;
            }
            .font-mono {
              font-family: 'Courier New', Courier, monospace;
              letter-spacing: 0.5px;
            }
            .text-uppercase {
              text-transform: uppercase;
            }
            .italic {
              font-style: italic;
            }

            /* Sub-report table (Grades & activities) styling */
            .sub-report-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-top: 3px;
              margin-bottom: 5px;
            }
            .sub-report-table th, .sub-report-table td {
              border: 1px solid #333;
              padding: 4px 6px;
              vertical-align: top;
            }
            .sub-report-table th {
              background-color: #f7f7f7 !important;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 9px;
            }
            .no-data {
              font-size: 10.5px;
              color: #555;
              font-style: italic;
            }

            /* Footer signature arrangement */
            .footer-sign-section {
              margin-top: 25px;
              width: 100%;
              page-break-inside: avoid;
            }
            .photo-placeholder {
              width: 105px;
              height: 135px;
              border: 1px solid #000;
              float: left;
              margin-left: 10px;
              margin-top: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              font-size: 9.5px;
              color: #333;
              font-weight: bold;
              background-color: #fafafa;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              line-height: 1.4;
            }
            .signature-box {
              float: right;
              width: 240px;
              text-align: center;
              margin-right: 10px;
            }
            .sig-place-date {
              font-size: 11px;
              margin-bottom: 4px;
            }
            .sig-title {
              font-weight: bold;
              font-size: 11px;
            }
            .sig-space {
              height: 65px;
            }
            .sig-name {
              font-weight: bold;
              text-decoration: underline;
              font-size: 11.5px;
              text-transform: uppercase;
            }
            .sig-nip {
              font-size: 10px;
              color: #111;
              margin-top: 2px;
            }

            /* Print layout page breaks */
            @media print {
              html, body {
                background: #fff;
              }
              .hvs-document {
                border: none;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body onload="window.print()">
          ${compiledContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-500/10 rounded-xl border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Menu Cetak Buku Induk (Format HVS)</h2>
              <p className="text-[10px] text-slate-400 font-medium">Pengaturan tata letak jilid, ukuran kertas HVS, Kop Lembaga dan lembar evaluasi resmi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body: Split in Settings Left, Preview Information Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10 max-h-[70vh] overflow-y-auto">
          
          {/* Column 1: Settings Panel (7-span) */}
          <div className="lg:col-span-7 p-6 space-y-6">
            
            {/* Step 1: Scope */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                1. Tentukan Ruang Lingkup Cetakan
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintScope('single')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center gap-2 justify-center ${
                    printScope === 'single'
                      ? 'bg-indigo-600/20 text-white border-indigo-500'
                      : 'bg-slate-950/40 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Satu Siswa Saja
                </button>
                <button
                  type="button"
                  onClick={() => setPrintScope('class')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center gap-2 justify-center ${
                    printScope === 'class'
                      ? 'bg-indigo-600/20 text-white border-indigo-500'
                      : 'bg-slate-950/40 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Satu Kelas (Batch)
                </button>
              </div>

              {printScope === 'single' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Rombel Kelas</label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Nama Siswa</label>
                    <select
                      value={selectedSiswaId}
                      onChange={(e) => setSelectedSiswaId(e.target.value)}
                      className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      disabled={classStudents.length === 0}
                    >
                      {classStudents.length === 0 ? (
                        <option value="">-- Tidak ada siswa --</option>
                      ) : (
                        classStudents.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">PILIH ROMBEL KELAS YANG INGIN DICETAK (Seluruh Siswa Berurutan)</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} &mdash; ({siswa.filter(s => s.classId === c.id).length} siswa terdaftar)</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 italic mt-1.5 font-medium">Sistem otomatis menyisipkan kode pemutus halaman ("page-break-after") untuk setiap lembar register siswa agar rapi pada kertas cetak HVS.</p>
                </div>
              )}
            </div>

            {/* Step 2: Paper formats & layout */}
            <div className="space-y-2.5 border-t border-white/5 pt-4">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                2. Format Ukuran & Margin Kertas HVS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Paper size */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Ukuran HVS</label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value as any)}
                    className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-white"
                  >
                    <option value="a4">HVS A4 (21 x 29.7 cm)</option>
                    <option value="f4">HVS F4 / Folio (21.5 x 33 cm)</option>
                    <option value="letter">Letter (21.6 x 27.9 cm)</option>
                  </select>
                </div>

                {/* Font families */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Jenis Huruf (Font)</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as any)}
                    className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-white"
                  >
                    <option value="Times New Roman">Times New Roman (Akademis)</option>
                    <option value="Arial">Arial (Modern & Bersih)</option>
                    <option value="Georgia">Georgia (Elegant Serif)</option>
                    <option value="Calibri">Calibri (Standar Dokumen)</option>
                  </select>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Pengaturan Batas (Margin)</label>
                  <select
                    value={marginPreset}
                    onChange={(e) => setMarginPreset(e.target.value as any)}
                    className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-white"
                  >
                    <option value="jilid">Margin Jilid (Kiri Lebar untuk Binder)</option>
                    <option value="normal">Margin Normal (Simetris 2.5cm)</option>
                    <option value="compact">Margin Rapat (1.5cm hemat kertas)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Kop Surat Settings */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layout className="h-3.5 w-3.5" />
                  3. Tata Letak Kepala Kop Surat
                </h3>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showKop}
                    onChange={(e) => setShowKop(e.target.checked)}
                    className="rounded text-indigo-600 bg-slate-950 border-white/10 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                  />
                  <span className="text-[10px] font-bold text-slate-300">Tampilkan Kop Surat Resmi</span>
                </label>
              </div>

              {showKop && (
                <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Instansi Atasan Pusat</label>
                    <input
                      type="text"
                      value={instansiPusat}
                      onChange={(e) => setInstansiPusat(e.target.value)}
                      className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Instansi Dinas Daerah</label>
                    <input
                      type="text"
                      value={instansiDaerah}
                      onChange={(e) => setInstansiDaerah(e.target.value)}
                      className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Nama Satuan Sekolah</label>
                    <input
                      type="text"
                      value={namaSekolah}
                      onChange={(e) => setNamaSekolah(e.target.value)}
                      className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Alamat Lembaga Lengkap</label>
                    <input
                      type="text"
                      value={alamatSekolah}
                      onChange={(e) => setAlamatSekolah(e.target.value)}
                      className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Penandatangan / Kepala Sekolah */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                4. Kolom Otorisasi / Tanda Tangan
              </h3>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Tempat Penulisan</label>
                  <input
                    type="text"
                    value={tempatTtd}
                    onChange={(e) => setTempatTtd(e.target.value)}
                    placeholder="Contoh: Malang"
                    className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Tanggal Lembaran</label>
                  <input
                    type="text"
                    value={tanggalTtd}
                    onChange={(e) => setTanggalTtd(e.target.value)}
                    placeholder="Contoh: 15 Juli 2026"
                    className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Jabatan Penandatangan</label>
                  <input
                    type="text"
                    value={jabatanTtd}
                    onChange={(e) => setJabatanTtd(e.target.value)}
                    className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Nama Pejabat Resmi</label>
                  <input
                    type="text"
                    value={namaTtd}
                    onChange={(e) => setNamaTtd(e.target.value)}
                    className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Nomor NIP Pejabat</label>
                  <input
                    type="text"
                    value={nipTtd}
                    onChange={(e) => setNipTtd(e.target.value)}
                    placeholder="Masukkan NIP tanpa spasi"
                    className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Printable Sections selection */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                5. Pilih Bagian Buku Induk yang Ingin Dicetak
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowIdentitas(!showIdentitas)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition flex items-center gap-1 ${
                    showIdentitas
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/40 text-slate-500 border-white/5 hover:text-slate-400'
                  }`}
                >
                  <Check className={`h-3 w-3 ${showIdentitas ? 'opacity-100' : 'opacity-0'}`} />
                  Identitas Diri (A)
                </button>
                <button
                  type="button"
                  onClick={() => setShowAkademik(!showAkademik)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition flex items-center gap-1 ${
                    showAkademik
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/40 text-slate-500 border-white/5 hover:text-slate-400'
                  }`}
                >
                  <Check className={`h-3 w-3 ${showAkademik ? 'opacity-100' : 'opacity-0'}`} />
                  Penerimaan Masuk (B)
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrangTua(!showOrangTua)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition flex items-center gap-1 ${
                    showOrangTua
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/40 text-slate-500 border-white/5 hover:text-slate-400'
                  }`}
                >
                  <Check className={`h-3 w-3 ${showOrangTua ? 'opacity-100' : 'opacity-0'}`} />
                  Data Orang Tua/Wali (C)
                </button>
                <button
                  type="button"
                  onClick={() => setShowFisik(!showFisik)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition flex items-center gap-1 ${
                    showFisik
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/40 text-slate-500 border-white/5 hover:text-slate-400'
                  }`}
                >
                  <Check className={`h-3 w-3 ${showFisik ? 'opacity-100' : 'opacity-0'}`} />
                  Ciri Fisik & Catatan (D)
                </button>
                <button
                  type="button"
                  onClick={() => setShowNilaiEkskul(!showNilaiEkskul)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition flex items-center gap-1 ${
                    showNilaiEkskul
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/40 text-slate-500 border-white/5 hover:text-slate-400'
                  }`}
                >
                  <Check className={`h-3 w-3 ${showNilaiEkskul ? 'opacity-100' : 'opacity-0'}`} />
                  Nilas Kognitif & Kegiatan (E)
                </button>
              </div>
            </div>

          </div>

          {/* Column 2: Information and Checklist Preview (5-span) */}
          <div className="lg:col-span-5 p-6 bg-slate-950/40 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Informasi Cetakan HVS Anda
              </h3>

              <div className="space-y-3 text-xs bg-slate-950/80 p-4 rounded-xl border border-white/10 font-medium text-slate-300">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Jumlah Siswa Siap Cetak:</span>
                  <span className="text-white font-bold">{getSiswaToPrint().length} Siswa</span>
                </div>
                
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Ukuran Kertas:</span>
                  <span className="text-indigo-300 font-mono uppercase font-bold">{paperSize} HVS</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Jenis Huruf (Font):</span>
                  <span className="text-indigo-300 font-bold">{fontFamily}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Preset Batas (Margin):</span>
                  <span className="text-indigo-300 font-bold">
                    {marginPreset === 'jilid' ? 'Jilid (Lebar Kiri: 30mm)' : marginPreset === 'normal' ? 'Normal (Simetris: 25mm)' : 'Rapat (Compact: 15mm)'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Kepala Surat (Kop):</span>
                  <span className={`font-bold ${showKop ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {showKop ? 'YA (Aktif)' : 'TIDAK (Kosong)'}
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Bagian Terpilih:</span>
                  <span className="text-emerald-400 text-right">
                    {[
                      showIdentitas && 'A',
                      showAkademik && 'B',
                      showOrangTua && 'C',
                      showFisik && 'D',
                      showNilaiEkskul && 'E'
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>

              {/* Instructions and tips */}
              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide block">Petunjuk Cetak PDF / Printer:</span>
                <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-1 leading-relaxed font-medium">
                  <li>Pencet tombol <strong>"Cetak Sekarang"</strong> untuk memicu print window.</li>
                  <li>Di dialog cetak browser, pilih <strong>"Save as PDF"</strong> atau printer fisik Anda.</li>
                  <li>Centang opsi <strong>"Background Graphics"</strong> agar warna baris tabel (zebra striping) tampak jelas.</li>
                  <li>Hilangkan centang <strong>"Headers and Footers"</strong> dari browser agar judul default URL halaman web tidak tercetak di tepi kertas.</li>
                </ul>
              </div>
            </div>

            {/* Modal Controls at Bottom */}
            <div className="space-y-2.5 pt-4">
              <button
                type="button"
                onClick={executePrint}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Cetak Sekarang ke Printer / PDF
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Kembali ke Aplikasi
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
