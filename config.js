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
  SUPABASE_URL: "https://lngtitqyrfwjxtcaiyyf.supabase.co",          // contoh: https://abcdefghijk.supabase.co
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZ3RpdHF5cmZ3anh0Y2FpeXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwOTQwODQsImV4cCI6MjEwNzY3MDA4NH0.2qElMhuJKrqNZ0Boyi9kB1V31Eb6A0c0V7B4_kuju-k",         // contoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  // Domain email semu untuk akun siswa (NIS → nis-12345@domain). Tidak perlu diubah.
  STUDENT_EMAIL_DOMAIN: "siswa.edukelistrikan.id"
};
