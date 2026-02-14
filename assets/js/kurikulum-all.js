import { db } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("kurikulumContainer");

// ==========================
// DATA LEVEL + DESKRIPSI
// ==========================

const programs = {
  N5: {
    durasi: "4 Bulan (16 Minggu)",
    deskripsi: "Level dasar menggunakan Minna no Nihongo I. Fokus hiragana, katakana, grammar dasar, kanji ±100 dan percakapan sehari-hari.",
    modules: [
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
    ]
  },

  N4: {
    durasi: "5–6 Bulan",
    deskripsi: "Menggunakan Minna no Nihongo II. Fokus grammar lanjutan, bentuk kamus, nai, ta, passive dasar dan kanji ±300.",
    modules: [
      "Review N5",
      "Bentuk Kamus",
      "Bentuk Nai",
      "Bentuk Ta",
      "Volitional",
      "Potensial",
      "Passive Dasar",
      "Causative Dasar",
      "Simulasi N4"
    ]
  },

  N3: {
    durasi: "6–8 Bulan",
    deskripsi: "Level intermediate. Fokus struktur kompleks, reading artikel, listening natural speed dan kanji ±650.",
    modules: [
      "Passive Lanjutan",
      "Causative Lanjutan",
      "〜ば",
      "〜ために",
      "Keigo Dasar",
      "Reading Artikel",
      "Simulasi N3"
    ]
  },

  N2: {
    durasi: "8–12 Bulan",
    deskripsi: "Bahasa bisnis dan formal. Fokus artikel berita, keigo, struktur akademik dan kanji ±1000.",
    modules: [
      "Keigo Lanjutan",
      "Bahasa Bisnis",
      "Artikel Berita",
      "Listening Cepat",
      "Simulasi N2"
    ]
  },

  N1: {
    durasi: "12–18 Bulan",
    deskripsi: "Level profesional dan akademik. Fokus artikel ilmiah, diskusi formal, kanji ±2000.",
    modules: [
      "Keigo Profesional",
      "Struktur Akademik Kompleks",
      "Artikel Ilmiah",
      "Diskusi Profesional",
      "Simulasi N1"
    ]
  },

  JFT_A2: {
    durasi: "3–4 Bulan",
    deskripsi: "Fokus komunikasi kerja dan kehidupan di Jepang. Cocok untuk pekerja Tokutei Ginou.",
    modules: [
      "Salam Formal Kerja",
      "Instruksi Kerja",
      "Keselamatan Kerja",
      "Laporan Sederhana",
      "Simulasi JFT A2"
    ]
  }
};

// ==========================
// RENDER CARD
// ==========================

for (const level in programs) {

  const data = programs[level];

  container.innerHTML += `
    <div class="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 class="text-2xl font-bold">${level.replace("_", " ")}</h2>

      <p class="text-sm text-gray-500">
        <strong>Durasi:</strong> ${data.durasi}
      </p>

      <p class="text-gray-600 text-sm">
        ${data.deskripsi}
      </p>

      <button 
        onclick="uploadLevel('${level}')"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Upload Semua Modul ${level}
      </button>

    </div>
  `;
}

// ==========================
// UPLOAD FUNCTION
// ==========================

window.uploadLevel = async (level) => {

  if (!confirm(`Upload semua modul ${level}?`)) return;

  const modules = programs[level].modules;

  for (const namaModule of modules) {
    await addDoc(
      collection(db, "kurikulum", level, "modules"),
      {
        namaModule,
        createdAt: new Date()
      }
    );
  }

  alert(`Modul ${level} berhasil diupload ke database!`);
};
