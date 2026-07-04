import { 
  Users, 
  GraduationCap, 
  Award, 
  AlertTriangle,
  Heart,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';
import { Siswa, Class, StudentNote } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface DashboardProps {
  siswa: Siswa[];
  classes: Class[];
  studentNotes: StudentNote[];
  onTriggerMockData?: () => void;
}

export default function Dashboard({ siswa, classes, studentNotes, onTriggerMockData }: DashboardProps) {
  // 1. Calculations
  const totalSiswa = siswa.length;
  const activeSiswa = siswa.filter(s => s.status === 'active').length;
  const graduatedSiswa = siswa.filter(s => s.status === 'graduated').length;
  const otherStatusSiswa = totalSiswa - activeSiswa - graduatedSiswa;

  // Gender breakdown
  const maleCount = siswa.filter(s => s.gender === 'L').length;
  const femaleCount = siswa.filter(s => s.gender === 'P').length;

  const genderData = [
    { name: 'Laki-laki (L)', value: maleCount, color: '#3b82f6' }, // Blue
    { name: 'Perempuan (P)', value: femaleCount, color: '#ec4899' }, // Pink
  ];

  // Class distribution chart data
  const classChartData = classes.map(cls => {
    const siswaInClass = siswa.filter(s => s.classId === cls.id && s.status === 'active').length;
    return {
      name: cls.name,
      'Siswa Aktif': siswaInClass,
    };
  });

  // Recent 5 Student Notes
  const recentNotes = [...studentNotes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 z-10 relative">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Ringkasan Dasbor Sekolah</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Statistik Buku Induk Siswa, data sebaran kelas, dan catatan prestasi terkini</p>
        </div>
        {onTriggerMockData && (
          <button
            id="btn-trigger-mock"
            onClick={onTriggerMockData}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-xs font-bold transition duration-150 cursor-pointer"
          >
            <Activity className="h-4 w-4 text-indigo-400" />
            Simulasi Tambah Catatan Siswa
          </button>
        )}
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa terdaftar */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-white/10">
          <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold tracking-wider uppercase text-[10px]">Siswa Terdaftar</span>
            <span className="text-lg font-extrabold text-white mt-1 block">{totalSiswa} Siswa</span>
            <span className="text-[10px] text-indigo-300 font-bold mt-0.5 block">{activeSiswa} Status Aktif</span>
          </div>
        </div>

        {/* Siswa Lulus */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-white/10">
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold tracking-wider uppercase text-[10px]">Alumni / Lulus</span>
            <span className="text-lg font-extrabold text-emerald-400 mt-1 block">{graduatedSiswa} Alumni</span>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">Arsip lulusan terekam</span>
          </div>
        </div>

        {/* Prestasi Terekam */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-white/10">
          <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold tracking-wider uppercase text-[10px]">Catatan Prestasi</span>
            <span className="text-lg font-extrabold text-amber-400 mt-1 block">
              {studentNotes.filter(n => n.type === 'prestasi').length} Prestasi
            </span>
            <span className="text-[10px] text-amber-300 font-bold mt-0.5 block">Akademik & Non-Akademik</span>
          </div>
        </div>

        {/* Pelanggaran / Pembinaan */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-white/10">
          <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold tracking-wider uppercase text-[10px]">Catatan Pembinaan</span>
            <span className="text-lg font-extrabold text-rose-400 mt-1 block">
              {studentNotes.filter(n => n.type === 'pelanggaran').length} Kasus
            </span>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">Pelanggaran & Kedisiplinan</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bar Chart (Class distribution) */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between border border-white/10">
          <div>
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">Sebaran Jumlah Siswa per Rombel / Kelas</h2>
            <p className="text-[10px] text-slate-400 mb-4 font-medium">Grafik kuantitas siswa aktif di masing-masing rombongan belajar</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  formatter={(value: any) => [`${value} Siswa`, 'Aktif']}
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    backdropFilter: 'blur(10px)', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: '1px solid rgba(255, 255, 255, 0.12)', 
                    fontSize: '11px' 
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px', color: '#f1f5f9' }} />
                <Bar dataKey="Siswa Aktif" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Pie Chart (Gender Breakdown) */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-white/10">
          <div>
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">Proporsi Gender Siswa</h2>
            <p className="text-[10px] text-slate-400 mb-4 font-medium">Perbandingan jumlah siswa Laki-laki vs Perempuan di seluruh angkatan</p>
          </div>
          
          <div className="h-44 w-full flex items-center justify-center relative">
            {totalSiswa > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} Siswa`, '']}
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.9)', 
                      backdropFilter: 'blur(10px)', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: '1px solid rgba(255, 255, 255, 0.12)', 
                      fontSize: '11px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500">Tidak ada data</div>
            )}
            
            <div className="absolute text-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
              <span className="text-sm font-extrabold text-white block mt-0.5">{totalSiswa} Siswa</span>
            </div>
          </div>

          <div className="space-y-2.5 mt-4 border-t border-white/5 pt-4">
            {genderData.map((gen, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: gen.color }} />
                  <span className="text-slate-300 font-semibold">{gen.name}</span>
                </div>
                <span className="font-bold text-white">
                  {gen.value} ({totalSiswa > 0 ? Math.round((gen.value / totalSiswa) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notes Feed */}
      <div className="glass-card p-5 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider mb-0.5">Aktivitas & Catatan Kedisiplinan / Prestasi Siswa Terkini</h2>
            <p className="text-[10px] text-slate-400 font-medium font-semibold uppercase tracking-wider text-indigo-400">Log Aktivitas Guru</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {recentNotes.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">Belum ada aktivitas terekam.</div>
          ) : (
            recentNotes.map(note => {
              const studentName = siswa.find(s => s.id === note.siswaId)?.name || 'Siswa tidak ditemukan';
              const isPrestasi = note.type === 'prestasi';
              const isPelanggaran = note.type === 'pelanggaran';
              const isKehadiran = note.type === 'kehadiran';

              let badgeColor = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
              if (isPrestasi) badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
              if (isPelanggaran) badgeColor = 'bg-rose-500/10 text-rose-300 border-rose-500/20';
              if (isKehadiran) badgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';

              return (
                <div key={note.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition duration-150 gap-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-bold uppercase rounded-md border ${badgeColor}`}>
                        {note.type}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{note.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Siswa: <span className="font-bold text-slate-300">{studentName}</span> &bull; {note.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 shrink-0">
                    <p className="font-mono">{note.date}</p>
                    <p className="mt-0.5">Oleh: {note.reporter}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
