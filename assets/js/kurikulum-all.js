import { db } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("kurikulumContainer");

// =======================
// TEMPLATE SEMUA LEVEL
// =======================

const templates = {

  N5: [
    "Hiragana",
    "Katakana",
    "Salam & Perkenalan",
    "Partikel Dasar",
    "Kata Kerja Masu",
    "Kata Sifat",
    "Angka & Waktu",
    "Lokasi に・で",
    "あります・います",
    "Bentuk Te",
    "〜たい",
    "Review & Simulasi N5"
  ],

  N4: [
    "Review N5",
    "Bentuk Kamus",
    "Bentuk Nai",
    "Bentuk Ta",
    "Volitional",
    "Potensial",
    "〜ながら",
    "Passive Dasar",
    "Causative Dasar",
    "Kondisional たら",
    "Reading N4",
    "Simulasi N4"
  ],

  N3: [
    "Review N4",
    "Passive Lanjutan",
    "Causative Lanjutan",
    "〜ば",
    "〜ために",
    "〜ように",
    "Nominalisasi",
    "Keigo Dasar",
    "Reading Artikel",
    "Listening Natural",
    "Simulasi N3"
  ],

  N2: [
    "Keigo Lanjutan",
    "Struktur Akademik",
    "Bahasa Bisnis",
    "Konjungsi Kompleks",
    "Artikel Berita",
    "Listening Cepat",
    "Simulasi N2"
  ],

  N1: [
    "Keigo Profesional",
    "Struktur Akademik Kompleks",
    "Ekspresi Idiomatik",
    "Artikel Ilmiah",
    "Diskusi Profesional",
    "Simulasi N1"
  ],

  JFT_A2: [
    "Salam Formal Kerja",
    "Instruksi Kerja",
    "Keselamatan Kerja",
    "Laporan Sederhana",
    "Percakapan Tempat Kerja",
    "Kehidupan Sehari-hari",
    "Simulasi JFT A2"
  ],

  KAIWA: [
    "Kaiwa Beginner",
    "Kaiwa Intermediate",
    "Role Play",
    "Presentasi",
    "Interview Kerja",
    "Business Meeting"
  ],

  DOKKAI: [
    "Reading Dasar",
    "Artikel Berita",
    "Email Bisnis",
    "Essay Pendek",
    "Latihan Soal JLPT"
  ],

  KANJI: [
    "Kanji Basic 100",
    "Kanji Intermediate 300",
    "Kanji N3 650",
    "Kanji N2 1000",
    "Kanji N1 2000"
  ]

};

// =======================
// RENDER CARD LEVEL
// =======================

for (const level in templates) {

  container.innerHTML += `
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="text-xl font-semibold mb-4">${level.replace("_", " ")}</h2>

      <button 
        onclick="uploadLevel('${level}')"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Upload Modul ${level}
      </button>
    </div>
  `;
}

// =======================
// UPLOAD FUNCTION
// =======================

window.uploadLevel = async (level) => {

  if (!confirm(`Upload semua modul ${level}?`)) return;

  const modules = templates[level];

  for (const namaModule of modules) {

    await addDoc(
      collection(db, "kurikulum", level, "modules"),
      {
        namaModule,
        createdAt: new Date()
      }
    );
  }

  alert(`Modul ${level} berhasil diupload!`);
};
