import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("kurikulumContainer");

const programs = {
  N5: { durasi: "4 Bulan", deskripsi: "Minna no Nihongo I" },
  N4: { durasi: "5–6 Bulan", deskripsi: "Minna no Nihongo II" },
  N3: { durasi: "6–8 Bulan", deskripsi: "Intermediate" },
  N2: { durasi: "8–12 Bulan", deskripsi: "Business Japanese" },
  N1: { durasi: "12–18 Bulan", deskripsi: "Advanced" }
};

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
        onclick="addCategory('${level}')"
        class="bg-blue-600 text-white px-4 py-2 rounded">
        + Tambah Kategori
      </button>

      <div id="categories-${level}" class="space-y-4 mt-4"></div>

    </div>
  `;

  loadCategories(level);
}

// =============================
// CATEGORY
// =============================

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

  const containerCat = document.getElementById(`categories-${level}`);
  containerCat.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "categories")
  );

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    containerCat.innerHTML += `
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

// =============================
// MATERIAL
// =============================

window.toggleForm = (level, catId) => {
  document.getElementById(`form-${catId}`)
    .classList.toggle("hidden");
};

window.saveMaterial = async (level, catId) => {

  const title = document.getElementById(`title-${catId}`).value;
  const url = document.getElementById(`url-${catId}`).value;

  if (!title || !url) return alert("Isi semua field");

  await addDoc(
    collection(db, "kurikulum", level, "categories", catId, "materials"),
    {
      title,
      url,
      createdAt: new Date()
    }
  );

  loadMaterials(level, catId);
};

async function loadMaterials(level, catId) {

  const list = document.getElementById(`list-${catId}`);
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "categories", catId, "materials")
  );

  snapshot.forEach((docSnap) => {

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

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("kurikulumContainer");

const programs = {
  N5: { durasi: "4 Bulan", deskripsi: "Minna no Nihongo I" },
  N4: { durasi: "5–6 Bulan", deskripsi: "Minna no Nihongo II" },
  N3: { durasi: "6–8 Bulan", deskripsi: "Intermediate" },
  N2: { durasi: "8–12 Bulan", deskripsi: "Business Japanese" },
  N1: { durasi: "12–18 Bulan", deskripsi: "Advanced" }
};

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
        onclick="toggleForm('${level}')"
        class="bg-blue-600 text-white px-4 py-2 rounded">
        Tambah Materi (Link)
      </button>

      <div id="form-${level}" class="hidden mt-4">
        <input type="text" id="title-${level}"
          placeholder="Judul Materi"
          class="border p-2 rounded w-full mb-2">

        <input type="text" id="url-${level}"
          placeholder="Link PDF / Video"
          class="border p-2 rounded w-full mb-2">

        <button 
          onclick="saveMaterial('${level}')"
          class="bg-green-600 text-white px-4 py-2 rounded">
          Simpan
        </button>

        <div id="list-${level}" class="mt-4 space-y-2"></div>
      </div>

    </div>
  `;

  loadMaterials(level);
}

window.toggleForm = (level) => {
  document.getElementById(`form-${level}`).classList.toggle("hidden");
};

window.saveMaterial = async (level) => {

  const title = document.getElementById(`title-${level}`).value;
  const url = document.getElementById(`url-${level}`).value;

  if (!title || !url) return alert("Isi semua field");

  await addDoc(
    collection(db, "kurikulum", level, "materials"),
    {
      title,
      url,
      createdAt: new Date()
    }
  );

  loadMaterials(level);
};

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
        <a href="${data.url}" target="_blank" class="text-blue-600 underline">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${level}','${d.id}')"
          class="bg-red-500 text-white px-2 py-1 rounded text-sm">
          Hapus
        </button>
      </div>
    `;
  });
}

window.deleteMaterial = async (level, id) => {

  await deleteDoc(
    doc(db, "kurikulum", level, "materials", id)
  );

  loadMaterials(level);
};
