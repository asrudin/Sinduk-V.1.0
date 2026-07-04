import { 
  LayoutDashboard, 
  Users, 
  School, 
  Award, 
  Upload, 
  Contact, 
  Database, 
  LogOut,
  Copy,
  GraduationCap
} from 'lucide-react';
import { User, ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'guru'] },
    { id: 'siswa', label: 'Buku Induk Siswa', icon: Users, roles: ['admin', 'guru'] },
    { id: 'nilai', label: 'Input Nilai & Ekskul', icon: GraduationCap, roles: ['admin', 'guru'] },
    { id: 'kelas', label: 'Kelola Kelas', icon: School, roles: ['admin'] },
    { id: 'catatan', label: 'Catatan & Prestasi', icon: Award, roles: ['admin', 'guru'] },
    { id: 'importer', label: 'Import Massal', icon: Upload, roles: ['admin'] },
    { id: 'petugas', label: 'Guru & Staf', icon: Contact, roles: ['admin'] },
    { id: 'templates', label: 'Template Sync', icon: Copy, roles: ['admin', 'guru'] },
    { id: 'backup', label: 'Backup & Restore', icon: Database, roles: ['admin'] },
  ];

  return (
    <aside id="app-sidebar" className="w-64 z-10 flex flex-col backdrop-blur-xl bg-white/5 border-r border-white/10 h-screen select-none text-white shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
            BI
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none tracking-tight">Buku Induk <span className="text-indigo-400 italic font-medium">Digital</span></h1>
            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Arsip Siswa & Akademik</p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4 mx-3 my-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-200 uppercase border border-white/10">
          {currentUser.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
          <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded mt-1 border ${
            currentUser.role === 'admin' 
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isAllowed = item.roles.includes(currentUser.role);
          if (!isAllowed) return null;

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              id={`sidebar-btn-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition duration-150 cursor-pointer ${
                isActive 
                  ? 'bg-white/20 text-white font-semibold border-l-2 border-indigo-400' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-white/10">
        <button
          id="logout-btn"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-400" />
          Keluar Sesi
        </button>
      </div>
    </aside>
  );
}
