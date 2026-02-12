import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWe_8KQh5J5gzgKYDWnzNKiw-y1Vj3908",
  authDomain: "jp-nihongo-class.firebaseapp.com",
  projectId: "jp-nihongo-class",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sessionRef = doc(db, "QRSession", "active");
const presensiRef = collection(db, "Presensi");

let timerInterval = null;

// ================= RANDOM TOKEN =================
function generateToken() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ================= START SESSION =================
window.startSession = async function() {

  const token = generateToken();
  const now = new Date();
  const expires = new Date(now.getTime() + 3 * 60000); // 3 menit

  await setDoc(sessionRef, {
    active: true,
    token: token,
    expiresAt: expires,
    tanggal: now.toISOString().split("T")[0]
  });

  renderQR(token);
  startCountdown(expires);

  document.getElementById("status").textContent = "Aktif";
  document.getElementById("status").className = "text-green-600 font-semibold";
};

// ================= STOP SESSION =================
window.stopSession = async function() {

  await updateDoc(sessionRef, { active: false });

  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("status").textContent = "Tidak Aktif";
  document.getElementById("status").className = "text-red-600 font-semibold";
  document.getElementById("countdown").textContent = "-";

  clearInterval(timerInterval);
};

// ================= RENDER QR =================
function renderQR(token) {

  document.getElementById("qrcode").innerHTML = "";

  new QRCode(document.getElementById("qrcode"), {
    text: JSON.stringify({ token }),
    width: 250,
    height: 250
  });
}

// ================= COUNTDOWN =================
function startCountdown(expireTime) {

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    const now = new Date();
    const diff = expireTime - now;

    if (diff <= 0) {
      stopSession();
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById("countdown").textContent =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  }, 1000);
}

// ================= REALTIME MONITOR =================
onSnapshot(
  query(presensiRef, where("tanggal", "==", new Date().toISOString().split("T")[0])),
  (snapshot) => {

    const tbody = document.getElementById("liveList");
    tbody.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      tbody.innerHTML += `
        <tr class="border-t">
          <td class="p-3">${data.nama}</td>
          <td class="p-3 text-center">${data.email}</td>
          <td class="p-3 text-center">${data.jamMasuk || data.jamPulang}</td>
        </tr>
      `;
    });

  }
);
