import { db, storage } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const container = document.getElementById("kurikulumContainer");

// ============================
// PROGRAM DATA (LENGKAP)
// ============================

const programs = {

  N5: {
    durasi: "4 Bulan",
    deskripsi: "Minna no Nihongo I. Hiragana, Katakana, Grammar dasar, Kanji ±100.",
    modules: ["Hiragana", "Katakana", "Salam", "Grammar Dasar"]
  },

  N4: {
    durasi: "5–6 Bulan",
    deskripsi: "Minna no Nihongo II. Grammar lanjutan dan Kanji ±300.",
    modules: ["Review N5", "Bentuk Kamus", "Passive"]
  },

  N3: {
    durasi: "6–8 Bulan",
    deskripsi: "Intermediate grammar dan reading artikel.",
    modules: ["Keigo Dasar", "Reading"]
  },

  N2: {
    durasi: "8–12 Bulan",
    deskripsi: "Bahasa bisnis dan artikel berita.",
    modules: ["Business Japanese"]
  },

  N1: {
    durasi: "12–18 Bulan",
    deskripsi: "Level profesional dan akademik.",
    modules: ["Akademik"]
  },

  JFT_A2: {
    durasi: "3–4 Bulan",
    deskripsi: "Komunikasi kerja dan kehidupan di Jepang.",
    modules: ["Instruksi Kerja"]
  }

};

// ============================
// RENDER LEVEL
// ============================

for (const level in programs) {
  renderLevel(level);
}

function renderLevel(level) {

  const data = programs[level];

  container.innerHTML += `
    <div class="bg-white p-6 rounded-xl shadow space-y-4">
      
      <h2 class="text-2xl font-bold">${level}</h2>

      <p class="text-sm text-gray-500">
        <strong>Durasi:</strong> ${data.durasi}
      </p>

      <p class="text-gray-600 text-sm">
        ${data.deskripsi}
      </p>

      <button 
        onclick="uploadTemplate('${level}')"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Upload Semua Modul ${level}
      </button>

      <div id="modules-${level}" class="space-y-3 mt-4"></div>

    </div>
  `;

  loadModules(level);
}

// ============================
// UPLOAD TEMPLATE MODULE
// ============================

window.uploadTemplate = async (level) => {

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

  loadModules(level);
};

// ============================
// LOAD MODULES
// ============================

async function loadModules(level) {

  const moduleContainer = document.getElementById(`modules-${level}`);
  moduleContainer.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "modules")
  );

  snapshot.forEach((d) => {

    const data = d.data();

    moduleContainer.innerHTML += `
      <div class="bg-gray-100 p-3 rounded">
        <div class="flex justify-between items-center">
          <strong>${data.namaModule}</strong>
          <button 
            onclick="toggleUpload('${level}','${d.id}')"
            class="bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Upload File
          </button>
        </div>

        <div id="upload-${d.id}" class="hidden mt-3">
          <input type="text" id="title-${d.id}" 
            placeholder="Judul Materi"
            class="border p-2 rounded w-full mb-2">

          <input type="file" id="file-${d.id}" class="mb-2">

          <button 
            onclick="uploadMaterial('${level}','${d.id}')"
            class="bg-green-600 text-white px-3 py-1 rounded">
            Simpan
          </button>

          <div id="materials-${d.id}" class="mt-3 space-y-2"></div>
        </div>
      </div>
    `;

    loadMaterials(level, d.id);
  });
}

// ============================
// TOGGLE FORM
// ============================

window.toggleUpload = (level, moduleId) => {
  const el = document.getElementById(`upload-${moduleId}`);
  el.classList.toggle("hidden");
};

// ============================
// UPLOAD MATERIAL
// ============================

window.uploadMaterial = async (level, moduleId) => {

  const file = document.getElementById(`file-${moduleId}`).files[0];
  const title = document.getElementById(`title-${moduleId}`).value;

  if (!file) return alert("Pilih file");

  const storageRef = ref(
    storage,
    `kurikulum/${level}/${moduleId}/${file.name}`
  );

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await addDoc(
    collection(db, "kurikulum", level, "modules", moduleId, "materials"),
    {
      title,
      fileURL: url,
      filePath: storageRef.fullPath,
      createdAt: new Date()
    }
  );

  loadMaterials(level, moduleId);
};

// ============================
// LOAD MATERIAL LIST
// ============================

async function loadMaterials(level, moduleId) {

  const list = document.getElementById(`materials-${moduleId}`);
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "modules", moduleId, "materials")
  );

  snapshot.forEach((d) => {

    const data = d.data();

    list.innerHTML += `
      <div class="flex justify-between bg-white p-2 rounded">
        <a href="${data.fileURL}" target="_blank" class="text-blue-600 underline">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${level}','${moduleId}','${d.id}','${data.filePath}')"
          class="bg-red-500 text-white px-2 py-1 rounded text-sm">
          Hapus
        </button>
      </div>
    `;
  });
}

// ============================
// DELETE MATERIAL
// ============================

window.deleteMaterial = async (level, moduleId, id, filePath) => {

  await deleteDoc(
    doc(db, "kurikulum", level, "modules", moduleId, "materials", id)
  );

  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);

  loadMaterials(level, moduleId);
};
