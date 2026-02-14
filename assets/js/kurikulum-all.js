import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("kurikulumContainer");

// ==========================
// DATA LEVEL
// ==========================

const programs = {
  N5: {
    durasi: "4 Bulan",
    deskripsi: "Minna no Nihongo I. Hiragana, Katakana, Grammar dasar, Kanji ±100.",
    modules: ["Hiragana", "Katakana", "Salam", "Partikel", "Bentuk Te", "Simulasi N5"]
  },
  N4: {
    durasi: "5–6 Bulan",
    deskripsi: "Minna no Nihongo II. Grammar lanjutan dan Kanji ±300.",
    modules: ["Review N5", "Bentuk Kamus", "Passive", "Simulasi N4"]
  },
  N3: {
    durasi: "6–8 Bulan",
    deskripsi: "Intermediate grammar dan reading artikel.",
    modules: ["Keigo Dasar", "Reading", "Simulasi N3"]
  },
  N2: {
    durasi: "8–12 Bulan",
    deskripsi: "Bahasa bisnis dan artikel berita.",
    modules: ["Keigo Lanjutan", "Business Japanese", "Simulasi N2"]
  },
  N1: {
    durasi: "12–18 Bulan",
    deskripsi: "Level profesional & akademik.",
    modules: ["Struktur Akademik", "Artikel Ilmiah", "Simulasi N1"]
  },
  JFT_A2: {
    durasi: "3–4 Bulan",
    deskripsi: "Komunikasi kerja di Jepang.",
    modules: ["Instruksi Kerja", "Keselamatan Kerja", "Simulasi JFT"]
  }
};

// ==========================
// RENDER LEVEL
// ==========================

for (const level in programs) {
  renderLevel(level);
}

// ==========================
// RENDER LEVEL CARD
// ==========================

function renderLevel(level) {

  const data = programs[level];

  container.innerHTML += `
    <div class="bg-white p-6 rounded-xl shadow space-y-4" id="card-${level}">
      <h2 class="text-2xl font-bold">${level}</h2>
      <p class="text-sm text-gray-500"><strong>Durasi:</strong> ${data.durasi}</p>
      <p class="text-gray-600 text-sm">${data.deskripsi}</p>

      <button 
        onclick="uploadLevel('${level}')"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Upload Semua Modul ${level}
      </button>

      <div class="mt-4 space-y-2" id="list-${level}"></div>
    </div>
  `;

  loadModules(level);
}

// ==========================
// LOAD MODULES PER LEVEL
// ==========================

async function loadModules(level) {

  const listContainer = document.getElementById(`list-${level}`);
  listContainer.innerHTML = "";

  const q = query(
    collection(db, "kurikulum", level, "modules"),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((d) => {
    const data = d.data();

    listContainer.innerHTML += `
      <div class="flex justify-between items-center bg-gray-100 p-3 rounded">
        <span>${data.namaModule}</span>

        <div class="flex gap-2">
          <button onclick="editModule('${level}', '${d.id}', '${data.namaModule}')"
            class="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
            Edit
          </button>

          <button onclick="deleteModule('${level}', '${d.id}')"
            class="bg-red-500 text-white px-2 py-1 rounded text-sm">
            Hapus
          </button>
        </div>
      </div>
    `;
  });
}

// ==========================
// UPLOAD TEMPLATE
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

  alert(`Modul ${level} berhasil diupload!`);
  loadModules(level);
};

// ==========================
// DELETE MODULE
// ==========================

window.deleteModule = async (level, id) => {

  if (!confirm("Yakin hapus modul ini?")) return;

  await deleteDoc(doc(db, "kurikulum", level, "modules", id));

  loadModules(level);
};

// ==========================
// EDIT MODULE
// ==========================

window.editModule = async (level, id, oldName) => {

  const newName = prompt("Edit Nama Modul:", oldName);
  if (!newName) return;

  await updateDoc(
    doc(db, "kurikulum", level, "modules", id),
    { namaModule: newName }
  );

  loadModules(level);
};
