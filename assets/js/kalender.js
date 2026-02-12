import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWe_8KQh5J5gzgKYDWnzNKiw-y1Vj3908",
  authDomain: "jp-nihongo-class.firebaseapp.com",
  projectId: "jp-nihongo-class",
  storageBucket: "jp-nihongo-class.firebasestorage.app",
  messagingSenderId: "102563702284",
  appId: "1:102563702284:web:9a5166a4f7450127647029"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const kalenderRef = collection(db, "Kalender");

const role = localStorage.getItem("role");

// Tampilkan form hanya admin
if (role === "admin") {
  document.getElementById("formKalender").classList.remove("hidden");
}

// ================= LOAD EVENT =================
async function loadEvent() {

  const q = query(kalenderRef, orderBy("tanggal", "asc"));
  const snapshot = await getDocs(q);

  const list = document.getElementById("eventList");
  list.innerHTML = "";

  if (snapshot.empty) {
    list.innerHTML = `<p class="text-gray-500">Belum ada event</p>`;
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();

    list.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold">${data.judul}</h3>
          <span class="text-sm text-gray-500">${data.tanggal}</span>
        </div>
        <p class="text-sm mt-2">${data.deskripsi || "-"}</p>
        <span class="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          ${data.kategori}
        </span>
      </div>
    `;
  });
}

// ================= TAMBAH EVENT =================
window.tambahEvent = async function() {

  const judul = document.getElementById("judul").value;
  const tanggal = document.getElementById("tanggal").value;
  const kategori = document.getElementById("kategori").value;
  const deskripsi = document.getElementById("deskripsi").value;

  if (!judul || !tanggal) {
    alert("Judul dan tanggal wajib diisi");
    return;
  }

  await addDoc(kalenderRef, {
    judul,
    tanggal,
    kategori,
    deskripsi
  });

  document.getElementById("judul").value = "";
  document.getElementById("tanggal").value = "";
  document.getElementById("deskripsi").value = "";

  loadEvent();
};

loadEvent();
