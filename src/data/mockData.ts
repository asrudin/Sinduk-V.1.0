import { User, Class, AcademicYear, Siswa, StudentNote, SubjectGrade, ActivityRecord } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'usr-1', username: 'admin', name: 'Drs. H. Mulyono, M.Pd.', role: 'admin', nuptk: '197405122002121003', nip: '197405122002121003', gender: 'L' },
  { id: 'usr-2', username: 'guru1', name: 'Siti Rahmawati, S.Pd.', role: 'guru', classId: 'cls-1', nuptk: '4534752654300002', nip: '198211042009032008', gender: 'P' },
  { id: 'usr-3', username: 'guru2', name: 'Bambang Wijaya, S.Si.', role: 'guru', classId: 'cls-2', nuptk: '8435761662100003', nip: '198506152011011012', gender: 'L' },
  { id: 'usr-4', username: 'guru3', name: 'Rina Kartika, S.Pd.', role: 'guru', classId: 'cls-3', nuptk: '1235759661200001', nip: '198902102015042003', gender: 'P' },
  { id: 'usr-5', username: 'guru4', name: 'Drs. Ahmad Junaidi', role: 'guru', classId: 'cls-4', nuptk: '2034747648200002', nip: '197808222006041005', gender: 'L' },
  { id: 'usr-6', username: 'guru5', name: 'Sri Wahyuni, S.Pd.', role: 'guru', classId: 'cls-5', nuptk: '9534763665200004', nip: '198712122014022001', gender: 'P' },
  { id: 'usr-7', username: 'guru6', name: 'Edi Susanto, S.Pd.', role: 'guru', classId: 'cls-6', nuptk: '5734760661100002', nip: '199203182019031004', gender: 'L' },
];

export const INITIAL_CLASSES: Class[] = [
  { id: 'cls-1', name: 'Kelas 1-A', grade: '1', homeroomTeacher: 'Siti Rahmawati, S.Pd.' },
  { id: 'cls-2', name: 'Kelas 2-A', grade: '2', homeroomTeacher: 'Bambang Wijaya, S.Si.' },
  { id: 'cls-3', name: 'Kelas 3-A', grade: '3', homeroomTeacher: 'Rina Kartika, S.Pd.' },
  { id: 'cls-4', name: 'Kelas 4-A', grade: '4', homeroomTeacher: 'Drs. Ahmad Junaidi' },
  { id: 'cls-5', name: 'Kelas 5-A', grade: '5', homeroomTeacher: 'Sri Wahyuni, S.Pd.' },
  { id: 'cls-6', name: 'Kelas 6-A', grade: '6', homeroomTeacher: 'Edi Susanto, S.Pd.' },
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-1', year: '2023/2024', semester: 'ganjil' },
  { id: 'ay-2', year: '2024/2025', semester: 'genap' },
  { id: 'ay-3', year: '2025/2026', semester: 'ganjil' },
];

export const INITIAL_SISWA: Siswa[] = [
  {
    id: 'sis-1',
    nis: '26270101',
    nisn: '3192910482',
    name: 'Andi Wijaya',
    gender: 'L',
    pob: 'Malang',
    dob: '2019-05-14',
    religion: 'Islam',
    address: 'Jl. Danau Toba No. 12, Sawojajar, Malang',
    phone: '081234567891',
    classId: 'cls-1',
    academicYearId: 'ay-3',
    status: 'active',
    enrollmentDate: '2025-07-15',
    previousSchool: 'TK Dharma Wanita Malang',
    fatherName: 'Hendra Wijaya',
    motherName: 'Susanti',
    parentOccupation: 'Wiraswasta',
    parentPhone: '081234567800',
    height: 115,
    weight: 20,
    bloodType: 'O',
    notes: 'Siswa aktif, ceria, sangat gemar menggambar.'
  },
  {
    id: 'sis-2',
    nis: '25260102',
    nisn: '3183940182',
    name: 'Citra Kirana',
    gender: 'P',
    pob: 'Surabaya',
    dob: '2018-08-22',
    religion: 'Islam',
    address: 'Perum Permata Jingga Blok D-4, Malang',
    phone: '085798765432',
    classId: 'cls-2',
    academicYearId: 'ay-3',
    status: 'active',
    enrollmentDate: '2024-07-15',
    previousSchool: 'TK Al-Azhar',
    fatherName: 'Irwan Kirana',
    motherName: 'Lina Marlina',
    parentOccupation: 'Pegawai Negeri Sipil',
    parentPhone: '085798765400',
    height: 122,
    weight: 24,
    bloodType: 'A',
    notes: 'Rajin menabung dan suka membantu merapikan ruang kelas.'
  },
  {
    id: 'sis-3',
    nis: '24250103',
    nisn: '3175849104',
    name: 'Dimas Aditya Saputra',
    gender: 'L',
    pob: 'Batu',
    dob: '2017-03-05',
    religion: 'Kristen',
    address: 'Jl. Diponegoro No. 89, Kota Batu',
    phone: '081388990011',
    classId: 'cls-3',
    academicYearId: 'ay-2',
    status: 'active',
    enrollmentDate: '2023-07-17',
    previousSchool: 'SDN 1 Batu (Pindahan)',
    fatherName: 'Agus Saputra',
    motherName: 'Maria Magdalena',
    parentOccupation: 'Karyawan Swasta',
    parentPhone: '081388990000',
    height: 128,
    weight: 28,
    bloodType: 'B',
    notes: 'Juara bulutangkis junior tingkat RT.'
  },
  {
    id: 'sis-4',
    nis: '23240104',
    nisn: '3161234567',
    name: 'Eka Putri Lestari',
    gender: 'P',
    pob: 'Sidoarjo',
    dob: '2016-11-12',
    religion: 'Islam',
    address: 'Jl. Candi Mendut No. 34, Lowokwaru, Malang',
    phone: '089911223344',
    classId: 'cls-4',
    academicYearId: 'ay-2',
    status: 'active',
    enrollmentDate: '2022-07-17',
    previousSchool: 'TK Pembina Sidoarjo',
    fatherName: 'Rudi Lestari',
    motherName: 'Ratih Purwasih',
    parentOccupation: 'Pedagang',
    parentPhone: '089911223300',
    height: 134,
    weight: 31,
    bloodType: 'AB',
    notes: 'Sangat berminat pada sains dan percobaan sederhana.'
  },
  {
    id: 'sis-5',
    nis: '22230105',
    nisn: '3159810394',
    name: 'Fahri Alamsyah',
    gender: 'L',
    pob: 'Malang',
    dob: '2015-02-18',
    religion: 'Islam',
    address: 'Jl. Kawi No. 10, Klojen, Malang',
    phone: '081122334455',
    classId: 'cls-5',
    academicYearId: 'ay-1',
    status: 'active',
    enrollmentDate: '2021-07-11',
    previousSchool: 'TK ABA 1 Malang',
    fatherName: 'Sudirman Alamsyah',
    motherName: 'Siti Aminah',
    parentOccupation: 'Pensiunan',
    parentPhone: '081122334400',
    height: 140,
    weight: 36,
    bloodType: 'O',
    notes: 'Suka membaca buku ensiklopedia anak.'
  },
  {
    id: 'sis-6',
    nis: '21220106',
    nisn: '3144455667',
    name: 'Gisella Anastasia Rahayu',
    gender: 'P',
    pob: 'Kediri',
    dob: '2014-09-30',
    religion: 'Katolik',
    address: 'Perum Sukarno-Hatta Indah C-15, Malang',
    phone: '081344556677',
    classId: 'cls-6',
    academicYearId: 'ay-2',
    status: 'active',
    enrollmentDate: '2020-07-17',
    previousSchool: 'RA Kartini Kediri',
    fatherName: 'Yosep Rahayu',
    motherName: 'Theresia Sulastri',
    parentOccupation: 'Dokter',
    parentPhone: '081344556600',
    height: 145,
    weight: 40,
    bloodType: 'B',
    notes: 'Memiliki bakat kepemimpinan yang baik di kelompoknya.'
  }
];

export const INITIAL_STUDENT_NOTES: StudentNote[] = [
  {
    id: 'nt-1',
    siswaId: 'sis-1',
    type: 'prestasi',
    date: '2025-05-10',
    title: 'Juara 1 Lomba Robotika Regional',
    description: 'Meraih medali emas dalam kompetisi robot penjelajah halangan tingkat Jawa Timur.',
    reporter: 'Bambang Wijaya, S.Si.'
  },
  {
    id: 'nt-2',
    siswaId: 'sis-3',
    type: 'prestasi',
    date: '2024-11-21',
    title: 'Runner-up Bulutangkis O2SN',
    description: 'Mendapat juara 2 pada Olimpiade Olahraga Siswa Nasional tingkat Kota Malang.',
    reporter: 'Siti Rahmawati, S.Pd.'
  },
  {
    id: 'nt-3',
    siswaId: 'sis-2',
    type: 'catatan',
    date: '2025-02-14',
    title: 'Kepemimpinan Forum OSIS',
    description: 'Menjadi delegasi sekolah dalam workshop kepemimpinan kepengurusan OSIS se-Malang Raya.',
    reporter: 'Drs. H. Mulyono, M.Pd.'
  },
  {
    id: 'nt-4',
    siswaId: 'sis-4',
    type: 'pelanggaran',
    date: '2025-03-01',
    title: 'Terlambat Masuk Sekolah',
    description: 'Terlambat 20 menit tanpa keterangan logis sebanyak 3 kali berturut-turut. Sudah diberi pembinaan.',
    reporter: 'Siti Rahmawati, S.Pd.'
  },
  {
    id: 'nt-5',
    siswaId: 'sis-1',
    type: 'kehadiran',
    date: '2025-04-18',
    title: 'Izin Sakit',
    description: 'Izin tidak masuk sekolah selama 2 hari karena sakit demam berdarah (dilengkapi surat dokter).',
    reporter: 'Siti Rahmawati, S.Pd.'
  }
];

export function loadStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`buku_induk_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading stored data for key: ' + key, error);
    return defaultValue;
  }
}

export function saveStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`buku_induk_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving stored data for key: ' + key, error);
  }
}

export const INITIAL_SUBJECT_GRADES: SubjectGrade[] = [
  {
    id: 'grd-1',
    siswaId: 'sis-1',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    subjectName: 'Matematika',
    score: 88,
    grade: 'A',
    description: 'Sangat baik dalam memahami materi penjumlahan dan perkalian pecahan dasar.'
  },
  {
    id: 'grd-2',
    siswaId: 'sis-1',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    subjectName: 'Bahasa Indonesia',
    score: 92,
    grade: 'A',
    description: 'Sangat terampil dalam menyusun paragraf deskriptif dan membaca dongeng anak.'
  },
  {
    id: 'grd-3',
    siswaId: 'sis-2',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    subjectName: 'Matematika',
    score: 75,
    grade: 'C',
    description: 'Cukup memahami pembagian bersusun, namun memerlukan latihan lebih lanjut.'
  },
  {
    id: 'grd-4',
    siswaId: 'sis-2',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    subjectName: 'Pendidikan Pancasila',
    score: 85,
    grade: 'B',
    description: 'Sangat baik dalam mengidentifikasi simbol-simbol sila Pancasila dalam kehidupan sehari-hari.'
  }
];

export const INITIAL_ACTIVITY_RECORDS: ActivityRecord[] = [
  {
    id: 'act-1',
    siswaId: 'sis-1',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    type: 'ekstrakurikuler',
    activityName: 'Pramuka Penggalang',
    predicate: 'Sangat Baik',
    description: 'Sangat aktif dalam kegiatan perkemahan sabtu-minggu dan mahir membaca sandi morse dasar.'
  },
  {
    id: 'act-2',
    siswaId: 'sis-1',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    type: 'kokurikuler',
    activityName: 'Projek Penguatan Profil Pelajar Pancasila (P5)',
    predicate: 'Baik',
    description: 'Berpartisipasi aktif dalam aksi pengumpulan sampah plastik untuk dijadikan kerajinan tempat pensil.'
  },
  {
    id: 'act-3',
    siswaId: 'sis-2',
    academicYearId: 'ay-3',
    semester: 'ganjil',
    type: 'ekstrakurikuler',
    activityName: 'Dokter Kecil (UKS)',
    predicate: 'Baik',
    description: 'Menunjukkan tanggung jawab yang baik dalam membantu penanganan siswa pingsan saat upacara.'
  }
];

