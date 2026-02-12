import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp
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

// ================= HELPERS =================
function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getTime() {
  return new Date().toTimeString().split(" ")[0];
}

function getEmail() {
  return localStorage.getItem("email");
}

function showInfo(message, color = "green") {
  const box = document.getElementById("infoBox");
  box.classList.remove("hidden");
  box.className = `mb-6 p-4 bg-${color}-100 text-${color}-700 rounded shadow text-sm`;
  box.textContent = message;
}

// ================= LOAD RIWAYAT =================
async function loadRiwayat() {
  const email = getEmail();
  if (!email) return;

  const q = query(
    presensiRef,
    where("email", "==", email),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  const tbody = document.getElementById("table");
  tbody.innerHTML = "";

  snapshot.forEach((item) => {
    const data = item.data();

    tbody.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="p-3">${data.tanggal}</td>
        <td class="p-3 text-center">${data.jamMasuk || "-"}</td>
        <td class="p-3 text-center">${data.statusMasuk || "-"}</td>
        <td class="p-3 text-center">${data.jamPulang || "-"}</td>
        <td class="p-3 text-center">${data.statusPulang || "-"}</td>
      </tr>
    `;
  });
}

// ================= ABSEN MASUK =================
document.getElementById("masuk").addEventListener("click", async () => {

  const email = getEmail();
  if (!email) return alert("Email tidak ditemukan");

  const tanggal = getToday();
  const waktu = getTime();

  const q = query(
    presensiRef,
    where("email", "==", email),
    where("tanggal", "==", tanggal)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    showInfo("Sudah absen masuk hari ini!", "yellow");
    return;
  }

  const batas = "09:00:00";
  const status = waktu > batas ? "Terlambat" : "Hadir";

  await addDoc(presensiRef, {
    email,
    tanggal,
    jamMasuk: waktu,
    jamPulang: null,
    statusMasuk: status,
    statusPulang: null,
    createdAt: serverTimestamp()
  });

  showInfo("Absen masuk berhasil!", "green");
  loadRiwayat();
});

// ================= ABSEN PULANG =================
document.getElementById("pulang").addEventListener("click", async () => {

  const email = getEmail();
  if (!email) return alert("Email tidak ditemukan");

  const tanggal = getToday();
  const waktu = getTime();

  const q = query(
    presensiRef,
    where("email", "==", email),
    where("tanggal", "==", tanggal)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    showInfo("Belum absen masuk hari ini!", "red");
    return;
  }

  const docData = snapshot.docs[0];
  const ref = doc(db, "Presensi", docData.id);

  if (docData.data().jamPulang) {
    showInfo("Sudah absen pulang!", "yellow");
    return;
  }

  await updateDoc(ref, {
    jamPulang: waktu,
    statusPulang: "Pulang"
  });

  showInfo("Absen pulang berhasil!", "blue");
  loadRiwayat();
});

// ================= INIT LOAD =================
loadRiwayat();
