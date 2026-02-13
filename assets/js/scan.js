import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = { /* config kamu */ };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ambil sessionId dari URL
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("sessionId");

document.getElementById("btnHadir").addEventListener("click", async () => {

  const namaSiswa = localStorage.getItem("nama");

  if (!sessionId) {
    alert("Sesi tidak valid");
    return;
  }

  await addDoc(collection(db, "presensi"), {
    sessionId: sessionId,
    nama: namaSiswa,
    waktu: serverTimestamp()
  });

  alert("Presensi berhasil ✅");
});
