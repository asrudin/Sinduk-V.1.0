import React, { useState } from 'react';
import { Siswa, Class, AcademicYear, StudentStatus, User } from '../types';
import { Upload, AlertCircle, CheckCircle, Table, Sparkles, Database, Users } from 'lucide-react';

interface SiswaImporterProps {
  classes: Class[];
  academicYears: AcademicYear[];
  onImportSiswaList: (importedList: Omit<Siswa, 'id'>[]) => void;
  onImportUserList?: (importedList: Omit<User, 'id'>[]) => void;
}

export default function SiswaImporter({
  classes,
  academicYears,
  onImportSiswaList,
  onImportUserList
}: SiswaImporterProps) {
  const [importType, setImportType] = useState<'siswa' | 'guru'>('siswa');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [parsedStudents, setParsedStudents] = useState<Omit<Siswa, 'id'>[]>([]);
  const [parsedUsers, setParsedUsers] = useState<Omit<User, 'id'>[]>([]);

  // Sample Dapodik SD TSV for Students
  const SAMPLE_SISWA_DAPODIK = [
    'nis\tnisn\tnama\tjk\ttempat_lahir\ttanggal_lahir\tagama\talamat\tnama_ayah\tnama_ibu\tpekerjaan\tno_hp_ortu',
    '26270110\t0192834551\tMuhammad Rezky\tL\tMalang\t2019-02-10\tIslam\tJl. Ijen No. 15, Malang\tRahmat Hidayat\tKartika\tSwasta\t08123450099',
    '25260111\t0182947112\tNabila Putri\tP\tSurabaya\t2018-07-15\tIslam\tPerum Griya Shanta K-12, Malang\tBudi Santoso\tYulianti\tPNS\t08139882211',
    '24250112\t0173841103\tKevin Wijaya\tL\tBatu\t2017-09-22\tKristen\tJl. Oro-Oro Ombo No. 5, Batu\tTommy Wijaya\tSari\tWiraswasta\t08571234567',
    '23240113\t0164819204\tSiti Aisyah\tP\tMalang\t2016-04-18\tIslam\tJl. Borobudur No. 45, Malang\tYusuf Amin\tKhadijah\tGuru\t08998877665',
    '22230114\t0155829105\tRehan Pratama\tL\tSidoarjo\t2015-11-05\tIslam\tJl. Kembang Sore No. 9, Malang\tEdi Pratama\tLina\tBuruh\t08122334455',
    '21220115\t0149201934\tGadis Amanda\tP\tKediri\t2014-01-20\tIslam\tJl. Semeru Raya G-3, Malang\tHartono\tEndang\tSwasta\t08564455660'
  ].join('\n');

  // Sample Dapodik SD TSV for Teachers
  const SAMPLE_GURU_DAPODIK = [
    'username\tnama\trole\tnuptk\tnip\tjk\tkelas_id',
    'dewi_wali\tDewi Lestari, S.Pd.\tguru\t3548761663200002\t198805202014032005\tP\tcls-1',
    'heru_wali\tDrs. Heru Prasetyo\tguru\t2034747648200022\t197509142003121002\tL\tcls-2',
    'linda_guru\tLinda Rahayu, S.Pd.\tguru\t9034762664200001\t\tP\tcls-3',
    'anwar_staf\tAnwar Sadat, S.Sos.\tadmin\t1234567890123456\t\tL\t'
  ].join('\n');

  // Parse TSV/CSV text
  const handleParseData = () => {
    setError('');
    setSuccess('');
    setParsedStudents([]);
    setParsedUsers([]);

    if (!inputText.trim()) {
      setError('Silakan tempel baris data terlebih dahulu!');
      return;
    }

    try {
      const lines = inputText.trim().split('\n');
      if (lines.length < 2) {
        setError('Data minimal harus berisi baris header dan minimal satu baris data.');
        return;
      }

      // Read header row
      const headerLine = lines[0].toLowerCase();
      const delimiter = headerLine.includes('\t') ? '\t' : ',';
      const headers = headerLine.split(delimiter).map(h => h.trim().replace(/["']/g, ''));

      if (importType === 'siswa') {
        const results: Omit<Siswa, 'id'>[] = [];
        const defaultClassId = classes[0]?.id || '';
        const defaultAyId = academicYears[0]?.id || '';

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const columns = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
          const rowObj: any = {};
          
          headers.forEach((header, index) => {
            rowObj[header] = columns[index] || '';
          });

          // Map column variations
          const nis = rowObj['nis'] || String(Date.now()).slice(-8);
          const nisn = rowObj['nisn'] || '00' + String(Math.floor(10000000 + Math.random() * 90000000));
          const name = rowObj['nama'] || rowObj['nama_lengkap'] || rowObj['name'] || '';
          const gender = (rowObj['gender'] || rowObj['jk'] || rowObj['jenis_kelamin'] || 'L').toUpperCase().startsWith('L') ? 'L' : 'P';
          const pob = rowObj['tempat_lahir'] || rowObj['pob'] || 'Malang';
          const dob = rowObj['tanggal_lahir'] || rowObj['dob'] || '2018-01-01';
          const religion = rowObj['agama'] || 'Islam';
          const address = rowObj['alamat'] || 'Alamat Sekolah';
          const phone = rowObj['no_telepon'] || rowObj['telepon'] || rowObj['phone'] || '';
          
          const fatherName = rowObj['nama_ayah'] || rowObj['ayah'] || 'Bapak';
          const motherName = rowObj['nama_ibu'] || rowObj['ibu'] || 'Ibu';
          const parentOccupation = rowObj['pekerjaan_orang_tua'] || rowObj['pekerjaan'] || 'Karyawan';
          const parentPhone = rowObj['telepon_orang_tua'] || rowObj['no_hp_ortu'] || '';
          const guardianName = rowObj['wali'] || rowObj['nama_wali'] || undefined;

          const height = rowObj['tinggi'] || rowObj['tinggi_badan'] ? Number(rowObj['tinggi'] || rowObj['tinggi_badan']) : undefined;
          const weight = rowObj['berat'] || rowObj['berat_badan'] ? Number(rowObj['berat'] || rowObj['berat_badan']) : undefined;
          const bloodType = rowObj['gol_darah'] || rowObj['golongan_darah'] || 'O';
          const notes = rowObj['catatan'] || rowObj['notes'] || undefined;
          const previousSchool = rowObj['asal_sekolah'] || rowObj['sekolah_asal'] || '-';
          const status = (rowObj['status'] || 'active') as StudentStatus;

          if (!name) {
            throw new Error(`Nama Siswa tidak boleh kosong pada baris data ke-${i}`);
          }

          results.push({
            nis,
            nisn,
            name,
            gender,
            pob,
            dob,
            religion,
            address,
            phone,
            classId: defaultClassId,
            academicYearId: defaultAyId,
            status,
            enrollmentDate: new Date().toISOString().split('T')[0],
            previousSchool,
            fatherName,
            motherName,
            parentOccupation,
            parentPhone,
            guardianName,
            height,
            weight,
            bloodType,
            notes
          });
        }

        setParsedStudents(results);
        setSuccess(`Berhasil memverifikasi ${results.length} data siswa Dapodik! Klik 'Selesaikan Impor Kesiswaan' untuk menyimpan.`);
      } else {
        // Teacher / Guru Import
        const results: Omit<User, 'id'>[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const columns = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
          const rowObj: any = {};
          
          headers.forEach((header, index) => {
            rowObj[header] = columns[index] || '';
          });

          const name = rowObj['nama'] || rowObj['nama_lengkap'] || rowObj['name'] || '';
          const username = rowObj['username'] || rowObj['nama_pengguna'] || (name ? name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) : '');
          const role = (rowObj['role'] || rowObj['peran'] || 'guru').toLowerCase() === 'admin' ? 'admin' : 'guru';
          const nuptk = rowObj['nuptk'] || undefined;
          const nip = rowObj['nip'] || undefined;
          const gender = (rowObj['jk'] || rowObj['gender'] || rowObj['jenis_kelamin'] || 'L').toUpperCase().startsWith('L') ? 'L' : 'P';
          const classId = rowObj['kelas_id'] || rowObj['class_id'] || undefined;

          if (!name) {
            throw new Error(`Nama Guru tidak boleh kosong pada baris data ke-${i}`);
          }

          results.push({
            username,
            name,
            role,
            nuptk,
            nip,
            gender,
            classId: classId || undefined
          });
        }

        setParsedUsers(results);
        setSuccess(`Berhasil memverifikasi ${results.length} data pendidik/guru Dapodik! Klik 'Selesaikan Impor Pendidik' untuk menyimpan.`);
      }
    } catch (err: any) {
      setError('Kesalahan parsing berkas Dapodik: ' + err.message);
    }
  };

  const handleCommitImport = () => {
    if (importType === 'siswa') {
      if (parsedStudents.length === 0) return;
      onImportSiswaList(parsedStudents);
      setSuccess(`Database Buku Induk sukses menyimpan ${parsedStudents.length} siswa baru dari Dapodik!`);
      setParsedStudents([]);
    } else {
      if (parsedUsers.length === 0 || !onImportUserList) return;
      onImportUserList(parsedUsers);
      setSuccess(`Database Buku Induk sukses menyimpan ${parsedUsers.length} pendidik baru dari Dapodik!`);
      setParsedUsers([]);
    }
    setInputText('');
  };

  return (
    <div className="space-y-6 z-10 relative select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Impor Massal Data Dapodik</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Asimilasi cepat kependudukan siswa serta pendidik langsung dari format ekspor Dapodik Indonesia</p>
      </div>

      {/* Pill Switcher */}
      <div className="flex border-b border-white/10 p-1 bg-slate-900/60 rounded-xl max-w-sm">
        <button
          onClick={() => {
            setImportType('siswa');
            setInputText('');
            setError('');
            setSuccess('');
            setParsedStudents([]);
            setParsedUsers([]);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            importType === 'siswa' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Table className="h-3.5 w-3.5" />
          Siswa (Peserta Didik)
        </button>
        <button
          onClick={() => {
            setImportType('guru');
            setInputText('');
            setError('');
            setSuccess('');
            setParsedStudents([]);
            setParsedUsers([]);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            importType === 'guru' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Guru (Pendidik & Staf)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Panel (2-span) */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 space-y-4 border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-indigo-400" />
                Tempel Data Ekspor Dapodik ({importType === 'siswa' ? 'Peserta Didik' : 'Pendidik'})
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Salin baris Excel/Sheets Anda (termasuk baris header), kemudian tempel di bawah ini.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setInputText(importType === 'siswa' ? SAMPLE_SISWA_DAPODIK : SAMPLE_GURU_DAPODIK);
                setError('');
                setSuccess('Contoh data Dapodik dimuat! Klik tombol verifikasi di bawah.');
              }}
              className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              Gunakan Contoh Dapodik SD
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              id="importer-text-area"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                importType === 'siswa'
                  ? "nis\tnisn\tnama\tjk\ttempat_lahir\ttanggal_lahir\tagama\talamat\tnama_ayah\tnama_ibu\tpekerjaan\tno_hp_ortu"
                  : "username\tnama\trole\tnuptk\tnip\tjk\tkelas_id"
              }
              rows={8}
              className="w-full text-xs font-mono bg-slate-950/60 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-slate-300"
            />

            {error && (
              <div className="p-3.5 rounded-xl text-xs bg-rose-500/15 text-rose-300 border border-rose-500/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{success}</span>
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              {((importType === 'siswa' && parsedStudents.length > 0) || (importType === 'guru' && parsedUsers.length > 0)) && (
                <button
                  id="btn-commit-import"
                  type="button"
                  onClick={handleCommitImport}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 animate-pulse"
                >
                  <Database className="h-4 w-4" />
                  {importType === 'siswa' ? 'Selesaikan Impor Kesiswaan' : 'Selesaikan Impor Pendidik'}
                </button>
              )}

              <button
                id="btn-parse-trigger"
                type="button"
                onClick={handleParseData}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Verifikasi & Preview Baris
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Card */}
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-white/10 text-xs">
          <div>
            <h3 className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Skema Kolom Dapodik
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Sistem memetakan kolom-kolom ekspor berikut:</p>
          </div>

          {importType === 'siswa' ? (
            <div className="space-y-3 font-mono text-[10px] text-slate-300">
              <div>
                <span className="text-indigo-400 font-bold block">1. Identitas Dasar</span>
                nis, nisn, nama (atau nama_lengkap), jk (gender), tempat_lahir, tanggal_lahir, agama, alamat
              </div>
              <div>
                <span className="text-indigo-400 font-bold block">2. Orang Tua / Wali</span>
                nama_ayah, nama_ibu, pekerjaan (pekerjaan_orang_tua), no_hp_ortu (telepon_orang_tua)
              </div>
              <div className="border-t border-white/5 pt-2 text-[10px] text-slate-500 leading-normal">
                * Siswa yang diimpor otomatis masuk sebagai Kelas 1-A (Kelas Teratas) dan status Aktif. Anda dapat memindahkan rombel mereka kemudian.
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-[10px] text-slate-300">
              <div>
                <span className="text-indigo-400 font-bold block">1. Akun & Profil</span>
                username (opsional), nama (nama lengkap), jk (L/P), role (guru / admin)
              </div>
              <div>
                <span className="text-indigo-400 font-bold block">2. Kredensial Dapodik</span>
                nuptk, nip
              </div>
              <div>
                <span className="text-indigo-400 font-bold block">3. Penugasan</span>
                kelas_id (ID Kelas tujuan pendampingan kesiswaan, contoh: <code className="text-white">cls-1</code>, <code className="text-white">cls-2</code>)
              </div>
              <div className="border-t border-white/5 pt-2 text-[10px] text-slate-500 leading-normal">
                * Wali Kelas akan secara otomatis memiliki fungsionalitas untuk mencatat nilai kesiswaan, prestasi, dan ketidakhadiran di rombelnya.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parse Preview Grid Table for Students */}
      {importType === 'siswa' && parsedStudents.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
            <Table className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Preview Hasil Verifikasi Siswa ({parsedStudents.length} baris)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/40 border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Nama Lengkap</th>
                  <th className="py-2.5 px-4">NIS / NISN</th>
                  <th className="py-2.5 px-4 text-center">Gender</th>
                  <th className="py-2.5 px-4">Lahir</th>
                  <th className="py-2.5 px-4">Nama Ayah / Ibu</th>
                  <th className="py-2.5 px-4">Alamat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {parsedStudents.map((ps, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-2.5 px-4 font-bold text-white">{ps.name}</td>
                    <td className="py-2.5 px-4 font-mono">{ps.nis} / {ps.nisn}</td>
                    <td className="py-2.5 px-4 text-center">{ps.gender}</td>
                    <td className="py-2.5 px-4">{ps.pob}, {ps.dob}</td>
                    <td className="py-2.5 px-4">{ps.fatherName} / {ps.motherName}</td>
                    <td className="py-2.5 px-4 truncate max-w-[120px]">{ps.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Parse Preview Grid Table for Teachers */}
      {importType === 'guru' && parsedUsers.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Preview Hasil Verifikasi Guru ({parsedUsers.length} baris)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950/40 border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Nama Lengkap</th>
                  <th className="py-2.5 px-4">Username</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">NUPTK</th>
                  <th className="py-2.5 px-4">NIP</th>
                  <th className="py-2.5 px-4 text-center">Gender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {parsedUsers.map((pu, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-2.5 px-4 font-bold text-white">{pu.name}</td>
                    <td className="py-2.5 px-4 font-mono text-indigo-300">@{pu.username}</td>
                    <td className="py-2.5 px-4 uppercase text-[10px] font-extrabold">{pu.role === 'admin' ? 'Tata Usaha' : 'Guru'}</td>
                    <td className="py-2.5 px-4 font-mono">{pu.nuptk || '-'}</td>
                    <td className="py-2.5 px-4 font-mono">{pu.nip || '-'}</td>
                    <td className="py-2.5 px-4 text-center">{pu.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
