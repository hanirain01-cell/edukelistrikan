/*
  Konfigurasi koneksi Supabase.
  Ambil dari Supabase Dashboard → Project Settings → API (atau Data API):
    - Project URL      → SUPABASE_URL
    - anon public key  → SUPABASE_ANON_KEY
  Anon key memang boleh berada di sisi browser; keamanan data dijaga oleh
  Row Level Security di supabase/schema.sql. JANGAN pernah menaruh
  service_role key di file ini.
*/
window.EDU_CONFIG = {
  SUPABASE_URL: "ISI_URL_PROYEK_SUPABASE",          // contoh: https://abcdefghijk.supabase.co
  SUPABASE_ANON_KEY: "ISI_ANON_PUBLIC_KEY",         // contoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  // Domain email semu untuk akun siswa (NIS → nis-12345@domain). Tidak perlu diubah.
  STUDENT_EMAIL_DOMAIN: "siswa.edukelistrikan.id"
};
