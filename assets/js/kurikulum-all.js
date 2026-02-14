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
}

async function renderLevel(container, level, data) {

  container.innerHTML += `
    <div class="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">

      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-800">${level}</h2>
        <p class="text-sm text-gray-500 mt-1">
          Durasi: ${data.durasi}
        </p>
        <p class="text-gray-600 mt-1 text-sm">
          ${data.deskripsi}
        </p>
      </div>

      <button onclick="addCategory('${level}')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm transition">
        + Tambah Kategori
      </button>

      <div id="categories-${level}" class="mt-8 space-y-6"></div>

    </div>
  `;

  await setDoc(doc(db, "kurikulum", level), { level }, { merge: true });

  await loadCategories(level);
}

window.addCategory = async (level) => {

  const nama = prompt("Nama kategori (Kanji / Grammar / Kaiwa / dll)");
  if (!nama) return;

  await addDoc(
    collection(db, "kurikulum", level, "categories"),
    { nama, createdAt: new Date() }
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

  for (const docSnap of snapshot.docs) {

    const data = docSnap.data();
    const catId = docSnap.id;

    container.innerHTML += `
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">

        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">
            📁 ${data.nama}
          </h3>
          <button onclick="deleteCategory('${level}','${catId}')"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">
            Hapus
          </button>
        </div>

        <!-- FORM -->
        <div class="bg-white p-4 rounded-lg border border-gray-200 mb-4">

          <input type="text" id="title-${catId}"
            placeholder="Judul Materi"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400">

          <input type="text" id="url-${catId}"
            placeholder="Link PDF / Video"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400">

          <button onclick="saveMaterial('${level}','${catId}')"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
            Simpan
          </button>

        </div>

        <!-- MATERIAL LIST -->
        <div id="list-${catId}" class="space-y-3"></div>

      </div>
    `;

    await loadMaterials(level, catId);
  }
}

window.deleteCategory = async (level, id) => {
  await deleteDoc(doc(db, "kurikulum", level, "categories", id));
  await loadCategories(level);
};

window.saveMaterial = async (level, catId) => {

  const title = document.getElementById(`title-${catId}`).value.trim();
  const url = document.getElementById(`url-${catId}`).value.trim();

  if (!title || !url) {
    alert("Isi semua field");
    return;
  }

  await addDoc(
    collection(db, "kurikulum", level, "categories", catId, "materials"),
    { title, url, createdAt: new Date() }
  );

  document.getElementById(`title-${catId}`).value = "";
  document.getElementById(`url-${catId}`).value = "";

  await loadMaterials(level, catId);
};

async function loadMaterials(level, catId) {

  const list = document.getElementById(`list-${catId}`);
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "categories", catId, "materials")
  );

  if (snapshot.empty) {
    list.innerHTML = `
      <p class="text-gray-400 text-sm italic">
        Belum ada materi
      </p>
    `;
    return;
  }

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    list.innerHTML += `
      <div class="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

        <a href="${data.url}" target="_blank"
          class="text-indigo-600 font-medium hover:underline text-sm">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${level}','${catId}','${docSnap.id}')"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">
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
