import React, { useState } from 'react';
import { Siswa, Class, AcademicYear, SubjectGrade, ActivityRecord, ActivityType } from '../types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  GraduationCap, 
  Award, 
  FileCheck, 
  User, 
  Save, 
  Calendar,
  Layers,
  Edit2
} from 'lucide-react';

interface NilaiManagerProps {
  siswa: Siswa[];
  classes: Class[];
  academicYears: AcademicYear[];
  subjectGrades: SubjectGrade[];
  activityRecords: ActivityRecord[];
  setSubjectGrades: React.Dispatch<React.SetStateAction<SubjectGrade[]>>;
  setActivityRecords: React.Dispatch<React.SetStateAction<ActivityRecord[]>>;
  currentUser: any;
}

export default function NilaiManager({
  siswa,
  classes,
  academicYears,
  subjectGrades,
  activityRecords,
  setSubjectGrades,
  setActivityRecords,
  currentUser
}: NilaiManagerProps) {
  // Filters state
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [selectedAyId, setSelectedAyId] = useState(academicYears[0]?.id || '');
  const [selectedSemester, setSelectedSemester] = useState<'ganjil' | 'genap'>('ganjil');

  // Active Sub-tab
  const [subTab, setSubTab] = useState<'akademik' | 'kokurikuler' | 'ekstrakurikuler'>('akademik');

  // Input states for Subject Grades
  const [subjectName, setSubjectName] = useState('Matematika');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [score, setScore] = useState(80);
  const [grade, setGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('B');
  const [description, setDescription] = useState('');
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);

  // Input states for Activities
  const [activityType, setActivityType] = useState<ActivityType>('ekstrakurikuler');
  const [activityName, setActivityName] = useState('Pramuka');
  const [customActivityName, setCustomActivityName] = useState('');
  const [activityPredicate, setActivityPredicate] = useState<'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang'>('Baik');
  const [activityDesc, setActivityDesc] = useState('');
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  // Filter students based on selected class
  const classStudents = siswa.filter(s => s.classId === selectedClassId);

  // Set default student if current selection is invalid
  React.useEffect(() => {
    if (classStudents.length > 0) {
      const match = classStudents.find(s => s.id === selectedSiswaId);
      if (!match) {
        setSelectedSiswaId(classStudents[0].id);
      }
    } else {
      setSelectedSiswaId('');
    }
  }, [selectedClassId, siswa]);

  const currentSiswa = siswa.find(s => s.id === selectedSiswaId);

  // Get grades for selected student, year, and semester
  const filteredGrades = subjectGrades.filter(g => 
    g.siswaId === selectedSiswaId && 
    g.academicYearId === selectedAyId && 
    g.semester === selectedSemester
  );

  // Get activities for selected student, year, and semester
  const filteredActivities = activityRecords.filter(a => 
    a.siswaId === selectedSiswaId && 
    a.academicYearId === selectedAyId && 
    a.semester === selectedSemester
  );

  const displayActivities = filteredActivities.filter(a => 
    subTab === 'kokurikuler' ? a.type === 'kokurikuler' : a.type === 'ekstrakurikuler'
  );

  // Standard primary school subjects
  const STANDARD_SUBJECTS = [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    'Seni dan Budaya',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Bahasa Inggris',
    'Lainnya (Custom)'
  ];

  // Standard activities templates
  const EXTRACURRICULAR_TEMPLATES = [
    'Pramuka Siaga/Penggalang',
    'UKS / Dokter Kecil',
    'Palang Merah Remaja (PMR)',
    'Polisi Cilik (Polcil)',
    'Seni Tari Tradisional',
    'Seni Musik / Paduan Suara',
    'Klub Sepakbola / Futsal',
    'Lainnya (Custom)'
  ];

  const COCURRICULAR_TEMPLATES = [
    'Projek Penguatan Profil Pelajar Pancasila (P5)',
    'Senam Anak Indonesia Hebat',
    'Karya Ilmiah Remaja (KIR) Pratama',
    'Pendalaman Karakter Keagamaan',
    'Kunjungan Museum & Literasi Sejarah',
    'Lainnya (Custom)'
  ];

  // Auto-calculate predicate and generate default description
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    
    // Auto predikat
    let autoGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
    if (newScore >= 90) autoGrade = 'A';
    else if (newScore >= 80) autoGrade = 'B';
    else if (newScore >= 70) autoGrade = 'C';
    else if (newScore >= 60) autoGrade = 'D';
    else autoGrade = 'E';

    setGrade(autoGrade);
  };

  // Automated template builder for description text
  const generateAutoDescription = () => {
    const finalSubName = subjectName === 'Lainnya (Custom)' ? customSubjectName : subjectName;
    if (!finalSubName) {
      alert('Tentukan nama mata pelajaran terlebih dahulu!');
      return;
    }

    let phrase = '';
    if (grade === 'A') {
      phrase = `Sangat menonjol dan menunjukkan pemahaman yang sangat istimewa dalam seluruh kompetensi materi ${finalSubName}, aktif berpartisipasi serta rajin membantu teman sebaya.`;
    } else if (grade === 'B') {
      phrase = `Menunjukkan pemahaman yang baik dan konsisten pada sebagian besar kompetensi materi pelajaran ${finalSubName}. Mampu menyelesaikan tugas mandiri dengan rapi.`;
    } else if (grade === 'C') {
      phrase = `Menunjukkan penguasaan materi yang cukup dalam kompetensi ${finalSubName}. Perlu pendalaman dan bimbingan lebih konsisten untuk beberapa pokok pembahasan.`;
    } else if (grade === 'D') {
      phrase = `Menunjukkan perkembangan yang minim pada materi ${finalSubName}. Membutuhkan pendampingan khusus serta latihan pengayaan ekstra baik di sekolah maupun di rumah.`;
    } else {
      phrase = `Belum memenuhi ketuntasan minimum kompetensi ${finalSubName}. Sangat disarankan mengikuti remedial intensif bersama guru kelas.`;
    }

    setDescription(phrase);
  };

  // Auto activity description generator
  const generateAutoActivityDesc = () => {
    const finalActName = activityName === 'Lainnya (Custom)' ? customActivityName : activityName;
    if (!finalActName) {
      alert('Tentukan nama kegiatan terlebih dahulu!');
      return;
    }

    let text = '';
    if (activityPredicate === 'Sangat Baik') {
      text = `Sangat aktif, berdisiplin tinggi, menunjukkan bakat luar biasa, dan memberikan keteladanan yang patut diapresiasi dalam program ${finalActName}.`;
    } else if (activityPredicate === 'Baik') {
      text = `Berpartisipasi aktif, menunjukkan minat serta tanggung jawab yang memuaskan selama mengikuti program kerja ${finalActName}.`;
    } else if (activityPredicate === 'Cukup') {
      text = `Cukup aktif mengikuti latihan rutin ${finalActName}, disarankan untuk lebih meningkatkan konsistensi kehadiran.`;
    } else {
      text = `Kurang aktif dan jarang mengikuti program ${finalActName}, perlu bimbingan khusus dari pembina kegiatan.`;
    }
    setActivityDesc(text);
  };

  // Grade Form submit
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaId) {
      alert('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    const finalSubName = subjectName === 'Lainnya (Custom)' ? customSubjectName : subjectName;
    if (!finalSubName.trim()) {
      alert('Nama mata pelajaran tidak boleh kosong!');
      return;
    }

    const newGrade: SubjectGrade = {
      id: editingGradeId || `grd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      siswaId: selectedSiswaId,
      academicYearId: selectedAyId,
      semester: selectedSemester,
      subjectName: finalSubName,
      score,
      grade,
      description: description || `Menunjukkan kualifikasi ${activityPredicate} pada mata pelajaran ${finalSubName}.`
    };

    if (editingGradeId) {
      setSubjectGrades(prev => prev.map(g => g.id === editingGradeId ? newGrade : g));
      setEditingGradeId(null);
    } else {
      // Avoid duplicates for the same subject
      const isDuplicate = filteredGrades.some(g => g.subjectName.toLowerCase() === finalSubName.toLowerCase());
      if (isDuplicate) {
        if (!confirm(`Nilai untuk pelajaran ${finalSubName} sudah ada. Apakah Anda ingin menimpanya?`)) {
          return;
        }
        setSubjectGrades(prev => prev.filter(g => !(g.siswaId === selectedSiswaId && g.academicYearId === selectedAyId && g.semester === selectedSemester && g.subjectName.toLowerCase() === finalSubName.toLowerCase())).concat(newGrade));
      } else {
        setSubjectGrades(prev => [...prev, newGrade]);
      }
    }

    // Reset inputs
    setCustomSubjectName('');
    setDescription('');
    setScore(80);
    setGrade('B');
  };

  // Activity form submit
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaId) {
      alert('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    const finalActName = activityName === 'Lainnya (Custom)' ? customActivityName : activityName;
    if (!finalActName.trim()) {
      alert('Nama kegiatan tidak boleh kosong!');
      return;
    }

    const newRecord: ActivityRecord = {
      id: editingActivityId || `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      siswaId: selectedSiswaId,
      academicYearId: selectedAyId,
      semester: selectedSemester,
      type: activityType,
      activityName: finalActName,
      predicate: activityPredicate,
      description: activityDesc || `Mengikuti program ${finalActName} dengan kualifikasi ${activityPredicate}.`
    };

    if (editingActivityId) {
      setActivityRecords(prev => prev.map(a => a.id === editingActivityId ? newRecord : a));
      setEditingActivityId(null);
    } else {
      // Avoid duplicates for the exact same activity
      const isDuplicate = filteredActivities.some(a => a.activityName.toLowerCase() === finalActName.toLowerCase());
      if (isDuplicate) {
        if (!confirm(`Kegiatan ${finalActName} sudah terdaftar. Apakah Anda ingin menimpanya?`)) {
          return;
        }
        setActivityRecords(prev => prev.filter(a => !(a.siswaId === selectedSiswaId && a.academicYearId === selectedAyId && a.semester === selectedSemester && a.activityName.toLowerCase() === finalActName.toLowerCase())).concat(newRecord));
      } else {
        setActivityRecords(prev => [...prev, newRecord]);
      }
    }

    setCustomActivityName('');
    setActivityDesc('');
    setActivityPredicate('Baik');
  };

  const handleDeleteGrade = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan nilai mata pelajaran ini?')) {
      setSubjectGrades(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan kegiatan ini?')) {
      setActivityRecords(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6 z-10 relative select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Daftar Nilai & Evaluasi Kegiatan</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Asesmen nilai kognitif kurikulum sekolah, deskripsi raport, serta kegiatan kokurikuler & ekstrakurikuler</p>
      </div>

      {/* STEP 1: Filter Panel */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border border-white/10">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            1. Pilih Rombel / Kelas
          </label>
          <select
            id="nilai-class-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            2. Pilih Siswa (Peserta Didik)
          </label>
          <select
            id="nilai-siswa-select"
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-white"
            disabled={classStudents.length === 0}
          >
            {classStudents.length === 0 ? (
              <option value="">-- Tidak ada siswa di kelas ini --</option>
            ) : (
              classStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name} (NIS: {s.nis})</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            3. Tahun Ajaran Asesmen
          </label>
          <select
            id="nilai-ay-select"
            value={selectedAyId}
            onChange={(e) => setSelectedAyId(e.target.value)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-white"
          >
            {academicYears.map(ay => (
              <option key={ay.id} value={ay.id}>{ay.year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            4. Semester
          </label>
          <div className="flex bg-slate-950/60 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setSelectedSemester('ganjil')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                selectedSemester === 'ganjil' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ganjil
            </button>
            <button
              onClick={() => setSelectedSemester('genap')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                selectedSemester === 'genap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Genap
            </button>
          </div>
        </div>
      </div>

      {currentSiswa ? (
        <div className="space-y-6">
          {/* Student Banner */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/50 via-slate-900/40 to-slate-950/40 rounded-2xl border border-indigo-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base">
                {currentSiswa.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">{currentSiswa.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">NISN: {currentSiswa.nisn} &bull; Kelas: {classes.find(c => c.id === currentSiswa.classId)?.name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubTab('akademik')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  subTab === 'akademik'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                A. Daftar Nilai Kognitif
              </button>
              <button
                onClick={() => {
                  setSubTab('kokurikuler');
                  setActivityType('kokurikuler');
                  setActivityName('Projek Penguatan Profil Pelajar Pancasila (P5)');
                  setCustomActivityName('');
                  setEditingActivityId(null);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  subTab === 'kokurikuler'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                B. Kegiatan Kokurikuler
              </button>
              <button
                onClick={() => {
                  setSubTab('ekstrakurikuler');
                  setActivityType('ekstrakurikuler');
                  setActivityName('Pramuka Siaga/Penggalang');
                  setCustomActivityName('');
                  setEditingActivityId(null);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  subTab === 'ekstrakurikuler'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <Award className="h-3.5 w-3.5 text-indigo-400" />
                C. Kegiatan Ekstrakurikuler
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Input Form (5-span) */}
            <div className="lg:col-span-5 space-y-6">
              {subTab === 'akademik' ? (
                // Subject Grade Form
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                      {editingGradeId ? 'Edit Nilai Pelajaran' : 'Tambah Nilai Pelajaran'}
                    </h3>
                    {editingGradeId && (
                      <button
                        onClick={() => {
                          setEditingGradeId(null);
                          setCustomSubjectName('');
                          setDescription('');
                          setScore(80);
                        }}
                        className="text-[9px] text-rose-400 font-bold hover:underline"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveGrade} className="space-y-4 text-xs font-medium text-slate-300">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mata Pelajaran</label>
                      <select
                        value={subjectName}
                        onChange={(e) => {
                          setSubjectName(e.target.value);
                          if (e.target.value !== 'Lainnya (Custom)') setCustomSubjectName('');
                        }}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-white text-xs"
                      >
                        {STANDARD_SUBJECTS.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>

                    {subjectName === 'Lainnya (Custom)' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ketik Pelajaran Kustom</label>
                        <input
                          type="text"
                          required
                          value={customSubjectName}
                          onChange={(e) => setCustomSubjectName(e.target.value)}
                          placeholder="Contoh: Mulok Bahasa Daerah Jawa"
                          className="w-full glass-input rounded-xl p-3"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Skor Nilai: <strong className="text-white text-xs">{score}</strong></span>
                        <span>Predikat: <strong className="text-indigo-400 text-xs">{grade}</strong></span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => handleScoreChange(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>0 (Sangat Kurang)</span>
                        <span>70 (Cukup)</span>
                        <span>100 (Sempurna)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Capaian Nilai</label>
                        <button
                          type="button"
                          onClick={generateAutoDescription}
                          className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-[9px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          Tulis Otomatis Deskripsi
                        </button>
                      </div>
                      <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsikan penguasaan materi kognitif siswa dalam mata pelajaran ini..."
                        rows={4}
                        className="w-full glass-input rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-slate-200 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                      <Save className="h-4 w-4" />
                      {editingGradeId ? 'Simpan Perubahan Nilai' : 'Simpan Nilai Pelajaran'}
                    </button>
                  </form>
                </div>
              ) : (
                // Activities Form (Ekskul & Kokurikuler)
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      {subTab === 'kokurikuler' ? (
                        <>
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          {editingActivityId ? 'Edit Kegiatan Kokurikuler' : 'Tambah Kegiatan Kokurikuler'}
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4 text-indigo-400" />
                          {editingActivityId ? 'Edit Kegiatan Ekstrakurikuler' : 'Tambah Kegiatan Ekstrakurikuler'}
                        </>
                      )}
                    </h3>
                    {editingActivityId && (
                      <button
                        onClick={() => {
                          setEditingActivityId(null);
                          setCustomActivityName('');
                          setActivityDesc('');
                        }}
                        className="text-[9px] text-rose-400 font-bold hover:underline"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveActivity} className="space-y-4 text-xs font-medium text-slate-300">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Kegiatan</label>
                      <select
                        value={activityName}
                        onChange={(e) => {
                          setActivityName(e.target.value);
                          if (e.target.value !== 'Lainnya (Custom)') setCustomActivityName('');
                        }}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-white text-xs"
                      >
                        {activityType === 'ekstrakurikuler' ? (
                          EXTRACURRICULAR_TEMPLATES.map((item, idx) => (
                            <option key={idx} value={item}>{item}</option>
                          ))
                        ) : (
                          COCURRICULAR_TEMPLATES.map((item, idx) => (
                            <option key={idx} value={item}>{item}</option>
                          ))
                        )}
                      </select>
                    </div>

                    {activityName === 'Lainnya (Custom)' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ketik Nama Kegiatan Kustom</label>
                        <input
                          type="text"
                          required
                          value={customActivityName}
                          onChange={(e) => setCustomActivityName(e.target.value)}
                          placeholder={activityType === 'ekstrakurikuler' ? "Contoh: Palang Merah Remaja (PMR)" : "Contoh: Karya Tulis Siswa Mandiri"}
                          className="w-full glass-input rounded-xl p-3"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Predikat / Keterangan Kualifikasi</label>
                      <select
                        value={activityPredicate}
                        onChange={(e) => setActivityPredicate(e.target.value as any)}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-white text-xs"
                      >
                        <option value="Sangat Baik">Sangat Baik (Sangat aktif & terampil)</option>
                        <option value="Baik">Baik (Berpartisipasi aktif)</option>
                        <option value="Cukup">Cukup (Mengikuti kegiatan dengan cukup)</option>
                        <option value="Kurang">Kurang (Jarang hadir / kurang berpartisipasi)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi / Keterangan Capaian</label>
                        <button
                          type="button"
                          onClick={generateAutoActivityDesc}
                          className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-[9px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          Tulis Otomatis Deskripsi
                        </button>
                      </div>
                      <textarea
                        required
                        value={activityDesc}
                        onChange={(e) => setActivityDesc(e.target.value)}
                        placeholder="Deskripsikan kontribusi, minat, perkembangan bakat siswa dalam program kegiatan ini..."
                        rows={4}
                        className="w-full glass-input rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-slate-200 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                      <Save className="h-4 w-4" />
                      {editingActivityId ? 'Simpan Perubahan Kegiatan' : 'Simpan Kegiatan'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Display List (7-span) */}
            <div className="lg:col-span-7 space-y-6">
              {subTab === 'akademik' ? (
                // Subject Grades List Table
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                        Rangkuman Nilai Mapel ({filteredGrades.length})
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-950/60 px-2 py-1 rounded">
                      Semester {selectedSemester}
                    </span>
                  </div>

                  {filteredGrades.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                      Belum ada nilai kognitif terdaftar untuk siswa ini di Semester {selectedSemester}.
                       Gunakan form di samping untuk memasukkan nilai pertama!
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredGrades.map((g) => (
                        <div key={g.id} className="p-4 hover:bg-white/5 transition flex justify-between items-start gap-4">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <h4 className="font-extrabold text-white text-xs">{g.subjectName}</h4>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                                Skor: {g.score}
                              </span>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded">
                                Predikat: {g.grade}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed">
                              "{g.description}"
                            </p>
                          </div>

                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingGradeId(g.id);
                                if (STANDARD_SUBJECTS.includes(g.subjectName)) {
                                  setSubjectName(g.subjectName);
                                  setCustomSubjectName('');
                                } else {
                                  setSubjectName('Lainnya (Custom)');
                                  setCustomSubjectName(g.subjectName);
                                }
                                setScore(g.score);
                                setGrade(g.grade);
                                setDescription(g.description);
                              }}
                              className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded transition cursor-pointer"
                              title="Edit Nilai"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGrade(g.id)}
                              className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition cursor-pointer"
                              title="Hapus Nilai"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Activities List Table
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {subTab === 'kokurikuler' ? (
                        <>
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                            Rangkuman Kegiatan Kokurikuler ({displayActivities.length})
                          </h3>
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4 text-indigo-400" />
                          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                            Rangkuman Kegiatan Ekstrakurikuler ({displayActivities.length})
                          </h3>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-950/60 px-2 py-1 rounded">
                      Semester {selectedSemester}
                    </span>
                  </div>

                  {displayActivities.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                      Belum ada kegiatan {subTab === 'kokurikuler' ? 'kokurikuler' : 'ekstrakurikuler'} yang terdaftar untuk siswa ini di Semester {selectedSemester}.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {displayActivities.map((a) => (
                        <div key={a.id} className="p-4 hover:bg-white/5 transition flex justify-between items-start gap-4">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <h4 className="font-extrabold text-white text-xs">{a.activityName}</h4>
                              <span className="text-[9px] font-bold px-2 py-0.2 uppercase rounded bg-slate-950/60 border border-white/15 text-slate-300">
                                {a.type}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                a.predicate === 'Sangat Baik' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20' :
                                a.predicate === 'Baik' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20' :
                                a.predicate === 'Cukup' ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' :
                                'bg-rose-500/20 text-rose-300 border-rose-500/20'
                              }`}>
                                {a.predicate}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed">
                              "{a.description}"
                            </p>
                          </div>

                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingActivityId(a.id);
                                setSubTab(a.type);
                                setActivityType(a.type);
                                if (EXTRACURRICULAR_TEMPLATES.includes(a.activityName) || COCURRICULAR_TEMPLATES.includes(a.activityName)) {
                                  setActivityName(a.activityName);
                                  setCustomActivityName('');
                                } else {
                                  setActivityName('Lainnya (Custom)');
                                  setCustomActivityName(a.activityName);
                                }
                                setActivityPredicate(a.predicate);
                                setActivityDesc(a.description);
                              }}
                              className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded transition cursor-pointer"
                              title="Edit Kegiatan"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(a.id)}
                              className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition cursor-pointer"
                              title="Hapus Kegiatan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 glass-card rounded-2xl border border-white/5 text-center text-slate-400 font-semibold text-xs">
          Silakan tambahkan data kesiswaan atau pilih salah satu rombel di atas untuk memulai asimilasi nilai akademik.
        </div>
      )}
    </div>
  );
}
