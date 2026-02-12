import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWe_8KQh5J5gzgKYDWnzNKiw-y1Vj3908",
  authDomain: "jp-nihongo-class.firebaseapp.com",
  projectId: "jp-nihongo-class",
  storageBucket: "jp-nihongo-class.firebasestorage.app",
  messagingSenderId: "102563702284",
  appId: "1:102563702284:web:9a5166a4f7450127647029"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userRef = collection(db, "User");

window.tambahUser = async function() {

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!nama || !email || !password) {
    alert("Semua field wajib diisi");
    return;
  }

  await addDoc(userRef, {
    nama,
    email,
    password,
    role: "siswa"
  });

  alert("Siswa berhasil ditambahkan!");

  document.getElementById("nama").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
};
