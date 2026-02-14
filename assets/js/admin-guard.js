import { auth } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || docSnap.data().role !== "admin") {
    alert("Akses ditolak! Halaman hanya untuk Admin.");
    window.location.href = "/index.html";
  }
});
