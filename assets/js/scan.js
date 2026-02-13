import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  // config kamu
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const db = getFirestore(app);

// ambil sessionId dari URL
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("sessionId");

document.getElementById("btnHadir").addEventListener("click", async () => {

  const nama = localStorage.getItem("nama");

  if (!sessionId) {
    alert("Sesi tidak valid");
    return;
  }

  await addDoc(collection(db, "presensi"), {
    sessionId,
    nama,
    waktu: serverTimestamp()
  });

  alert("Presensi berhasil ✅");
});
