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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWe_8KQh5J5gzgKYDWnzNKiw-y1Vj3908",
  authDomain: "jp-nihongo-class.firebaseapp.com",
  projectId: "jp-nihongo-class",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const presensiRef = collection(db, "Presensi");

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getTime() {
  return new Date().toTimeString().split(" ")[0];
}

const email = localStorage.getItem("email");
const nama = localStorage.getItem("nama");

if (!email) {
  alert("Harus login dulu");
  window.location.href = "index.html";
}

async function prosesPresensi() {

  const tanggal = getToday();
  const waktu = getTime();

  const q = query(
    presensiRef,
    where("email", "==", email),
    where("tanggal", "==", tanggal)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // ABSEN MASUK
    const batas = "09:00:00";
    const status = waktu > batas ? "Terlambat" : "Hadir";

    await addDoc(presensiRef, {
      nama,
      email,
      tanggal,
      jamMasuk: waktu,
      jamPulang: null,
      statusMasuk: status,
      statusPulang: null,
      createdAt: serverTimestamp()
    });

    document.getElementById("result").innerText = "Absen Masuk Berhasil!";
  } else {

    const data = snapshot.docs[0];
    const ref = doc(db, "Presensi", data.id);

    if (data.data().jamPulang) {
      document.getElementById("result").innerText = "Sudah absen lengkap!";
      return;
    }

    await updateDoc(ref, {
      jamPulang: waktu,
      statusPulang: "Pulang"
    });

    document.getElementById("result").innerText = "Absen Pulang Berhasil!";
  }
}

function onScanSuccess(decodedText) {

  try {
    const token = JSON.parse(decodedText);

    if (token.tanggal !== getToday()) {
      alert("QR bukan untuk hari ini!");
      return;
    }

    prosesPresensi();

  } catch {
    alert("QR tidak valid!");
  }
}

const html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: 250 },
  false
);

html5QrcodeScanner.render(onScanSuccess);
