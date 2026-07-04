export type Role = 'admin' | 'guru';

export type ActiveTab = 
  | 'dashboard'
  | 'siswa'
  | 'kelas'
  | 'catatan'
  | 'importer'
  | 'petugas'
  | 'backup'
  | 'templates'
  | 'nilai';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  classId?: string; // If guru, they can be assigned as Wali Kelas for a class
  nuptk?: string; // Nomor Unik Pendidik dan Tenaga Kependidikan (Dapodik)
  nip?: string; // Nomor Induk Pegawai (Dapodik)
  gender?: 'L' | 'P'; // Jenis Kelamin
}

export interface Class {
  id: string;
  name: string; // e.g. "Kelas X-A", "Kelas XI-MIPA 1"
  grade: string; // e.g. "10", "11", "12" or "1", "2"
  homeroomTeacher: string; // Wali Kelas name
}

export interface AcademicYear {
  id: string;
  year: string; // e.g. "2024/2025"
  semester: 'ganjil' | 'genap';
}

export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'dropped_out';

export interface Siswa {
  id: string;
  nis: string; // Nomor Induk Siswa
  nisn: string; // Nomor Induk Siswa Nasional
  name: string;
  gender: 'L' | 'P'; // Laki-laki / Perempuan
  pob: string; // Tempat Lahir
  dob: string; // Tanggal Lahir (YYYY-MM-DD)
  religion: string; // Agama
  address: string;
  phone: string;
  classId: string; // Linked to Class
  academicYearId: string; // Year of entry
  status: StudentStatus;
  enrollmentDate: string; // Tanggal Masuk
  previousSchool: string; // Asal Sekolah

  // Parent / Guardian Info
  fatherName: string;
  motherName: string;
  parentOccupation: string;
  parentPhone: string;
  guardianName?: string;
  
  // Physical / Health Info
  height?: number; // cm
  weight?: number; // kg
  bloodType?: string;
  
  notes?: string;
}

export type NoteType = 'prestasi' | 'pelanggaran' | 'kehadiran' | 'catatan';

export interface StudentNote {
  id: string;
  siswaId: string;
  type: NoteType;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  reporter: string; // Teacher or Staff name
}

export interface SubjectGrade {
  id: string;
  siswaId: string;
  academicYearId: string;
  semester: 'ganjil' | 'genap';
  subjectName: string; // e.g. "Matematika", "Bahasa Indonesia", etc.
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'E'; // Predikat
  description: string; // Deskripsi perkembangan nilai kognitif
}

export type ActivityType = 'ekstrakurikuler' | 'kokurikuler';

export interface ActivityRecord {
  id: string;
  siswaId: string;
  academicYearId: string;
  semester: 'ganjil' | 'genap';
  type: ActivityType;
  activityName: string; // e.g. "Pramuka", "P5 - Projek Profil Pelajar Pancasila"
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  description: string; // Deskripsi pencapaian atau keikutsertaan
}
