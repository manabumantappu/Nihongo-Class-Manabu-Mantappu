import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
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
const kalenderRef = collection(db, "Kalender");

const role = localStorage.getItem("role");

// 🎨 Warna berdasarkan kategori
function getColor(kategori) {
  if (kategori === "Libur") return "#ef4444";
  if (kategori === "Ujian") return "#f59e0b";
  return "#3b82f6"; // Kelas
}

async function loadEvents() {

  const snapshot = await getDocs(kalenderRef);

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      title: data.judul,
      start: data.tanggal,
      backgroundColor: getColor(data.kategori),
      borderColor: getColor(data.kategori),
      extendedProps: {
        kategori: data.kategori,
        deskripsi: data.deskripsi
      }
    };
  });
}

document.addEventListener("DOMContentLoaded", async function () {

  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: role === "admin",

    dateClick: async function(info) {
      if (role !== "admin") return;

      const judul = prompt("Judul Event:");
      if (!judul) return;

      const kategori = prompt("Kategori (Kelas/Libur/Ujian):", "Kelas");
      const deskripsi = prompt("Deskripsi:");

      await addDoc(kalenderRef, {
        judul,
        tanggal: info.dateStr,
        kategori,
        deskripsi
      });

      calendar.refetchEvents();
    },

    eventClick: async function(info) {

      const data = info.event.extendedProps;

      alert(
        "Judul: " + info.event.title +
        "\nTanggal: " + info.event.startStr +
        "\nKategori: " + data.kategori +
        "\nDeskripsi: " + (data.deskripsi || "-")
      );

      if (role === "admin") {
        if (confirm("Hapus event ini?")) {
          await deleteDoc(doc(db, "Kalender", info.event.id));
          info.event.remove();
        }
      }
    },

    events: async function(fetchInfo, successCallback) {
      const events = await loadEvents();
      successCallback(events);
    }

  });

  calendar.render();
});
