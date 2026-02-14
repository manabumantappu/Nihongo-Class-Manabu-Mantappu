import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const moduleList = document.getElementById("moduleList");
const addModuleBtn = document.getElementById("addModuleBtn");

// ==========================
// LOAD MODULES
// ==========================

async function loadModules() {
  moduleList.innerHTML = "";

  const querySnapshot = await getDocs(
    collection(db, "kurikulum", "N5", "modules")
  );

  querySnapshot.forEach((document) => {
    const data = document.data();

    moduleList.innerHTML += `
      <div class="bg-white p-5 rounded shadow relative">
        <h3 class="text-lg font-bold mb-2">${data.namaModule}</h3>
        
        <p class="text-gray-600 text-sm mb-3">
          ${data.deskripsi}
        </p>

        <p class="text-xs text-gray-400 mb-3">
          Target: ${data.target}
        </p>

        <div class="flex gap-2">
          <button onclick="deleteModule('${document.id}')"
            class="bg-red-500 text-white px-3 py-1 rounded text-sm">
            Hapus
          </button>
        </div>
      </div>
    `;
  });
}

loadModules();

// ==========================
// TAMBAH MODULE
// ==========================

addModuleBtn.addEventListener("click", async () => {
  const namaModule = prompt("Nama Module:");
  const deskripsi = prompt("Deskripsi Module:");
  const target = prompt("Target Pembelajaran Module:");

  if (!namaModule) return;

  await addDoc(collection(db, "kurikulum", "N5", "modules"), {
    namaModule,
    deskripsi,
    target,
    createdAt: new Date()
  });

  loadModules();
});

// ==========================
// DELETE MODULE
// ==========================

window.deleteModule = async (id) => {
  if (!confirm("Yakin ingin hapus module ini?")) return;

  await deleteDoc(doc(db, "kurikulum", "N5", "modules", id));
  loadModules();
};
