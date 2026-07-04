import React, { useState } from 'react';
import { Siswa, Class, AcademicYear, StudentStatus, SubjectGrade, ActivityRecord } from '../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Printer, 
  FileText, 
  User, 
  MapPin, 
  BookOpen, 
  Phone, 
  Calendar, 
  Sparkles,
  Info,
  X,
  UserCheck,
  Award
} from 'lucide-react';

interface SiswaManagerProps {
  siswa: Siswa[];
  classes: Class[];
  academicYears: AcademicYear[];
  currentUser: any;
  onAddSiswa: (s: Omit<Siswa, 'id'>) => void;
  onUpdateSiswa: (s: Siswa) => void;
  onDeleteSiswa: (id: string) => void;
  subjectGrades?: SubjectGrade[];
  activityRecords?: ActivityRecord[];
}

export default function SiswaManager({
  siswa,
  classes,
  academicYears,
  currentUser,
  onAddSiswa,
  onUpdateSiswa,
  onDeleteSiswa,
  subjectGrades = [],
  activityRecords = []
}: SiswaManagerProps) {
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'L' | 'P'>('all');

  // Modal control
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [detailedSiswa, setDetailedSiswa] = useState<Siswa | null>(null);

  // Form Tab Control (Pribadi, Akademik, Orang Tua, Fisik/Catatan)
  const [formTab, setFormTab] = useState<'pribadi' | 'akademik' | 'ortu' | 'lain'>('pribadi');

  // Form states
  const [formNis, setFormNis] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formPob, setFormPob] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formReligion, setFormReligion] = useState('Islam');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formClassId, setFormClassId] = useState('');
  const [formAcademicYearId, setFormAcademicYearId] = useState('');
  const [formStatus, setFormStatus] = useState<StudentStatus>('active');
  const [formEnrollmentDate, setFormEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPreviousSchool, setFormPreviousSchool] = useState('');
  
  // Parent info
  const [formFatherName, setFormFatherName] = useState('');
  const [formMotherName, setFormMotherName] = useState('');
  const [formParentOccupation, setFormParentOccupation] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formGuardianName, setFormGuardianName] = useState('');

  // Physical details
  const [formHeight, setFormHeight] = useState<number | ''>('');
  const [formWeight, setFormWeight] = useState<number | ''>('');
  const [formBloodType, setFormBloodType] = useState('O');
  const [formNotes, setFormNotes] = useState('');

  // Open modal for creation
  const handleOpenAddModal = () => {
    setEditingSiswa(null);
    setFormNis(String(Date.now()).slice(-8));
    setFormNisn('00' + String(Math.floor(10000000 + Math.random() * 90000000)));
    setFormName('');
    setFormGender('L');
    setFormPob('');
    setFormDob('');
    setFormReligion('Islam');
    setFormAddress('');
    setFormPhone('');
    setFormClassId(classes[0]?.id || '');
    setFormAcademicYearId(academicYears[0]?.id || '');
    setFormStatus('active');
    setFormEnrollmentDate(new Date().toISOString().split('T')[0]);
    setFormPreviousSchool('');
    setFormFatherName('');
    setFormMotherName('');
    setFormParentOccupation('');
    setFormParentPhone('');
    setFormGuardianName('');
    setFormHeight('');
    setFormWeight('');
    setFormBloodType('O');
    setFormNotes('');
    
    setFormTab('pribadi');
    setIsFormModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (s: Siswa) => {
    setEditingSiswa(s);
    setFormNis(s.nis);
    setFormNisn(s.nisn);
    setFormName(s.name);
    setFormGender(s.gender);
    setFormPob(s.pob);
    setFormDob(s.dob);
    setFormReligion(s.religion);
    setFormAddress(s.address);
    setFormPhone(s.phone);
    setFormClassId(s.classId);
    setFormAcademicYearId(s.academicYearId);
    setFormStatus(s.status);
    setFormEnrollmentDate(s.enrollmentDate);
    setFormPreviousSchool(s.previousSchool);
    setFormFatherName(s.fatherName);
    setFormMotherName(s.motherName);
    setFormParentOccupation(s.parentOccupation);
    setFormParentPhone(s.parentPhone);
    setFormGuardianName(s.guardianName || '');
    setFormHeight(s.height || '');
    setFormWeight(s.weight || '');
    setFormBloodType(s.bloodType || 'O');
    setFormNotes(s.notes || '');

    setFormTab('pribadi');
    setIsFormModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNis.trim() || !formNisn.trim()) return;

    const dataPayload: Omit<Siswa, 'id'> = {
      nis: formNis,
      nisn: formFormatedNisn(formNisn),
      name: formName,
      gender: formGender,
      pob: formPob,
      dob: formDob,
      religion: formReligion,
      address: formAddress,
      phone: formPhone,
      classId: formClassId,
      academicYearId: formAcademicYearId,
      status: formStatus,
      enrollmentDate: formEnrollmentDate,
      previousSchool: formPreviousSchool,
      fatherName: formFatherName,
      motherName: formMotherName,
      parentOccupation: formParentOccupation,
      parentPhone: formParentPhone,
      guardianName: formGuardianName || undefined,
      height: formHeight ? Number(formHeight) : undefined,
      weight: formWeight ? Number(formWeight) : undefined,
      bloodType: formBloodType || undefined,
      notes: formNotes || undefined
    };

    if (editingSiswa) {
      onUpdateSiswa({
        ...dataPayload,
        id: editingSiswa.id
      });
    } else {
      onAddSiswa(dataPayload);
    }

    setIsFormModalOpen(false);
  };

  const formFormatedNisn = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 10);
  };

  // Filters logic
  const filteredSiswa = siswa.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.nisn.includes(search) ||
      s.address.toLowerCase().includes(search.toLowerCase());

    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    const matchesGender = selectedGender === 'all' || s.gender === selectedGender;

    return matchesSearch && matchesClass && matchesStatus && matchesGender;
  });

  // Print function for the Buku Induk single sheet
  const handlePrintSiswa = (s: Siswa) => {
    const sClass = classes.find(c => c.id === s.classId)?.name || '-';
    const sYear = academicYears.find(y => y.id === s.academicYearId)?.year || '-';
    const sGrades = subjectGrades.filter(g => g.siswaId === s.id);
    const sActivities = activityRecords.filter(a => a.siswaId === s.id);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Buku Induk - ${s.name}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.5; }
            .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
            .header h2 { margin: 5px 0 0; font-size: 16px; font-weight: normal; }
            .header p { margin: 5px 0 0; font-size: 11px; font-style: italic; }
            .title-section { text-align: center; font-weight: bold; font-size: 15px; text-decoration: underline; margin-bottom: 25px; text-transform: uppercase; }
            .metadata-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px; font-size: 12px; }
            table.induk-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            table.induk-table td { padding: 5px 8px; vertical-align: top; }
            .num-col { width: 4%; text-align: right; font-weight: bold; }
            .label-col { width: 35%; }
            .colon-col { width: 2%; }
            .section-row { font-weight: bold; background-color: #f2f2f2; font-size: 13px; padding: 6px 10px !important; border: 1px solid #000; }
            .border-box { border: 1px solid #000; padding: 15px; }
            .photo-box { width: 110px; height: 140px; border: 1px solid #000; display: inline-flex; justify-content: center; align-items: center; text-align: center; font-size: 11px; float: left; margin-right: 30px; margin-top: 10px; }
            .signature-area { margin-top: 50px; float: right; width: 250px; text-align: center; font-size: 13px; }
            .signature-space { height: 70px; }
            .clearfix { clear: both; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1>KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</h1>
            <h2>ARSIF BUKU INDUK REGISTER SISWA NASIONAL</h2>
            <p>Lembaran data otentik kesiswaan sebagai bukti kepatuhan administrasi sekolah formal</p>
          </div>

          <div class="title-section">LEMBAR BUKU INDUK SISWA</div>

          <div class="border-box">
            <table class="induk-table">
              <tr>
                <td colspan="4" class="section-row">A. KETERANGAN IDENTITAS DIRI SISWA</td>
              </tr>
              <tr>
                <td class="num-col">1.</td>
                <td class="label-col">Nama Lengkap Siswa</td>
                <td class="colon-col">:</td>
                <td style="font-weight: bold; text-transform: uppercase;">${s.name}</td>
              </tr>
              <tr>
                <td class="num-col">2.</td>
                <td class="label-col">Nomor Induk Siswa (NIS)</td>
                <td class="colon-col">:</td>
                <td style="font-family: monospace;">${s.nis}</td>
              </tr>
              <tr>
                <td class="num-col">3.</td>
                <td class="label-col">Nomor Induk Siswa Nasional (NISN)</td>
                <td class="colon-col">:</td>
                <td style="font-family: monospace;">${s.nisn}</td>
              </tr>
              <tr>
                <td class="num-col">4.</td>
                <td class="label-col">Jenis Kelamin</td>
                <td class="colon-col">:</td>
                <td>${s.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}</td>
              </tr>
              <tr>
                <td class="num-col">5.</td>
                <td class="label-col">Tempat / Tanggal Lahir</td>
                <td class="colon-col">:</td>
                <td>${s.pob}, ${s.dob}</td>
              </tr>
              <tr>
                <td class="num-col">6.</td>
                <td class="label-col">Agama</td>
                <td class="colon-col">:</td>
                <td>${s.religion}</td>
              </tr>
              <tr>
                <td class="num-col">7.</td>
                <td class="label-col">Alamat Tempat Tinggal</td>
                <td class="colon-col">:</td>
                <td>${s.address}</td>
              </tr>
              <tr>
                <td class="num-col">8.</td>
                <td class="label-col">Nomor Telepon Seluler</td>
                <td class="colon-col">:</td>
                <td>${s.phone || '-'}</td>
              </tr>

              <tr>
                <td colspan="4" class="section-row">B. KETERANGAN AKADEMIK & MASUK SEKOLAH</td>
              </tr>
              <tr>
                <td class="num-col">9.</td>
                <td class="label-col">Diterima di Kelas</td>
                <td class="colon-col">:</td>
                <td>${sClass}</td>
              </tr>
              <tr>
                <td class="num-col">10.</td>
                <td class="label-col">Tahun Ajaran Masuk</td>
                <td class="colon-col">:</td>
                <td>${sYear}</td>
              </tr>
              <tr>
                <td class="num-col">11.</td>
                <td class="label-col">Tanggal Masuk Sekolah</td>
                <td class="colon-col">:</td>
                <td>${s.enrollmentDate}</td>
              </tr>
              <tr>
                <td class="num-col">12.</td>
                <td class="label-col">Sekolah Asal (SMP/MTS)</td>
                <td class="colon-col">:</td>
                <td>${s.previousSchool || '-'}</td>
              </tr>
              <tr>
                <td class="num-col">13.</td>
                <td class="label-col">Status Keaktifan Saat Ini</td>
                <td class="colon-col">:</td>
                <td style="font-weight: bold; text-transform: uppercase;">${s.status}</td>
              </tr>

              <tr>
                <td colspan="4" class="section-row">C. KETERANGAN ORANG TUA / WALI SISWA</td>
              </tr>
              <tr>
                <td class="num-col">14.</td>
                <td class="label-col">Nama Ayah Kandung</td>
                <td class="colon-col">:</td>
                <td>${s.fatherName}</td>
              </tr>
              <tr>
                <td class="num-col">15.</td>
                <td class="label-col">Nama Ibu Kandung</td>
                <td class="colon-col">:</td>
                <td>${s.motherName}</td>
              </tr>
              <tr>
                <td class="num-col">16.</td>
                <td class="label-col">Pekerjaan Orang Tua</td>
                <td class="colon-col">:</td>
                <td>${s.parentOccupation}</td>
              </tr>
              <tr>
                <td class="num-col">17.</td>
                <td class="label-col">Nomor HP Orang Tua</td>
                <td class="colon-col">:</td>
                <td>${s.parentPhone}</td>
              </tr>
              <tr>
                <td class="num-col">18.</td>
                <td class="label-col">Nama Wali Siswa (jika ada)</td>
                <td class="colon-col">:</td>
                <td>${s.guardianName || '-'}</td>
              </tr>

              <tr>
                <td colspan="4" class="section-row">D. KETERANGAN DATA FISIK & CATATAN</td>
              </tr>
              <tr>
                <td class="num-col">19.</td>
                <td class="label-col">Tinggi & Berat Badan</td>
                <td class="colon-col">:</td>
                <td>${s.height ? s.height + ' cm' : '-'}  /  ${s.weight ? s.weight + ' kg' : '-'}</td>
              </tr>
              <tr>
                <td class="num-col">20.</td>
                <td class="label-col">Golongan Darah</td>
                <td class="colon-col">:</td>
                <td>${s.bloodType || '-'}</td>
              </tr>
              <tr>
                <td class="num-col">21.</td>
                <td class="label-col">Catatan Khusus Kepala Sekolah</td>
                <td class="colon-col">:</td>
                <td>${s.notes || 'Siswa menunjukkan integritas baik.'}</td>
              </tr>

              <tr>
                <td colspan="4" class="section-row">E. LAPORAN HASIL ASESMEN AKADEMIK & KEGIATAN</td>
              </tr>
              <tr>
                <td class="num-col">22.</td>
                <td class="label-col">Laporan Daftar Nilai Mapel</td>
                <td class="colon-col">:</td>
                <td>
                  ${
                    sGrades.length === 0 
                      ? 'Belum ada nilai terinput.' 
                      : `<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 5px;" border="1">
                          <thead>
                            <tr style="background-color: #f2f2f2;">
                              <th style="padding: 4px; text-align: left;">Mata Pelajaran</th>
                              <th style="padding: 4px; text-align: center; width: 60px;">Skor</th>
                              <th style="padding: 4px; text-align: center; width: 60px;">Predikat</th>
                              <th style="padding: 4px; text-align: left;">Deskripsi Kemajuan</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${sGrades.map(g => `
                              <tr>
                                <td style="padding: 4px;">${g.subjectName}</td>
                                <td style="padding: 4px; text-align: center;">${g.score}</td>
                                <td style="padding: 4px; text-align: center; font-weight: bold;">${g.grade}</td>
                                <td style="padding: 4px; font-size: 10px;">${g.description}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>`
                  }
                </td>
              </tr>
              <tr>
                <td class="num-col">23.</td>
                <td class="label-col">Kegiatan Ekstra & Kokurikuler</td>
                <td class="colon-col">:</td>
                <td>
                  ${
                    sActivities.length === 0 
                      ? 'Belum ada kegiatan terdaftar.' 
                      : `<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 5px;" border="1">
                          <thead>
                            <tr style="background-color: #f2f2f2;">
                              <th style="padding: 4px; text-align: left;">Nama Kegiatan</th>
                              <th style="padding: 4px; text-align: center; width: 80px;">Jenis</th>
                              <th style="padding: 4px; text-align: center; width: 80px;">Predikat</th>
                              <th style="padding: 4px; text-align: left;">Deskripsi Capaian</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${sActivities.map(a => `
                              <tr>
                                <td style="padding: 4px;">${a.activityName}</td>
                                <td style="padding: 4px; text-align: center; text-transform: capitalize;">${a.type}</td>
                                <td style="padding: 4px; text-align: center; font-weight: bold;">${a.predicate}</td>
                                <td style="padding: 4px; font-size: 10px;">${a.description}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>`
                  }
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 30px;">
            <div class="photo-box">
              FOTO SISWA<br/>
              3 x 4 CM<br/>
              (Pas foto)
            </div>
            
            <div class="signature-area">
              <p>Malang, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
              <p style="font-weight: bold; margin-top: 5px;">Kepala Sekolah,</p>
              <div class="signature-space"></div>
              <p style="font-weight: bold; text-decoration: underline;">Drs. H. Mulyono, M.Pd.</p>
              <p style="font-size: 11px; color: #555;">NIP. 19690312 199403 1 002</p>
            </div>
            <div class="clearfix"></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusLabelAndStyle = (status: StudentStatus) => {
    switch (status) {
      case 'active':
        return { label: 'Aktif', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'graduated':
        return { label: 'Lulus', style: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'transferred':
        return { label: 'Pindah', style: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'dropped_out':
        return { label: 'Keluar', style: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: 'Aktif', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  return (
    <div className="space-y-6 z-10 relative select-none">
      {/* Header and Add trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Buku Induk Kesiswaan</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Registrasi, telusuri profil menyeluruh, cetak formulir resmi Buku Induk Siswa</p>
        </div>
        {currentUser.role === 'admin' && (
          <button
            id="btn-add-siswa"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Registrasi Siswa Baru
          </button>
        )}
      </div>

      {/* Searching & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border border-white/10">
        {/* Search input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="siswa-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama, NIS, NISN, Alamat..."
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-9 focus:outline-none focus:border-indigo-500 text-white"
          />
        </div>

        {/* Class Filter */}
        <div>
          <select
            id="filter-class-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 text-slate-300"
          >
            <option value="all">Semua Kelas</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            id="filter-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 text-slate-300"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="graduated">Lulus</option>
            <option value="transferred">Pindahan</option>
            <option value="dropped_out">Keluar</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <select
            id="filter-gender-select"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value as any)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 text-slate-300"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>
      </div>

      {/* Main Student Database Grid & Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Profil Siswa</th>
                <th className="py-3.5 px-5">NIS / NISN</th>
                <th className="py-3.5 px-5">Rombel / Kelas</th>
                <th className="py-3.5 px-5 text-center">Gender</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi Administrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">
                    Tidak ditemukan data siswa yang cocok dengan kriteria pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map(s => {
                  const sClass = classes.find(c => c.id === s.classId)?.name || 'N/A';
                  const sStatusInfo = getStatusLabelAndStyle(s.status);

                  return (
                    <tr key={s.id} className="hover:bg-white/5 transition duration-150">
                      {/* Name / Contact info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-[13px]">{s.name}</p>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{s.address}</span>
                          </div>
                        </div>
                      </td>

                      {/* NIS / NISN */}
                      <td className="py-4 px-5">
                        <p className="font-mono font-bold text-white text-[11px]">{s.nis}</p>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">NISN: {s.nisn}</span>
                      </td>

                      {/* Class */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                          <BookOpen className="h-3.5 w-3.5" />
                          {sClass}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block px-2 py-0.5 font-extrabold rounded-md ${
                          s.gender === 'L' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' 
                            : 'bg-pink-500/10 text-pink-400 border border-pink-500/25'
                        }`}>
                          {s.gender}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${sStatusInfo.style}`}>
                          {sStatusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-1.5">
                        {/* View full detail */}
                        <button
                          id={`btn-view-${s.id}`}
                          title="Lihat Profil Lengkap"
                          onClick={() => {
                            setDetailedSiswa(s);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/10 transition cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>

                        {/* Print Buku Induk */}
                        <button
                          id={`btn-print-${s.id}`}
                          title="Cetak Lembar Buku Induk"
                          onClick={() => handlePrintSiswa(s)}
                          className="p-1.5 bg-slate-800 hover:bg-indigo-950 hover:text-indigo-400 text-indigo-300 rounded-lg border border-indigo-500/20 transition cursor-pointer"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit and Delete if admin */}
                        {currentUser.role === 'admin' && (
                          <>
                            <button
                              id={`btn-edit-${s.id}`}
                              title="Sunting Data"
                              onClick={() => handleOpenEditModal(s)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-white/10 transition cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              id={`btn-delete-${s.id}`}
                              title="Hapus Siswa"
                              onClick={() => {
                                if (confirm(`PERINGATAN! Anda akan menghapus data siswa ${s.name} dari Buku Induk secara permanen. Lanjutkan?`)) {
                                  onDeleteSiswa(s.id);
                                }
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-rose-950/30 text-rose-400 rounded-lg border border-rose-500/20 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal: Add/Edit Student */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <User className="h-4 w-4 text-indigo-400" />
                  {editingSiswa ? `SUNTING PROFIL: ${editingSiswa.name.toUpperCase()}` : 'REGISTRASI SISWA BUKU INDUK'}
                </h3>
                <p className="text-[10px] text-slate-400">Pastikan seluruh data pokok kesiswaan sesuai dokumen kependudukan resmi</p>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs inside Form */}
            <div className="border-b border-white/5 bg-slate-950/20 flex gap-2 p-2">
              <button
                type="button"
                onClick={() => setFormTab('pribadi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  formTab === 'pribadi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                1. Data Pribadi
              </button>
              <button
                type="button"
                onClick={() => setFormTab('akademik')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  formTab === 'akademik' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                2. Akademik
              </button>
              <button
                type="button"
                onClick={() => setFormTab('ortu')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  formTab === 'ortu' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                3. Orang Tua
              </button>
              <button
                type="button"
                onClick={() => setFormTab('lain')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  formTab === 'lain' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                4. Fisik & Catatan
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: DATA PRIBADI */}
              {formTab === 'pribadi' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NIS (Nomor Induk Siswa)</label>
                      <input
                        type="text"
                        required
                        value={formNis}
                        onChange={(e) => setFormNis(e.target.value)}
                        className="w-full text-xs font-mono font-bold glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NISN (10 Digit Nasional)</label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={formNisn}
                        onChange={(e) => setFormNisn(e.target.value)}
                        placeholder="Contoh: 0082910482"
                        className="w-full text-xs font-mono font-bold glass-input rounded-xl p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Lengkap Siswa</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Masukkan nama lengkap siswa"
                      className="w-full text-xs font-bold glass-input rounded-xl p-3"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jenis Kelamin</label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value as any)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      >
                        <option value="L">Laki-laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Agama</label>
                      <select
                        value={formReligion}
                        onChange={(e) => setFormReligion(e.target.value)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Khonghucu">Khonghucu</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tempat Lahir</label>
                      <input
                        type="text"
                        required
                        value={formPob}
                        onChange={(e) => setFormPob(e.target.value)}
                        placeholder="Contoh: Malang"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Lahir</label>
                      <input
                        type="date"
                        required
                        value={formDob}
                        onChange={(e) => setFormDob(e.target.value)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nomor Handphone Siswa</label>
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-bold">Alamat Rumah Tinggal</label>
                      <input
                        type="text"
                        required
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="Alamat lengkap (RT/RW, Jalan, Kelurahan)"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AKADEMIK & MASUK */}
              {formTab === 'akademik' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rombongan Belajar (Kelas)</label>
                      <select
                        value={formClassId}
                        onChange={(e) => setFormClassId(e.target.value)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      >
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tahun Ajaran Masuk</label>
                      <select
                        value={formAcademicYearId}
                        onChange={(e) => setFormAcademicYearId(e.target.value)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      >
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>{ay.year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Mulai Masuk</label>
                      <input
                        type="date"
                        required
                        value={formEnrollmentDate}
                        onChange={(e) => setFormEnrollmentDate(e.target.value)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sekolah Asal (TK / PAUD / Sederajat)</label>
                      <input
                        type="text"
                        value={formPreviousSchool}
                        onChange={(e) => setFormPreviousSchool(e.target.value)}
                        placeholder="Contoh: TK Dharma Wanita Malang"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Keanggotaan Siswa</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full text-xs glass-input rounded-xl p-3"
                    >
                      <option value="active">Siswa Aktif</option>
                      <option value="graduated">Lulus (Alumni)</option>
                      <option value="transferred">Pindahan Masuk/Keluar</option>
                      <option value="dropped_out">Diberhentikan / Keluar</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 3: ORANG TUA / WALI */}
              {formTab === 'ortu' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Ayah Kandung</label>
                      <input
                        type="text"
                        required
                        value={formFatherName}
                        onChange={(e) => setFormFatherName(e.target.value)}
                        placeholder="Nama Ayah Kandung"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Ibu Kandung</label>
                      <input
                        type="text"
                        required
                        value={formMotherName}
                        onChange={(e) => setFormMotherName(e.target.value)}
                        placeholder="Nama Ibu Kandung"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pekerjaan Orang Tua</label>
                      <input
                        type="text"
                        required
                        value={formParentOccupation}
                        onChange={(e) => setFormParentOccupation(e.target.value)}
                        placeholder="Contoh: Pegawai Negeri, Wiraswasta"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nomor Telepon Orang Tua</label>
                      <input
                        type="text"
                        required
                        value={formParentPhone}
                        onChange={(e) => setFormParentPhone(e.target.value)}
                        placeholder="Contoh: 08129876XXXX"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Wali Siswa (Jika Ada)</label>
                    <input
                      type="text"
                      value={formGuardianName}
                      onChange={(e) => setFormGuardianName(e.target.value)}
                      placeholder="Masukkan nama wali (kosongkan jika tidak ada)"
                      className="w-full text-xs glass-input rounded-xl p-3"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: FISIK & CATATAN KHUSUS */}
              {formTab === 'lain' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tinggi Badan (cm)</label>
                      <input
                        type="number"
                        value={formHeight}
                        onChange={(e) => setFormHeight(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="165"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Berat Badan (kg)</label>
                      <input
                        type="number"
                        value={formWeight}
                        onChange={(e) => setFormWeight(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="52"
                        className="w-full text-xs glass-input rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Golongan Darah</label>
                      <select
                        value={formBloodType}
                        onChange={(e) => setFormBloodType(e.target.value)}
                        className="w-full text-xs glass-input rounded-xl p-3"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Catatan Khusus Kepala Sekolah / Wali Kelas</label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Catatan perkembangan karakter, kepribadian, minat bakat, dll."
                      rows={4}
                      className="w-full text-xs glass-input rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Footer controls inside modal */}
              <div className="pt-4 border-t border-white/10 flex justify-between gap-3">
                <span className="text-[10px] text-slate-400 self-center font-bold uppercase tracking-wider">
                  Tab Terbuka: <span className="text-white">{formTab}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    {editingSiswa ? 'Simpan Perubahan' : 'Registrasikan Siswa'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal: Full Student Profile & Print shortcut */}
      {isDetailModalOpen && detailedSiswa && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">PROFIL DETAIL SISWA BUKU INDUK</h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">NIS: {detailedSiswa.nis} &bull; NISN: {detailedSiswa.nisn}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Detail Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-bold">
                  {detailedSiswa.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{detailedSiswa.name}</h2>
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded mt-1 border ${
                    getStatusLabelAndStyle(detailedSiswa.status).style
                  }`}>
                    {getStatusLabelAndStyle(detailedSiswa.status).label}
                  </span>
                </div>
              </div>

              {/* Data Grids */}
              <div className="space-y-4">
                {/* 1. Data Diri */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    A. Informasi Pribadi
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5 font-medium text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Tempat, Tanggal Lahir</span>
                      <span className="text-white">{detailedSiswa.pob}, {detailedSiswa.dob}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Gender & Agama</span>
                      <span className="text-white">{detailedSiswa.gender === 'L' ? 'Laki-laki' : 'Perempuan'} - {detailedSiswa.religion}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Nomor Telepon</span>
                      <span className="text-white font-mono">{detailedSiswa.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Alamat Rumah</span>
                      <span className="text-white truncate" title={detailedSiswa.address}>{detailedSiswa.address}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Data Akademik */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                    B. Akademik & Registrasi Masuk
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5 font-medium text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Kelas Rombel</span>
                      <span className="text-white font-bold">{classes.find(c => c.id === detailedSiswa.classId)?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Asal Sekolah (SMP)</span>
                      <span className="text-white">{detailedSiswa.previousSchool || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Tanggal Masuk</span>
                      <span className="text-white">{detailedSiswa.enrollmentDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">Angkatan Ajaran</span>
                      <span className="text-white">{academicYears.find(ay => ay.id === detailedSiswa.academicYearId)?.year || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Data Ortu */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
                    C. Orang Tua / Wali
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5 font-medium text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Nama Ayah</span>
                      <span className="text-white">{detailedSiswa.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Nama Ibu</span>
                      <span className="text-white">{detailedSiswa.motherName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Pekerjaan Orang Tua</span>
                      <span className="text-white">{detailedSiswa.parentOccupation}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Telepon Orang Tua</span>
                      <span className="text-white font-mono">{detailedSiswa.parentPhone}</span>
                    </div>
                    {detailedSiswa.guardianName && (
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-500 block uppercase">Wali Siswa</span>
                        <span className="text-white">{detailedSiswa.guardianName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Karakteristik Fisik & Catatan */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    D. Ciri Fisik & Catatan
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5 font-medium text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Tinggi Badan</span>
                      <span className="text-white font-mono">{detailedSiswa.height ? detailedSiswa.height + ' cm' : '-'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Berat Badan</span>
                      <span className="text-white font-mono">{detailedSiswa.weight ? detailedSiswa.weight + ' kg' : '-'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Golongan Darah</span>
                      <span className="text-white font-mono">{detailedSiswa.bloodType || '-'}</span>
                    </div>
                    <div className="col-span-3 border-t border-white/5 pt-2 mt-1 text-[11px] text-slate-400 italic">
                      <span className="text-[9px] text-slate-500 block uppercase not-italic font-bold">Catatan Karakter/Minat</span>
                      "{detailedSiswa.notes || 'Siswa menunjukkan keteladanan yang baik di lingkungan kelas.'}"
                    </div>
                  </div>
                </div>

                {/* 5. Nilai Akademik & Kegiatan Ekskul */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-indigo-400" />
                    E. Nilai Akademik & Kegiatan Ekskul
                  </h4>
                  <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-slate-300 font-medium">
                    {/* Nilai Mapel */}
                    <div>
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wide block mb-1">Daftar Nilai Semester Aktif</span>
                      {subjectGrades.filter(g => g.siswaId === detailedSiswa.id).length === 0 ? (
                        <p className="text-[10px] text-slate-500 italic">Belum ada nilai terinput.</p>
                      ) : (
                        <div className="space-y-1 mt-1 max-h-32 overflow-y-auto pr-1">
                          {subjectGrades.filter(g => g.siswaId === detailedSiswa.id).map(g => (
                            <div key={g.id} className="p-1.5 hover:bg-white/5 transition rounded border-b border-white/5 flex flex-col gap-0.5">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-white font-bold">{g.subjectName}</span>
                                <span className="font-mono text-[10px] text-indigo-300">
                                  Skor: <strong>{g.score}</strong> ({g.grade})
                                </span>
                              </div>
                              <p className="text-[9px] text-slate-400 italic leading-snug">"{g.description}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Kegiatan */}
                    <div className="border-t border-white/5 pt-2">
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wide block mb-1">Kegiatan Ekstrakurikuler & Kokurikuler</span>
                      {activityRecords.filter(a => a.siswaId === detailedSiswa.id).length === 0 ? (
                        <p className="text-[10px] text-slate-500 italic">Belum ada kegiatan terdaftar.</p>
                      ) : (
                        <div className="space-y-1 mt-1 max-h-32 overflow-y-auto pr-1">
                          {activityRecords.filter(a => a.siswaId === detailedSiswa.id).map(a => (
                            <div key={a.id} className="p-1.5 hover:bg-white/5 transition rounded border-b border-white/5 flex flex-col gap-0.5">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-white font-bold">{a.activityName}</span>
                                <span className="text-[9px] px-1.5 bg-indigo-500/15 border border-indigo-500/20 rounded uppercase text-indigo-300 font-semibold">{a.predicate}</span>
                              </div>
                              <p className="text-[9px] text-slate-400 italic leading-snug">"{a.description}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer controls */}
            <div className="p-4 bg-slate-950/80 border-t border-white/10 flex justify-between items-center">
              <button
                id="btn-print-detail-trigger"
                onClick={() => handlePrintSiswa(detailedSiswa)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Cetak Lembar Buku Induk Resmi
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition cursor-pointer"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
