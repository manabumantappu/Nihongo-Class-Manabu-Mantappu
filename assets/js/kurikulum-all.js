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

// =========================
// PROGRAM DATA
// =========================

const programs = {
  N5: {
    durasi: "4 Bulan",
    deskripsi: "Minna no Nihongo I. Hiragana, Katakana, Grammar dasar."
  },
  N4: {
    durasi: "5–6 Bulan",
    deskripsi: "Minna no Nihongo II. Grammar lanjutan."
  },
  N3: {
    durasi: "6–8 Bulan",
    deskripsi: "Intermediate grammar dan reading."
  },
  N2: {
    durasi: "8–12 Bulan",
    deskripsi: "Bahasa bisnis dan artikel berita."
  },
  N1: {
    durasi: "12–18 Bulan",
    deskripsi: "Level profesional & akademik."
  }
};

// =========================
// RENDER CARD
// =========================

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
        onclick="toggleUpload('${level}')"
        class="bg-blue-600 text-white px-4 py-2 rounded">
        Upload PDF / Video
      </button>

      <div id="upload-${level}" class="hidden mt-4">
        <input type="text" id="title-${level}"
          placeholder="Judul Materi"
          class="border p-2 rounded w-full mb-2">

        <input type="file" id="file-${level}" class="mb-2">

        <button 
          onclick="uploadMaterial('${level}')"
          class="bg-green-600 text-white px-4 py-2 rounded">
          Simpan
        </button>

        <div id="list-${level}" class="mt-4 space-y-2"></div>
      </div>

    </div>
  `;

  loadMaterials(level);
}

// =========================
// TOGGLE FORM
// =========================

window.toggleUpload = (level) => {
  document.getElementById(`upload-${level}`)
    .classList.toggle("hidden");
};

// =========================
// UPLOAD FILE
// =========================

window.uploadMaterial = async (level) => {

  const file = document.getElementById(`file-${level}`).files[0];
  const title = document.getElementById(`title-${level}`).value;

  if (!file) return alert("Pilih file dulu");

  const storageRef = ref(
    storage,
    `kurikulum/${level}/${file.name}`
  );

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await addDoc(
    collection(db, "kurikulum", level, "materials"),
    {
      title,
      fileURL: url,
      filePath: storageRef.fullPath,
      createdAt: new Date()
    }
  );

  alert("Upload berhasil!");
  loadMaterials(level);
};

// =========================
// LOAD FILE LIST
// =========================

async function loadMaterials(level) {

  const list = document.getElementById(`list-${level}`);
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "materials")
  );

  snapshot.forEach((d) => {

    const data = d.data();

    list.innerHTML += `
      <div class="flex justify-between bg-gray-100 p-2 rounded">
        <a href="${data.fileURL}" target="_blank" class="text-blue-600 underline">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${level}','${d.id}','${data.filePath}')"
          class="bg-red-500 text-white px-2 py-1 rounded text-sm">
          Hapus
        </button>
      </div>
    `;
  });
}

// =========================
// DELETE FILE
// =========================

window.deleteMaterial = async (level, id, filePath) => {

  await deleteDoc(
    doc(db, "kurikulum", level, "materials", id)
  );

  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);

  loadMaterials(level);
};
