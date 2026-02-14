import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

async function init() {

  const container = document.getElementById("kurikulumContainer");
  if (!container) return;

  container.innerHTML = "";

  const programs = {
    N5: { durasi: "4 Bulan", deskripsi: "Minna no Nihongo I" },
    N4: { durasi: "5–6 Bulan", deskripsi: "Minna no Nihongo II" },
    N3: { durasi: "6–8 Bulan", deskripsi: "Intermediate" },
    N2: { durasi: "8–12 Bulan", deskripsi: "Business Japanese" },
    N1: { durasi: "12–18 Bulan", deskripsi: "Advanced" },
    JFT_A2: { durasi: "3–4 Bulan", deskripsi: "JFT Basic A2" },
    SSW: { durasi: "3–6 Bulan", deskripsi: "Specified Skilled Worker" }
  };

  for (const level of Object.keys(programs)) {
    await renderLevel(container, level, programs[level]);
  }

  // Delay kecil supaya DOM benar-benar siap
  setTimeout(async () => {
    for (const level of Object.keys(programs)) {
      await loadCategories(level);
    }
  }, 100);
}

async function renderLevel(container, level, data) {

  container.innerHTML += `
    <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">

      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">${level}</h2>
          <p class="text-sm text-gray-500 mt-1">
            Durasi: ${data.durasi}
          </p>
          <p class="text-sm text-gray-600">
            ${data.deskripsi}
          </p>
        </div>
      </div>

      <button 
        onclick="addCategory('${level}')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
        + Tambah Kategori
      </button>

      <div id="categories-${level}" class="mt-6 space-y-5"></div>

    </div>
  `;

  await setDoc(
    doc(db, "kurikulum", level),
    { level },
    { merge: true }
  );
}

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

  await loadCategories(level);
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
      <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">

        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-800 text-lg">
            📁 ${data.nama}
          </h3>
          <button onclick="deleteCategory('${level}','${docSnap.id}')"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition">
            Hapus
          </button>
        </div>

        <button 
          onclick="toggleForm('${level}','${docSnap.id}')"
          class="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition">
          + Tambah Materi
        </button>

        <div id="form-${docSnap.id}" class="hidden mt-4">

          <input type="text" id="title-${docSnap.id}"
            placeholder="Judul Materi"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">

          <input type="text" id="url-${docSnap.id}"
            placeholder="Link PDF / Video"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400">

          <button 
            onclick="saveMaterial('${level}','${docSnap.id}')"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Simpan
          </button>

          <div id="list-${docSnap.id}" class="mt-4 space-y-3"></div>
        </div>

      </div>
    `;

    loadMaterials(level, docSnap.id);
  });
}

window.deleteCategory = async (level, id) => {
  await deleteDoc(doc(db, "kurikulum", level, "categories", id));
  await loadCategories(level);
};

window.toggleForm = (level, catId) => {
  const el = document.getElementById(`form-${catId}`);
  if (el) el.classList.toggle("hidden");
};

window.saveMaterial = async (level, catId) => {

  const titleInput = document.getElementById(`title-${catId}`);
  const urlInput = document.getElementById(`url-${catId}`);

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

  await loadMaterials(level, catId);
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
      <div class="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <a href="${data.url}" target="_blank"
          class="text-indigo-600 hover:underline text-sm font-medium">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${level}','${catId}','${docSnap.id}')"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition">
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
  await loadMaterials(level, catId);
};
