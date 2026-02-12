import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDWe_8KQh5J5gzgKYDWnzNKiw-y1Vj3908",
  authDomain: "jp-nihongo-class.firebaseapp.com",
  projectId: "jp-nihongo-class",
  storageBucket: "jp-nihongo-class.firebasestorage.app",
  messagingSenderId: "102563702284",
  appId: "1:102563702284:web:9a5166a4f7450127647029"
};

// ================= INIT =================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const presensiRef = collection(db, "Presensi");

// ================= LOAD DATA =================
async function loadData() {
  const snapshot = await getDocs(presensiRef);
  render(snapshot);
}

// ================= RENDER =================
function render(snapshot) {
  const tbody = document.getElementById("rekap");
  tbody.innerHTML = "";

  if (snapshot.empty) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center p-4 text-gray-500">
          Data tidak ditemukan
        </td>
      </tr>
    `;
    return;
  }

  let dataList = [];

  snapshot.forEach((item) => {
    dataList.push(item.data());
  });

  // Sort manual berdasarkan tanggal terbaru
  dataList.sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  dataList.forEach((data) => {
    tbody.innerHTML += `
      <tr class="border-t hover:bg-gray-50">
        <td class="p-3">${data.nama || "-"}</td>
        <td class="p-3">${data.email}</td>
        <td class="p-3 text-center">
          ${data.tanggal} <br>
          Masuk: ${data.jamMasuk || "-"} <br>
          Pulang: ${data.jamPulang || "-"}
        </td>
        <td class="p-3 text-center">
          ${data.statusMasuk || "-"}
        </td>
      </tr>
    `;
  });
}

// ================= FILTER =================
window.applyFilter = async function () {
  const email = document.getElementById("filterEmail").value.trim();
  const tanggal = document.getElementById("filterDate").value;

  let q;

  if (email && tanggal) {
    q = query(
      presensiRef,
      where("email", "==", email),
      where("tanggal", "==", tanggal)
    );
  } else if (email) {
    q = query(presensiRef, where("email", "==", email));
  } else if (tanggal) {
    q = query(presensiRef, where("tanggal", "==", tanggal));
  } else {
    loadData();
    return;
  }

  const snapshot = await getDocs(q);
  render(snapshot);
};

// ================= RESET =================
window.resetFilter = function () {
  document.getElementById("filterEmail").value = "";
  document.getElementById("filterDate").value = "";
  loadData();
};

// ================= CLEAR ALL =================
window.clearData = async function () {
  if (!confirm("Yakin ingin menghapus semua presensi?")) return;

  const snapshot = await getDocs(presensiRef);

  for (const item of snapshot.docs) {
    await deleteDoc(doc(db, "Presensi", item.id));
  }

  loadData();
};

// ================= INIT =================
loadData();
