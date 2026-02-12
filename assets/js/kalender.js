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

let selectedDate = null;
let selectedEventId = null;

// ================= LOAD EVENTS =================
async function fetchEvents() {
  const snapshot = await getDocs(kalenderRef);

  return snapshot.docs.map(d => ({
    id: d.id,
    title: d.data().judul,
    start: d.data().tanggal,
    extendedProps: {
      kategori: d.data().kategori,
      deskripsi: d.data().deskripsi
    }
  }));
}

document.addEventListener("DOMContentLoaded", async () => {

  const calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      initialView: "dayGridMonth",
      selectable: role === "admin",

      dateClick(info) {
        if (role !== "admin") return;
        selectedDate = info.dateStr;
        document.getElementById("modalTanggal").value = selectedDate;
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
            calendar.refetchawait deleteDoc(doc(db, "Kalender", selectedEventId));
closeDetail();
location.reload();
Events();
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

// ================= MODAL CONTROL =================
window.openModal = () => {
  const modal = document.getElementById("eventModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeModal = () => {
  const modal = document.getElementById("eventModal");
  modal.classList.remove("flex");
  modal.classList.add("hidden");
};

window.openDetail = () => {
  const modal = document.getElementById("detailModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeDetail = () => {
  const modal = document.getElementById("detailModal");
  modal.classList.remove("flex");
  modal.classList.add("hidden");
};


// ================= SAVE EVENT =================
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
selectedDate = null;
location.reload(); // sementara biar aman

};
