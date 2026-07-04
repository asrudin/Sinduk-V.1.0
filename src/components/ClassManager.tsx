import React, { useState } from 'react';
import { Class, AcademicYear, User, Siswa } from '../types';
import { 
  School, 
  Plus, 
  Trash2, 
  Edit, 
  X,
  Calendar,
  Layers,
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface ClassManagerProps {
  classes: Class[];
  academicYears: AcademicYear[];
  users: User[];
  siswa: Siswa[];
  onAddClass: (c: Omit<Class, 'id'>) => void;
  onUpdateClass: (c: Class) => void;
  onDeleteClass: (id: string) => void;
  onAddAcademicYear: (ay: Omit<AcademicYear, 'id'>) => void;
  onDeleteAcademicYear: (id: string) => void;
}

export default function ClassManager({
  classes,
  academicYears,
  users,
  siswa,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddAcademicYear,
  onDeleteAcademicYear
}: ClassManagerProps) {
  // Class Modal States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [classGrade, setClassGrade] = useState('1');
  const [homeroomTeacher, setHomeroomTeacher] = useState('');
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // Academic Year States
  const [isAyModalOpen, setIsAyModalOpen] = useState(false);
  const [ayYear, setAyYear] = useState('2025/2026');
  const [aySemester, setAySemester] = useState<'ganjil' | 'genap'>('ganjil');

  // Handle Class form submission
  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !homeroomTeacher.trim()) return;

    const dataPayload = {
      name: className,
      grade: classGrade,
      homeroomTeacher: homeroomTeacher
    };

    if (editingClass) {
      onUpdateClass({
        ...dataPayload,
        id: editingClass.id
      });
    } else {
      onAddClass(dataPayload);
    }

    setIsClassModalOpen(false);
    setClassName('');
    setHomeroomTeacher('');
    setEditingClass(null);
  };

  // Start Class Edit
  const startEditClass = (c: Class) => {
    setEditingClass(c);
    setClassName(c.name);
    setClassGrade(c.grade);
    setHomeroomTeacher(c.homeroomTeacher);
    setIsClassModalOpen(true);
  };

  // Handle Academic Year Submit
  const handleAySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ayYear.trim()) return;

    onAddAcademicYear({
      year: ayYear,
      semester: aySemester
    });

    setIsAyModalOpen(false);
    setAyYear('2025/2026');
  };

  return (
    <div className="space-y-6 z-10 relative select-none">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Kelola Kelas & Tahun Akademik</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Atur rombongan belajar (rombel), Wali Kelas, dan periode ajaran kesiswaan aktif</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2-Span): Classes Management */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 space-y-4 border border-white/10">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">Daftar Rombongan Belajar (Rombel)</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Daftar kelas aktif dan nama wali kelas yang diamanatkan</p>
            </div>
            <button
              id="btn-add-class"
              onClick={() => {
                setEditingClass(null);
                setClassName('');
                setClassGrade('1');
                setHomeroomTeacher(users[1]?.name || 'Siti Rahmawati, S.Pd.');
                setIsClassModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Kelas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((cls) => {
              // Count students in this class
              const activeCount = siswa.filter(s => s.classId === cls.id && s.status === 'active').length;
              const totalCount = siswa.filter(s => s.classId === cls.id).length;

              return (
                <div key={cls.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                        {cls.grade}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm">{cls.name}</h3>
                        <p className="text-[10px] text-slate-400">Wali: {cls.homeroomTeacher}</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        id={`edit-class-${cls.id}`}
                        onClick={() => startEditClass(cls)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        id={`delete-class-${cls.id}`}
                        onClick={() => {
                          if (confirm(`Hapus kelas ${cls.name}? Siswa di kelas ini tidak akan terhapus namun kelasnya akan kosong.`)) {
                            onDeleteClass(cls.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">Jumlah Siswa</span>
                    <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {activeCount} Aktif / {totalCount} Siswa
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Academic Years */}
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-white/10">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">Tahun Akademik / Semester</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Sistem filter periode ajaran</p>
            </div>
            <button
              id="btn-add-ay"
              onClick={() => {
                setAyYear('2025/2026');
                setAySemester('ganjil');
                setIsAyModalOpen(true);
              }}
              className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5 space-y-3">
            {academicYears.map((ay) => {
              return (
                <div key={ay.id} className="pt-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-extrabold text-white">T.A. {ay.year}</p>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Semester {ay.semester}</span>
                    </div>
                  </div>

                  <button
                    id={`delete-ay-${ay.id}`}
                    onClick={() => {
                      if (academicYears.length <= 1) {
                        alert('Gagal! Minimal harus ada satu Tahun Akademik aktif dalam sistem Buku Induk.');
                        return;
                      }
                      if (confirm(`Hapus periode tahun ajaran ${ay.year}?`)) {
                        onDeleteAcademicYear(ay.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 text-[10px] text-indigo-300/90 leading-relaxed">
            <h4 className="font-bold flex items-center gap-1 mb-1">
              <HelpCircle className="h-3 w-3" />
              Info Rombel & Angkatan
            </h4>
            Pengaturan kelas dan tahun masuk memfasilitasi filter kependudukan siswa serta menjamin validitas pencetakan Formulir Resmi Buku Induk.
          </div>
        </div>
      </div>

      {/* Class Form Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                {editingClass ? 'Sunting Data Rombel' : 'Tambah Rombel Baru'}
              </h2>
              <button onClick={() => setIsClassModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleClassSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tingkat Pendidikan</label>
                <select
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl p-3"
                >
                  <option value="1">Kelas 1 (SD)</option>
                  <option value="2">Kelas 2 (SD)</option>
                  <option value="3">Kelas 3 (SD)</option>
                  <option value="4">Kelas 4 (SD)</option>
                  <option value="5">Kelas 5 (SD)</option>
                  <option value="6">Kelas 6 (SD)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Rombel / Kelas</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: Kelas 1-A"
                  className="w-full text-xs glass-input rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Wali Kelas (Guru Pengampu)</label>
                <input
                  type="text"
                  required
                  value={homeroomTeacher}
                  onChange={(e) => setHomeroomTeacher(e.target.value)}
                  placeholder="Contoh: Rina Kartika, S.Pd."
                  className="w-full text-xs glass-input rounded-xl p-3"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Academic Year Form Modal */}
      {isAyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Tambah Tahun Ajaran</h2>
              <button onClick={() => setIsAyModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAySubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tahun Pelajaran</label>
                <input
                  type="text"
                  required
                  value={ayYear}
                  onChange={(e) => setAyYear(e.target.value)}
                  placeholder="E.g. 2025/2026"
                  className="w-full text-xs glass-input rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Semester Aktif</label>
                <select
                  value={aySemester}
                  onChange={(e) => setAySemester(e.target.value as any)}
                  className="w-full text-xs glass-input rounded-xl p-3"
                >
                  <option value="ganjil">Semester Ganjil</option>
                  <option value="genap">Semester Genap</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAyModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
