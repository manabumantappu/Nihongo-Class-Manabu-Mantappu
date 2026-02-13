import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const btnMulai = document.getElementById("btnMulaiSesi");

  btnMulai.addEventListener("click", async () => {

    try {

      // 1️⃣ Buat sesi
      const now = new Date();
      const expireTime = new Date(now.getTime() + 3 * 60 * 1000);

      const docRef = await addDoc(collection(db, "sessions"), {
        isActive: true,
        createdAt: serverTimestamp(),
        expiresAt: expireTime
      });

      const sessionId = docRef.id;

      // 🔥 FIX PATH GITHUB PAGES
      const repo = window.location.pathname.split("/")[1];

      const scanUrl =
        `${window.location.origin}/${repo}/scan.html?sessionId=${sessionId}`;

      // 2️⃣ Generate QR
      const qrContainer = document.getElementById("qrcode");
      qrContainer.innerHTML = "";

      new QRCode(qrContainer, {
        text: scanUrl,
        width: 220,
        height: 220
      });

      alert("Sesi berhasil dibuat ✅");

    } catch (error) {
      console.error(error);
      alert("Terjadi error ❌");
    }

  });

});
