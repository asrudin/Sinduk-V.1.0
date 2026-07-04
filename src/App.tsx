import { useState, useEffect } from 'react';
import { User, Class, AcademicYear, Siswa, StudentNote, ActiveTab, SubjectGrade, ActivityRecord } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_CLASSES, 
  INITIAL_ACADEMIC_YEARS, 
  INITIAL_SISWA, 
  INITIAL_STUDENT_NOTES,
  INITIAL_SUBJECT_GRADES,
  INITIAL_ACTIVITY_RECORDS,
  loadStoredData,
  saveStoredData 
} from './data/mockData';

// Component Imports
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SiswaManager from './components/SiswaManager';
import ClassManager from './components/ClassManager';
import CatatanManager from './components/CatatanManager';
import SiswaImporter from './components/SiswaImporter';
import GuruStaffManager from './components/GuruStaffManager';
import TemplateSheets from './components/TemplateSheets';
import BackupRestore from './components/BackupRestore';
import NilaiManager from './components/NilaiManager';

import { Shield } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadStoredData<User | null>('logged_in_user', null);
  });
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return loadStoredData<ActiveTab>('active_tab', 'dashboard');
  });

  const [classes, setClasses] = useState<Class[]>(() => {
    const loaded = loadStoredData<Class[]>('classes', INITIAL_CLASSES);
    // Auto-migrate if old high school class exists
    const hasHighSchool = loaded.some(c => c.grade === '10' || c.grade === '11' || c.grade === '12' || c.name.includes('Kelas X') || c.name.includes('Kelas XI'));
    if (hasHighSchool) {
      return INITIAL_CLASSES;
    }
    return loaded;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadStoredData<User[]>('users', INITIAL_USERS);
    // Auto-migrate if we lack the primary school teachers
    const hasOldUsers = loaded.some(u => u.name.includes('Siti Rahmawati') && !u.nuptk);
    if (hasOldUsers || !loaded.some(u => u.username === 'guru6')) {
      return INITIAL_USERS;
    }
    return loaded;
  });

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const loaded = loadStoredData<AcademicYear[]>('academic_years', INITIAL_ACADEMIC_YEARS);
    if (loaded.some(ay => ay.year === '2022/2023')) {
      return INITIAL_ACADEMIC_YEARS;
    }
    return loaded;
  });

  const [siswa, setSiswa] = useState<Siswa[]>(() => {
    const loaded = loadStoredData<Siswa[]>('siswa', INITIAL_SISWA);
    // Auto-migrate if high-school student detected
    const hasHighSchoolSiswa = loaded.some(s => s.nis?.startsWith('222310') || s.previousSchool?.includes('SMP'));
    if (hasHighSchoolSiswa) {
      return INITIAL_SISWA;
    }
    return loaded;
  });

  const [studentNotes, setStudentNotes] = useState<StudentNote[]>(() => {
    return loadStoredData<StudentNote[]>('student_notes', INITIAL_STUDENT_NOTES);
  });

  const [subjectGrades, setSubjectGrades] = useState<SubjectGrade[]>(() => {
    return loadStoredData<SubjectGrade[]>('subject_grades', INITIAL_SUBJECT_GRADES);
  });

  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(() => {
    return loadStoredData<ActivityRecord[]>('activity_records', INITIAL_ACTIVITY_RECORDS);
  });

  // 2. State Synchronizers to LocalStorage (via buku_induk_ prefix inside mockData helpers)
  useEffect(() => {
    saveStoredData('logged_in_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredData('active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveStoredData('users', users);
  }, [users]);

  useEffect(() => {
    saveStoredData('classes', classes);
  }, [classes]);

  useEffect(() => {
    saveStoredData('academic_years', academicYears);
  }, [academicYears]);

  useEffect(() => {
    saveStoredData('siswa', siswa);
  }, [siswa]);

  useEffect(() => {
    saveStoredData('student_notes', studentNotes);
  }, [studentNotes]);

  useEffect(() => {
    saveStoredData('subject_grades', subjectGrades);
  }, [subjectGrades]);

  useEffect(() => {
    saveStoredData('activity_records', activityRecords);
  }, [activityRecords]);


  // 3. Mutation Handlers

  // Siswa CRUD
  const handleAddSiswa = (s: Omit<Siswa, 'id'>) => {
    const newSiswa: Siswa = {
      ...s,
      id: 'sis-' + Date.now() + '-' + Math.floor(Math.random() * 100)
    };
    setSiswa(prev => [newSiswa, ...prev]);
  };

  const handleUpdateSiswa = (updated: Siswa) => {
    setSiswa(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteSiswa = (id: string) => {
    setSiswa(prev => prev.filter(s => s.id !== id));
    // Cascade delete associated notes
    setStudentNotes(prev => prev.filter(n => n.siswaId !== id));
  };

  const handleImportSiswaList = (importedList: Omit<Siswa, 'id'>[]) => {
    setSiswa(prev => {
      let currentList = [...prev];
      const batchTimestamp = Date.now();
      importedList.forEach((item, index) => {
        currentList.push({
          ...item,
          id: `sis-imp-${batchTimestamp}-${index}-${Math.floor(Math.random() * 1000)}`
        });
      });
      return currentList;
    });
  };

  // Class CRUD
  const handleAddClass = (c: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...c,
      id: 'cls-' + Date.now()
    };
    setClasses(prev => [...prev, newClass]);
  };

  const handleUpdateClass = (updated: Class) => {
    setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Academic Years CRUD
  const handleAddAcademicYear = (ay: Omit<AcademicYear, 'id'>) => {
    const newAy: AcademicYear = {
      ...ay,
      id: 'ay-' + Date.now()
    };
    setAcademicYears(prev => [...prev, newAy]);
  };

  const handleDeleteAcademicYear = (id: string) => {
    setAcademicYears(prev => prev.filter(ay => ay.id !== id));
  };

  // Student Notes CRUD
  const handleAddNote = (n: Omit<StudentNote, 'id'>) => {
    const newNote: StudentNote = {
      ...n,
      id: 'nt-' + Date.now()
    };
    setStudentNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setStudentNotes(prev => prev.filter(n => n.id !== id));
  };

  // User Accounts CRUD
  const handleAddUser = (u: Omit<User, 'id'>) => {
    const newUser: User = {
      ...u,
      id: 'usr-' + Date.now()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Dashboard Simulation trigger
  const handleTriggerMockData = () => {
    if (siswa.length === 0) return;
    const randomStudent = siswa[Math.floor(Math.random() * siswa.length)];
    const noteTitles = [
      'Menampilkan Kepemimpinan di Upacara',
      'Nilai Sempurna Try Out Matematika',
      'Terlambat Mengumpulkan Tugas Fisika',
      'Membantu Dekorasi Perpustakaan Sekolah',
      'Izin Mengikuti Lomba Catur Nasional'
    ];
    const noteDescs = [
      'Memimpin barisan upacara bendera hari Senin dengan suara lantang dan penuh ketegasan.',
      'Meraih skor sempurna 100/100 pada latihan materi penjumlahan dasar matematika.',
      'Siswa terlambat mengumpulkan tugas prakarya membuat tempat pensil dari bahan bekas selama 2 hari.',
      'Bergotong royong membantu guru merapikan buku gambar di lemari perpustakaan kelas.',
      'Mewakili sekolah dalam lomba mendongeng bahasa Indonesia kategori anak tingkat kecamatan.'
    ];
    const noteTypes: ('prestasi' | 'pelanggaran' | 'kehadiran' | 'catatan')[] = [
      'prestasi',
      'prestasi',
      'pelanggaran',
      'catatan',
      'kehadiran'
    ];

    const randomIndex = Math.floor(Math.random() * noteTitles.length);

    handleAddNote({
      siswaId: randomStudent.id,
      type: noteTypes[randomIndex],
      date: new Date().toISOString().split('T')[0],
      title: noteTitles[randomIndex],
      description: noteDescs[randomIndex],
      reporter: 'Drs. H. Mulyono, M.Pd.'
    });

    alert(`Simulasi: Berhasil menambahkan catatan baru untuk siswa ${randomStudent.name}!`);
  };

  const handleImportUserList = (importedUserList: Omit<User, 'id'>[]) => {
    setUsers(prev => {
      let currentList = [...prev];
      const batchTimestamp = Date.now();
      importedUserList.forEach((item, index) => {
        currentList.push({
          ...item,
          id: `usr-imp-${batchTimestamp}-${index}-${Math.floor(Math.random() * 100)}`
        });
      });
      return currentList;
    });
  };

  // Backup & Restore handlers
  const handleExportBackup = () => {
    const dbState = {
      users,
      classes,
      academicYears,
      siswa,
      studentNotes,
      subjectGrades,
      activityRecords
    };

    const jsonString = JSON.stringify(dbState, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", url);
    dlAnchorElem.setAttribute("download", `Backup_BukuIndukDigital_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonString: string): boolean => {
    try {
      const dbState = JSON.parse(jsonString);
      if (dbState.users) setUsers(dbState.users);
      if (dbState.classes) setClasses(dbState.classes);
      if (dbState.academicYears) setAcademicYears(dbState.academicYears);
      if (dbState.siswa) setSiswa(dbState.siswa);
      if (dbState.studentNotes) setStudentNotes(dbState.studentNotes);
      if (dbState.subjectGrades) setSubjectGrades(dbState.subjectGrades);
      if (dbState.activityRecords) setActivityRecords(dbState.activityRecords);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleResetToDefault = () => {
    setUsers(INITIAL_USERS);
    setClasses(INITIAL_CLASSES);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setSiswa(INITIAL_SISWA);
    setStudentNotes(INITIAL_STUDENT_NOTES);
    setSubjectGrades(INITIAL_SUBJECT_GRADES);
    setActivityRecords(INITIAL_ACTIVITY_RECORDS);
    setActiveTab('dashboard');
  };

  const handleWipeAllData = () => {
    setUsers([INITIAL_USERS[0]]); // Keep default admin so login isn't bricked
    setClasses([]);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setSiswa([]);
    setStudentNotes([]);
    setSubjectGrades([]);
    setActivityRecords([]);
    setActiveTab('dashboard');
  };

  // 4. View Router
  if (!currentUser) {
    return <LoginScreen users={users} onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 antialiased overflow-hidden relative">
      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-pink-600 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab('dashboard');
        }}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Top bar header */}
        <header className="backdrop-blur-md bg-slate-900/40 border-b border-white/10 h-16 flex items-center justify-between px-6 shrink-0 relative z-20 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">Sistem Rujukan:</span>
            <span className="text-xs font-bold text-slate-100 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
              Buku Register Induk Siswa Nasional
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Petugas Terotentikasi:</span>
              <span className="text-xs font-bold text-slate-200">{currentUser.name}</span>
            </div>
            
            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Shield className="h-3.5 w-3.5" />
              Peran: {currentUser.role === 'admin' ? 'Tata Usaha' : 'Pendidik'}
            </div>
          </div>
        </header>

        {/* Content Section scrollable */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              siswa={siswa} 
              classes={classes}
              studentNotes={studentNotes}
              onTriggerMockData={handleTriggerMockData}
            />
          )}

          {activeTab === 'siswa' && (
            <SiswaManager 
              siswa={siswa}
              classes={classes}
              academicYears={academicYears}
              currentUser={currentUser}
              onAddSiswa={handleAddSiswa}
              onUpdateSiswa={handleUpdateSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              subjectGrades={subjectGrades}
              activityRecords={activityRecords}
            />
          )}

          {activeTab === 'kelas' && currentUser.role === 'admin' && (
            <ClassManager 
              classes={classes}
              academicYears={academicYears}
              users={users}
              siswa={siswa}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onAddAcademicYear={handleAddAcademicYear}
              onDeleteAcademicYear={handleDeleteAcademicYear}
            />
          )}

          {activeTab === 'catatan' && (
            <CatatanManager 
              studentNotes={studentNotes}
              siswa={siswa}
              currentUser={currentUser}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'importer' && currentUser.role === 'admin' && (
            <SiswaImporter 
              classes={classes}
              academicYears={academicYears}
              onImportSiswaList={handleImportSiswaList}
              onImportUserList={handleImportUserList}
            />
          )}

          {activeTab === 'petugas' && currentUser.role === 'admin' && (
            <GuruStaffManager 
              users={users}
              classes={classes}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateSheets />
          )}

          {activeTab === 'nilai' && (
            <NilaiManager
              siswa={siswa}
              classes={classes}
              academicYears={academicYears}
              subjectGrades={subjectGrades}
              activityRecords={activityRecords}
              setSubjectGrades={setSubjectGrades}
              setActivityRecords={setActivityRecords}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'backup' && currentUser.role === 'admin' && (
            <BackupRestore 
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onResetToDefault={handleResetToDefault}
              onWipeAllData={handleWipeAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
