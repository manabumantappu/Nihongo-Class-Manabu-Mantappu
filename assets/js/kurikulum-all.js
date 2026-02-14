import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  const container = document.getElementById("kurikulumContainer");
  if (!container) return;

  const programs = {
    N5: { durasi: "4 Bulan", deskripsi: "Minna no Nihongo I" },
    N4: { durasi: "5–6 Bulan", deskripsi: "Minna no Nihongo II" },
    N3: { durasi: "6–8 Bulan", deskripsi: "Intermediate" },
    N2: { durasi: "8–12 Bulan", deskripsi: "Business Japanese" },
    N1: { durasi: "12–18 Bulan", deskripsi: "Advanced" }
  };

  Object.keys(programs).forEach(level => {
    renderLevel(container, level, programs[level]);
  });
}

function renderLevel(container, level, data) {

  container.innerHTML += `
    <div class="bg-white p-6 rounded-xl shadow space-y-4 mb-6">

      <h2 class="text-2xl font-bold">${level}</h2>

      <p class="text-sm text-gray-500">
        <strong>Durasi:</strong> ${data.durasi}
      </p>

      <p class="text-gray-600 text-sm">
        ${data.deskripsi}
      </p>

      <button 
        onclick="addCategory('${level}')"
        class="bg-blue-600 text-white px-4 py-2 rounded">
        + Tambah Kategori
      </button>

      <div id="categories-${level}" class="space-y-4 mt-4"></div>

    </div>
  `;

  ensureLevelDocument(level);
  loadCategories(level);
}

// ===============================
// ENSURE LEVEL DOCUMENT EXISTS
// ===============================

async function ensureLevelDocument(level) {
  await setDoc(
    doc(db, "kurikulum", level),
    { level: level },
    { merge: true }
  );
}

// ===============================
// CATEGORY
// ===============================

window.addCategory = async (level) => {

  const nama = prompt("Nama kategori (Kanji / Grammar / Kaiwa / dll)");
  if (!nama) return;

  await addDoc(
    collection(db, "kurikulum", level, "categories"),
    {
      nama,
      createdAt: new Date()
    }
  );

  loadCategories(level);
};

async function loadCategories(level) {

  const container = document.getElementById(`categories-${level}`);
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "categories")
  );

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    container.innerHTML += `
      <div class="bg-gray-100 p-4 rounded">

        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-lg">📁 ${data.nama}</h3>
          <button onclick="deleteCategory('${level}','${docSnap.id}')"
            class="bg-red-500 text-white px-2 py-1 rounded text-sm">
            Hapus
          </button>
        </div>

        <button 
          onclick="toggleForm('${level}','${docSnap.id}')"
          class="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm">
          + Tambah Materi
        </button>

        <div id="form-${docSnap.id}" class="hidden mt-3">
          <input type="text" id="title-${docSnap.id}"
            placeholder="Judul Materi"
            class="border p-2 rounded w-full mb-2">

          <input type="text" id="url-${docSnap.id}"
            placeholder="Link PDF / Video"
            class="border p-2 rounded w-full mb-2">

          <button 
            onclick="saveMaterial('${level}','${docSnap.id}')"
            class="bg-blue-600 text-white px-3 py-1 rounded">
            Simpan
          </button>

          <div id="list-${docSnap.id}" class="mt-3 space-y-2"></div>
        </div>

      </div>
    `;

    loadMaterials(level, docSnap.id);
  });
}

window.deleteCategory = async (level, id) => {
  await deleteDoc(doc(db, "kurikulum", level, "categories", id));
  loadCategories(level);
};

// ===============================
// MATERIAL
// ===============================

window.toggleForm = (level, catId) => {
  const el = document.getElementById(`form-${catId}`);
  if (el) el.classList.toggle("hidden");
};

window.saveMaterial = async (level, catId) => {

  const titleInput = document.getElementById(`title-${catId}`);
  const urlInput = document.getElementById(`url-${catId}`);

  if (!titleInput || !urlInput) return;

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if (!title || !url) {
    alert("Isi semua field");
    return;
  }

  await addDoc(
    collection(db, "kurikulum", level, "categories", catId, "materials"),
    {
      title,
      url,
      createdAt: new Date()
    }
  );

  titleInput.value = "";
  urlInput.value = "";

  loadMaterials(level, catId);
};

async function loadMaterials(level, catId) {

  const list = document.getElementById(`list-${catId}`);
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "categories", catId, "materials")
  );

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    list.innerHTML += `
      <div class="flex justify-between bg-white p-2 rounded">
        <a href="${data.url}" target="_blank" class="text-blue-600 underline">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${level}','${catId}','${docSnap.id}')"
          class="bg-red-500 text-white px-2 py-1 rounded text-sm">
          Hapus
        </button>
      </div>
    `;
  });
}

window.deleteMaterial = async (level, catId, id) => {
  await deleteDoc(
    doc(db, "kurikulum", level, "categories", catId, "materials", id)
  );
  loadMaterials(level, catId);
};
