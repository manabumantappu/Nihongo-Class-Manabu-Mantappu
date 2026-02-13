import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("btnHadir");
  const status = document.getElementById("status");

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("sessionId");

  if (!sessionId) {
    status.innerText = "Session tidak valid ❌";
    return;
  }

  btn.addEventListener("click", async () => {

    try {

      const nama = localStorage.getItem("nama");

      if (!nama) {
        status.innerText = "Silakan login dulu ❌";
        return;
      }

      await addDoc(collection(db, "presensi"), {
        sessionId,
        nama,
        waktu: serverTimestamp()
      });

      status.innerText = "Presensi berhasil ✅";
      btn.disabled = true;
      btn.classList.add("opacity-50");

    } catch (error) {
      console.error(error);
      status.innerText = "Terjadi error ❌";
    }

  });

});
