import React, { useState } from 'react';
import { Siswa, StudentNote, NoteType } from '../types';
import { 
  Award, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Trash2, 
  Search, 
  User, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';

interface CatatanManagerProps {
  studentNotes: StudentNote[];
  siswa: Siswa[];
  currentUser: any;
  onAddNote: (n: Omit<StudentNote, 'id'>) => void;
  onDeleteNote: (id: string) => void;
}

export default function CatatanManager({
  studentNotes,
  siswa,
  currentUser,
  onAddNote,
  onDeleteNote
}: CatatanManagerProps) {
  // Filters state
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | NoteType>('all');
  const [selectedSiswaId, setSelectedSiswaId] = useState('all');

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSiswaId, setFormSiswaId] = useState('');
  const [formType, setFormType] = useState<NoteType>('prestasi');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Note Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSiswaId || !formTitle.trim() || !formDescription.trim()) return;

    onAddNote({
      siswaId: formSiswaId,
      type: formType,
      date: formDate,
      title: formTitle,
      description: formDescription,
      reporter: currentUser.name
    });

    setIsModalOpen(false);
    setFormTitle('');
    setFormDescription('');
    setFormSiswaId('');
  };

  // Filter notes
  const filteredNotes = studentNotes.filter(n => {
    const sName = siswa.find(s => s.id === n.siswaId)?.name || '';
    const matchesSearch = 
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()) ||
      sName.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || n.type === selectedType;
    const matchesSiswa = selectedSiswaId === 'all' || n.siswaId === selectedSiswaId;

    return matchesSearch && matchesType && matchesSiswa;
  });

  return (
    <div className="space-y-6 z-10 relative select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Catatan Perkembangan & Prestasi Siswa</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Rekam insiden bimbingan konseling, rekor prestasi olimpiade/olahraga, serta pembinaan disiplin kesiswaan</p>
        </div>
        <button
          id="btn-add-note"
          onClick={() => {
            setFormSiswaId(siswa[0]?.id || '');
            setFormType('prestasi');
            setFormTitle('');
            setFormDescription('');
            setFormDate(new Date().toISOString().split('T')[0]);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Catatan Siswa
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 border border-white/10">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="note-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, isi catatan, nama siswa..."
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-9 focus:outline-none focus:border-indigo-500 text-white"
          />
        </div>

        {/* Note Type Filter */}
        <div>
          <select
            id="filter-note-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 text-slate-300"
          >
            <option value="all">Semua Kategori Catatan</option>
            <option value="prestasi">Prestasi & Penghargaan</option>
            <option value="pelanggaran">Pelanggaran & Kedisiplinan</option>
            <option value="kehadiran">Kehadiran (Absensi Spesial)</option>
            <option value="catatan">Bimbingan Konseling / Karakter</option>
          </select>
        </div>

        {/* Specific Student Filter */}
        <div>
          <select
            id="filter-note-student"
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="w-full text-xs bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 text-slate-300"
          >
            <option value="all">Semua Siswa</option>
            {siswa.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Catatan Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-2 glass-card py-16 text-center text-slate-500 text-xs font-semibold rounded-2xl border border-white/10">
            Tidak ada catatan yang sesuai dengan filter pencarian Anda.
          </div>
        ) : (
          filteredNotes.map((note) => {
            const student = siswa.find(s => s.id === note.siswaId);
            const studentName = student ? student.name : 'Siswa Tidak Ditemukan';
            const studentNis = student ? student.nis : '-';

            const isPrestasi = note.type === 'prestasi';
            const isPelanggaran = note.type === 'pelanggaran';
            const isKehadiran = note.type === 'kehadiran';

            let iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/25';
            let Icon = FileText;
            if (isPrestasi) {
              iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/25';
              Icon = Award;
            } else if (isPelanggaran) {
              iconColor = 'text-rose-400 bg-rose-500/10 border-rose-500/25';
              Icon = AlertTriangle;
            } else if (isKehadiran) {
              iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
              Icon = UserCheck;
            }

            return (
              <div key={note.id} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wide block">
                        Siswa: {studentName} ({studentNis})
                      </span>
                      <h3 className="font-extrabold text-white text-sm mt-0.5">{note.title}</h3>
                    </div>
                  </div>

                  <button
                    id={`btn-delete-note-${note.id}`}
                    onClick={() => {
                      if (confirm(`Hapus catatan "${note.title}" untuk siswa ${studentName}?`)) {
                        onDeleteNote(note.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {note.description}
                </p>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono">{note.date}</span>
                  </div>
                  <span>Dilaporkan oleh: <span className="font-bold text-slate-300">{note.reporter}</span></span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Student Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Tambah Catatan Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Siswa</label>
                <select
                  required
                  value={formSiswaId}
                  onChange={(e) => setFormSiswaId(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl p-3"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswa.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kategori Catatan</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full text-xs glass-input rounded-xl p-3"
                >
                  <option value="prestasi">Prestasi & Penghargaan</option>
                  <option value="pelanggaran">Pelanggaran & Kedisiplinan</option>
                  <option value="kehadiran">Kehadiran (Absensi Spesial)</option>
                  <option value="catatan">Bimbingan Konseling / Karakter</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Peristiwa</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Catatan</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="E.g. Juara 1 Catur O2SN Kota"
                  className="w-full text-xs glass-input rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi / Uraian</label>
                <textarea
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tuliskan detail catatan bimbingan atau penjelasan prestasi kesiswaan secara rinci."
                  rows={3}
                  className="w-full text-xs glass-input rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
