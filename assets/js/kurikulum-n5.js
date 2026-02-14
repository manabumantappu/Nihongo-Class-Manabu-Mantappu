import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const moduleList = document.getElementById("moduleList");
const addModuleBtn = document.getElementById("addModuleBtn");

// ==========================
// LOAD MODULES
// ==========================
async function loadModules() {
  moduleList.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", "N5", "modules")
  );

  snapshot.forEach((d) => {
    const data = d.data();

    moduleList.innerHTML += `
      <div class="bg-white p-5 rounded shadow">
        <h3 class="text-lg font-bold">${data.namaModule}</h3>
        <p class="text-sm text-gray-600 mt-2">${data.deskripsi || ""}</p>
        <p class="text-xs text-gray-400 mt-2">Target: ${data.target || "-"}</p>

        <div class="flex gap-2 mt-4">
          <button data-id="${d.id}" class="editBtn bg-yellow-500 text-white px-3 py-1 rounded text-sm">
            Edit
          </button>
          <button data-id="${d.id}" class="deleteBtn bg-red-500 text-white px-3 py-1 rounded text-sm">
            Hapus
          </button>
        </div>
      </div>
    `;
  });

  attachEvents();
}

loadModules();

// ==========================
// TAMBAH MODULE
// ==========================
addModuleBtn.addEventListener("click", async () => {

  const namaModule = prompt("Nama Modul:");
  if (!namaModule) return;

  const deskripsi = prompt("Deskripsi Modul:");
  const target = prompt("Target Modul:");

  await addDoc(collection(db, "kurikulum", "N5", "modules"), {
    namaModule,
    deskripsi,
    target,
    createdAt: new Date()
  });

  alert("Modul berhasil ditambahkan");
  loadModules();
});

// ==========================
// EVENT EDIT & DELETE
// ==========================
function attachEvents() {

  // DELETE
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Yakin hapus modul ini?")) return;

      await deleteDoc(doc(db, "kurikulum", "N5", "modules", id));
      loadModules();
    });
  });

  // EDIT
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const namaModule = prompt("Nama baru:");
      if (!namaModule) return;

      const deskripsi = prompt("Deskripsi baru:");
      const target = prompt("Target baru:");

      await updateDoc(
        doc(db, "kurikulum", "N5", "modules", id),
        {
          namaModule,
          deskripsi,
          target,
          updatedAt: new Date()
        }
      );

      loadModules();
    });
  });

}
