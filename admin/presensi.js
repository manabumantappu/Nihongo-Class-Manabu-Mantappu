import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const presensiRef = collection(db, "Presensi");

// ================= LOAD DATA =================
async function loadData() {
  const q = query(presensiRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  render(snapshot);
}

// ================= RENDER =================
function render(snapshot) {
  const tbody = document.getElementById("rekap");
  tbody.innerHTML = "";

  if (snapshot.empty) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center p-4 text-gray-500">
          Data tidak ditemukan
        </td>
      </tr>
    `;
    return;
  }

  snapshot.forEach((item) => {
    const data = item.data();

    tbody.innerHTML += `
      <tr class="border-t">
        <td class="p-3">${data.email}</td>
        <td class="p-3 text-center">
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
  const email = document.getElementById("filterEmail").value;
  const tanggal = document.getElementById("filterDate").value;

  let q = presensiRef;

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
  snapshot.forEach(async (item) => {
    await deleteDoc(doc(db, "Presensi", item.id));
  });

  loadData();
};

loadData();
