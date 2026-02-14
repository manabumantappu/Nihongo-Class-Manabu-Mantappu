import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ==========================
// ELEMENT
// ==========================
const moduleList = document.getElementById("moduleList");
const uploadTemplateBtn = document.getElementById("uploadTemplateBtn");

// ==========================
// TEMPLATE N5 (24 MODULE)
// ==========================
const templateN5 = [
  { namaModule: "Hiragana", deskripsi: "46 huruf dasar hiragana + dakuten", target: "Bisa membaca & menulis hiragana" },
  { namaModule: "Katakana", deskripsi: "46 huruf katakana + kombinasi", target: "Bisa membaca kata serapan" },
  { namaModule: "Perkenalan Diri", deskripsi: "Aisatsu & jikoshoukai", target: "Bisa memperkenalkan diri" },
  { namaModule: "Angka & Waktu", deskripsi: "Bilangan, jam, hari", target: "Bisa membaca angka dan waktu" },
  { namaModule: "Partikel は・が・を", deskripsi: "Penggunaan dasar partikel", target: "Menyusun kalimat sederhana" },
  { namaModule: "Kata Kerja Bentuk Masu", deskripsi: "Present positif & negatif", target: "Bisa menyatakan aktivitas" },
  { namaModule: "Kata Sifat い & な", deskripsi: "Deskripsi benda & orang", target: "Bisa membuat kalimat deskriptif" },
  { namaModule: "Demonstratif これ/それ/あれ", deskripsi: "Menunjuk benda", target: "Bisa menunjuk objek dengan benar" },
  { namaModule: "Kepemilikan の", deskripsi: "Struktur kepemilikan", target: "Menyatakan kepunyaan" },
  { namaModule: "Lokasi に・で", deskripsi: "Tempat & aktivitas", target: "Menyatakan lokasi kegiatan" },
  { namaModule: "Ada/Tidak Ada あります・います", deskripsi: "Benda & makhluk hidup", target: "Menyatakan keberadaan" },
  { namaModule: "Kalimat Lampau", deskripsi: "Bentuk past tense", target: "Menyatakan kejadian masa lalu" },
  { namaModule: "Ajakan & Permintaan", deskripsi: "〜ましょう, 〜てください", target: "Membuat ajakan & permintaan" },
  { namaModule: "Bentuk Te", deskripsi: "Penggabungan kalimat", target: "Menghubungkan aktivitas" },
  { namaModule: "Kata Kerja Potensial", deskripsi: "Bisa melakukan sesuatu", target: "Menyatakan kemampuan" },
  { namaModule: "Larangan & Keharusan", deskripsi: "〜てはいけません", target: "Menyatakan aturan" },
  { namaModule: "Frekuensi", deskripsi: "Sering, kadang, jarang", target: "Menyatakan kebiasaan" },
  { namaModule: "Transportasi & Arah", deskripsi: "Pergi & arah", target: "Menjelaskan perjalanan" },
  { namaModule: "Belanja & Harga", deskripsi: "Ekspresi transaksi", target: "Berbelanja dalam bahasa Jepang" },
  { namaModule: "Keluarga & Profesi", deskripsi: "Kosakata keluarga & pekerjaan", target: "Menyebutkan anggota keluarga" },
  { namaModule: "Hobi & Kegiatan", deskripsi: "Aktivitas sehari-hari", target: "Menyatakan hobi" },
  { namaModule: "Cuaca & Musim", deskripsi: "Ekspresi cuaca", target: "Mendeskripsikan cuaca" },
  { namaModule: "Review Grammar N5", deskripsi: "Latihan keseluruhan", target: "Siap simulasi ujian" },
  { namaModule: "Simulasi Ujian N5", deskripsi: "Latihan soal lengkap", target: "Siap mengikuti JLPT N5" }
];

// ==========================
// LOAD MODULE
// ==========================
async function loadModules() {
  moduleList.innerHTML = "";

  const q = query(
    collection(db, "kurikulum", "N5", "modules"),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((d) => {
    const data = d.data();

    moduleList.innerHTML += `
      <div class="bg-white p-5 rounded shadow">
        <h3 class="text-lg font-bold">${data.namaModule}</h3>
        <p class="text-sm text-gray-600 mt-2">${data.deskripsi}</p>
        <p class="text-xs text-gray-400 mt-2">Target: ${data.target}</p>
      </div>
    `;
  });
}

loadModules();

// ==========================
// UPLOAD TEMPLATE N5
// ==========================
uploadTemplateBtn.addEventListener("click", async () => {

  if (!confirm("Upload seluruh template N5?")) return;

  for (const module of templateN5) {
    await addDoc(collection(db, "kurikulum", "N5", "modules"), {
      ...module,
      createdAt: new Date()
    });
  }

  alert("Template N5 berhasil diupload!");
  loadModules();
});
