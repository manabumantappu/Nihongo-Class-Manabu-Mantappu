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

// ================= FIREBASE =================
const firebaseConfig = {
  // config kamu
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const db = getFirestore(app);

// ================= BUTTON =================
const btnMulai = document.getElementById("btnMulaiSesi");

btnMulai.addEventListener("click", async () => {

  // 1️⃣ Buat sesi
  const now = new Date();
  const expireTime = new Date(now.getTime() + 3 * 60 * 1000); // 3 menit

  const docRef = await addDoc(collection(db, "sessions"), {
    isActive: true,
    createdAt: serverTimestamp(),
    expiresAt: expireTime
  });

  const sessionId = docRef.id;

  // 2️⃣ Buat link scan
  const baseUrl = window.location.origin + window.location.pathname.split("/admin")[0];

  const scanUrl = `${baseUrl}/scan.html?sessionId=${sessionId}`;

  // 3️⃣ Generate QR
  document.getElementById("qrcode").innerHTML = "";

  new QRCode(document.getElementById("qrcode"), {
    text: scanUrl,
    width: 220,
    height: 220
  });

  alert("Sesi berhasil dibuat ✅");
});
