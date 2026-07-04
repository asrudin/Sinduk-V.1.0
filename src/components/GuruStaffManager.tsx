import React, { useState } from 'react';
import { User, Class } from '../types';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  X,
  Shield,
  UserCheck,
  BookOpen
} from 'lucide-react';

interface GuruStaffManagerProps {
  users: User[];
  classes: Class[];
  currentUser: any;
  onAddUser: (u: Omit<User, 'id'>) => void;
  onUpdateUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function GuruStaffManager({
  users,
  classes,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: GuruStaffManagerProps) {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'guru'>('guru');
  const [classId, setClassId] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [nuptk, setNuptk] = useState('');
  const [nip, setNip] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) return;

    const dataPayload = {
      username: username.toLowerCase().replace(/\s+/g, ''),
      name: name,
      role: role,
      classId: role === 'guru' && classId ? classId : undefined,
      nuptk: nuptk.trim() || undefined,
      nip: nip.trim() || undefined,
      gender: gender
    };

    if (editingUser) {
      onUpdateUser({
        ...dataPayload,
        id: editingUser.id
      });
    } else {
      onAddUser(dataPayload);
    }

    setIsModalOpen(false);
    setUsername('');
    setName('');
    setClassId('');
    setNuptk('');
    setNip('');
    setGender('L');
    setEditingUser(null);
  };

  const startEditUser = (u: User) => {
    setEditingUser(u);
    setUsername(u.username);
    setName(u.name);
    setRole(u.role);
    setClassId(u.classId || '');
    setNuptk(u.nuptk || '');
    setNip(u.nip || '');
    setGender(u.gender || 'L');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 z-10 relative select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Manajemen Guru & Staf Tata Usaha</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Registrasi hak akses, verifikasi peran kesiswaan, dan koordinasi Wali Kelas pembimbing</p>
        </div>
        {currentUser.role === 'admin' && (
          <button
            id="btn-add-staff"
            onClick={() => {
              setEditingUser(null);
              setUsername('');
              setName('');
              setRole('guru');
              setClassId('');
              setNuptk('');
              setNip('');
              setGender('L');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Pendidik / Staf
          </button>
        )}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((u) => {
          const assignedClass = classes.find(c => c.id === u.classId);
          const isAdmin = u.role === 'admin';

          return (
            <div key={u.id} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-44">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${
                    isAdmin 
                      ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' 
                      : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
                  }`}>
                    {isAdmin ? <Shield className="h-5.5 w-5.5" /> : <UserCheck className="h-5.5 w-5.5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{u.name}</h3>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 items-center">
                      <span className="text-[9px] text-slate-400 font-mono">@{u.username}</span>
                      <span className="text-[9px] text-indigo-400 font-extrabold">({u.gender || 'L'})</span>
                    </div>
                    {u.nuptk && (
                      <p className="text-[9px] text-slate-400 font-mono mt-1">NUPTK: {u.nuptk}</p>
                    )}
                    {u.nip && (
                      <p className="text-[9px] text-slate-400 font-mono">NIP: {u.nip}</p>
                    )}
                  </div>
                </div>

                {currentUser.role === 'admin' && currentUser.id !== u.id && (
                  <div className="flex gap-1.5">
                    <button
                      id={`btn-edit-staff-${u.id}`}
                      onClick={() => startEditUser(u)}
                      className="p-1 text-slate-400 hover:text-white transition"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      id={`btn-delete-staff-${u.id}`}
                      onClick={() => {
                        if (confirm(`Apakah Anda yakin ingin mencabut hak akses ${u.name}?`)) {
                          onDeleteUser(u.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Assignments / Role badge */}
              <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Kewenangan</span>
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${
                    isAdmin 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {isAdmin ? 'Tata Usaha / Admin' : 'Guru / Wali Kelas'}
                  </span>
                </div>

                {u.role === 'guru' && (
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Pendampingan Rombel</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                      {assignedClass ? assignedClass.name : 'Belum Ditugaskan'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                {editingUser ? 'Edit Akun Guru & Staf' : 'Tambah Guru & Staf Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Drs. Heri Hermawan"
                  className="w-full text-xs glass-input rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username Akses</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: heri_wali"
                  className="w-full text-xs glass-input rounded-xl p-3 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Wewenang / Hak Akses</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full text-xs glass-input rounded-xl p-3"
                >
                  <option value="guru">Guru Pengampu</option>
                  <option value="admin">Administrator Tata Usaha</option>
                </select>
              </div>

              {role === 'guru' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fungsional Wali Kelas</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full text-xs glass-input rounded-xl p-3"
                  >
                    <option value="">-- Bukan Wali Kelas (Hanya Guru Bidang Studi) --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NUPTK</label>
                  <input
                    type="text"
                    value={nuptk}
                    onChange={(e) => setNuptk(e.target.value)}
                    placeholder="16 Digit NUPTK"
                    className="w-full text-xs glass-input rounded-xl p-3 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NIP</label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="18 Digit NIP"
                    className="w-full text-xs glass-input rounded-xl p-3 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jenis Kelamin</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender_staff"
                      checked={gender === 'L'}
                      onChange={() => setGender('L')}
                      className="accent-indigo-500"
                    />
                    Laki-laki (L)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender_staff"
                      checked={gender === 'P'}
                      onChange={() => setGender('P')}
                      className="accent-indigo-500"
                    />
                    Perempuan (P)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
