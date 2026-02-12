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

let selectedEventId = null;
let calendar;

// ================= FETCH EVENTS =================
async function fetchEvents() {
  const snapshot = await getDocs(kalenderRef);

  return snapshot.docs.map(d => {

    let warna = "#3b82f6"; // biru default

    if (d.data().kategori === "Ujian") warna = "#ef4444";
    if (d.data().kategori === "Libur") warna = "#22c55e";

    return {
      id: d.id,
      title: d.data().judul,
      start: d.data().tanggal,
      backgroundColor: warna,
      borderColor: warna,
      extendedProps: {
        kategori: d.data().kategori,
        deskripsi: d.data().deskripsi
      }
    };
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", async () => {

  calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      initialView: "dayGridMonth",
      selectable: role === "admin",

      dateClick(info) {
        if (role !== "admin") return;
        document.getElementById("modalTanggal").value = info.dateStr;
        openModal();
      },

      eventClick(info) {
        const data = info.event.extendedProps;
        selectedEventId = info.event.id;

        document.getElementById("detailContent").innerHTML = `
          <strong>Judul:</strong> ${info.event.title}<br>
          <strong>Tanggal:</strong> ${info.event.startStr}<br>
          <strong>Kategori:</strong> ${data.kategori}<br>
          <strong>Deskripsi:</strong> ${data.deskripsi || "-"}
        `;

        if (role === "admin") {
          document.getElementById("deleteBtn").classList.remove("hidden");
          document.getElementById("deleteBtn").onclick = async () => {
            await deleteDoc(doc(db, "Kalender", selectedEventId));
            calendar.refetchEvents();
            closeDetail();
          };
        }

        openDetail();
      },

      events: async (fetchInfo, success) => {
        const events = await fetchEvents();
        success(events);
      }
    }
  );

  calendar.render();
});

// ================= MODAL =================
window.openModal = () =>
  document.getElementById("eventModal").classList.remove("hidden");

window.closeModal = () =>
  document.getElementById("eventModal").classList.add("hidden");

window.openDetail = () =>
  document.getElementById("detailModal").classList.remove("hidden");

window.closeDetail = () =>
  document.getElementById("detailModal").classList.add("hidden");

// ================= SAVE =================
window.saveEvent = async function () {

  const judul = document.getElementById("modalJudul").value;
  const tanggal = document.getElementById("modalTanggal").value;
  const kategori = document.getElementById("modalKategori").value;
  const deskripsi = document.getElementById("modalDeskripsi").value;

  if (!judul || !tanggal) {
    alert("Judul dan tanggal wajib diisi");
    return;
  }

  await addDoc(kalenderRef, {
    judul,
    tanggal,
    kategori,
    deskripsi
  });

  closeModal();
  calendar.refetchEvents();
};
