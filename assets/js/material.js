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

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const titleInput = document.getElementById("title");
const typeSelect = document.getElementById("type");
const materialList = document.getElementById("materialList");

const level = "N5";  // sementara hardcode dulu
const moduleId = "default"; // nanti bisa dinamis

// ===================
// LOAD MATERIAL
// ===================

async function loadMaterials() {

  materialList.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "kurikulum", level, "modules", moduleId, "materials")
  );

  snapshot.forEach((d) => {

    const data = d.data();

    materialList.innerHTML += `
      <div class="flex justify-between bg-gray-100 p-3 rounded">
        <a href="${data.fileURL}" target="_blank" class="text-blue-600 underline">
          ${data.title}
        </a>

        <button onclick="deleteMaterial('${d.id}', '${data.filePath}')"
          class="bg-red-500 text-white px-2 py-1 rounded text-sm">
          Hapus
        </button>
      </div>
    `;
  });
}

loadMaterials();

// ===================
// UPLOAD FILE
// ===================

uploadBtn.addEventListener("click", async () => {

  const file = fileInput.files[0];
  if (!file) return alert("Pilih file dulu");

  const title = titleInput.value;
  const type = typeSelect.value;

  const storageRef = ref(
    storage,
    `kurikulum/${level}/${moduleId}/${file.name}`
  );

  await uploadBytes(storageRef, file);

  const fileURL = await getDownloadURL(storageRef);

  await addDoc(
    collection(db, "kurikulum", level, "modules", moduleId, "materials"),
    {
      title,
      type,
      fileURL,
      filePath: storageRef.fullPath,
      createdAt: new Date()
    }
  );

  alert("Upload berhasil!");
  loadMaterials();
});

// ===================
// DELETE
// ===================

window.deleteMaterial = async (id, filePath) => {

  if (!confirm("Hapus file?")) return;

  await deleteDoc(
    doc(db, "kurikulum", level, "modules", moduleId, "materials", id)
  );

  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);

  loadMaterials();
};
