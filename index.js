// index.js
// Tugas Kecil 1 — Student API
// Web Advanced Development
//
// Instruksi:
//   1. Baca setiap komentar TODO dengan seksama.
//   2. Ganti baris "// TODO: ..." dengan kode yang benar.
//   3. Jangan ubah nama variabel, nama endpoint, atau struktur yang sudah ada.
//   4. Test setiap endpoint di Postman sebelum submit.
//
// Run: node index.js  →  http://localhost:3000

// Sebelum itu, tuliskan nama, NIM, di bawah ini, dan apabila sudah selesai, isi refleksi di bawah ini (dalam bentuk comment)
// Nama: Nabila Zhahra Nursyamsi
// NIM: 24110400002
// Refleksi:
// Tugas ini ngebantu untuk mengerti cara kerja RESTful API secara langsung.
// Saya jadi paham kenapa urutan route itu penting, terutama kasus /search vs /:id.
// Implementasi CRUD dengan array in-memory juga bikin aku lebih paham
// sebelum nanti beneran pakai database.
// Yang paling tricky itu bagian PUT, harus hati-hati biar field yang
// tidak dikirim tidak ikut ke-overwrite jadi undefined.

const express = require("express");
const app = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());


// ── In-memory "database" ─────────────────────────────────────
// Data awal — jangan diubah, dipakai untuk pengujian
let students = [
  { id: 1, name: "Andi Saputra",    nim: "231001", major: "Informatika",          gpa: 3.75 },
  { id: 2, name: "Bella Kurnia",    nim: "231002", major: "Sistem Informasi",      gpa: 3.50 },
  { id: 3, name: "Candra Wijaya",   nim: "231003", major: "Informatika",          gpa: 3.20 },
];

// nextId dipakai untuk generate id otomatis saat POST
let nextId = 4;

app.get("/students/search", (req, res) => {
  const { major } = req.query;
 
  const result = major
    ? students.filter((s) => s.major.toLowerCase() === major.toLowerCase())
    : students;
 
  res.status(200).json(result);
});
 

// ════════════════════════════════════════════════════════════
//  ENDPOINT 1 — GET /students
//  Kembalikan semua data mahasiswa dalam bentuk array JSON
// ════════════════════════════════════════════════════════════
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 2 — GET /students/:id
//  Kembalikan satu mahasiswa berdasarkan id
//  Jika tidak ditemukan → status 404 + { error: "Student tidak ditemukan" }
// ════════════════════════════════════════════════════════════
app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
 
  const student = students.find((s) => s.id === id);
 
  if (!student) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }
 
  res.status(200).json(student);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 3 — POST /students
//  Tambahkan mahasiswa baru dari request body
//  Body yang dikirim: { name, nim, major, gpa }
//  Validasi: name, nim, major wajib ada — kalau tidak → 400
//  Sukses → status 201 + data mahasiswa baru
// ════════════════════════════════════════════════════════════
app.post("/students", (req, res) => {
  const { name, nim, major, gpa } = req.body;
 
  if (!name || !nim || !major) {
    return res.status(400).json({ error: "name, nim, dan major wajib diisi" });
  }
 
  const newStudent = { id: nextId, name, nim, major, gpa: gpa ?? 0 };
  nextId++;
 
  students.push(newStudent);
 
  res.status(201).json(newStudent);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 4 — PUT /students/:id
//  Update data mahasiswa berdasarkan id
//  Field yang bisa diupdate: name, nim, major, gpa (semua opsional)
//  Minimal satu field harus dikirim → kalau tidak ada → 400
//  Jika id tidak ditemukan → 404
// ════════════════════════════════════════════════════════════
app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, nim, major, gpa } = req.body;
 
  if (
    name === undefined &&
    nim === undefined &&
    major === undefined &&
    gpa === undefined
  ) {
    return res.status(400).json({ error: "Minimal satu field harus dikirim" });
  }
 
  const index = students.findIndex((s) => s.id === id);
 
  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }
 
  if (name !== undefined)  students[index].name  = name;
  if (nim !== undefined)   students[index].nim   = nim;
  if (major !== undefined) students[index].major = major;
  if (gpa !== undefined)   students[index].gpa   = gpa;
 
  res.status(200).json(students[index]);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 5 — DELETE /students/:id
//  Hapus mahasiswa berdasarkan id
//  Jika tidak ditemukan → 404
//  Sukses → status 204 (no content)
// ════════════════════════════════════════════════════════════
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
 
  const index = students.findIndex((s) => s.id === id);
 
  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }
 
  students.splice(index, 1);
 
  res.status(204).send();
});

// ════════════════════════════════════════════════════════════
//  BONUS — GET /students/search?major=...
//  Filter mahasiswa berdasarkan query param major
//  Contoh: GET /students/search?major=Informatika
//  Jika tidak ada yang cocok → kembalikan array kosong []
//
//  ⚠️  Endpoint ini HARUS didefinisikan SEBELUM /students/:id
//      karena Express membaca route dari atas ke bawah —
//      "search" akan ditangkap sebagai :id kalau urutannya salah!
//
//  Petunjuk: gunakan req.query.major dan .filter()
// ════════════════════════════════════════════════════════════
// TODO: implementasikan endpoint GET /students/search di sini
//       (pindahkan ke ATAS endpoint GET /students/:id setelah selesai)


// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET    /students`);
  console.log(`  GET    /students/:id`);
  console.log(`  POST   /students`);
  console.log(`  PUT    /students/:id`);
  console.log(`  DELETE /students/:id`);
  console.log(`  GET    /students/search?major=... (bonus)`);
});
