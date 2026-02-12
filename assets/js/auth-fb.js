import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
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
const usersRef = collection(db, "Users");

// ================= LOGIN =================
document.getElementById("loginBtn")?.addEventListener("click", async () => {

  const email = document.getElementById("emailInput")?.value.trim();

  if (!email) {
    alert("Masukkan email terlebih dahulu");
    return;
  }

  try {
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("User tidak ditemukan");
      return;
    }

    const userData = snapshot.docs[0].data();

    // 🔥 Simpan ke localStorage
    localStorage.setItem("email", userData.email);
    localStorage.setItem("nama", userData.nama);
    localStorage.setItem("role", userData.role);

    // 🔥 Redirect berdasarkan role
    if (userData.role === "admin") {
      window.location.href = "admin/index.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Terjadi kesalahan saat login");
  }

});

// ================= LOGOUT =================
window.logout = function () {
  localStorage.clear();
  window.location.href = "index.html";
};
