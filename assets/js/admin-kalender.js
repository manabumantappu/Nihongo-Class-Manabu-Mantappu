import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
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

let calendar;
let editId = null;

function warnaKategori(kategori) {
  if (kategori === "Ujian") return "#ef4444";
  if (kategori === "Libur") return "#22c55e";
  return "#3b82f6";
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", async () => {

  calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      initialView: "dayGridMonth",
      selectable: true,

      dateClick(info) {
        editId = null;
        document.getElementById("modalTitle").textContent = "Tambah Event";
        document.getElementById("tanggal").value = info.dateStr;
        openModal();
      },

      eventClick(info) {
        editEvent(info.event.id);
      },

      events: async (fetchInfo, success) => {
        const snapshot = await getDocs(kalenderRef);
        const events = snapshot.docs.map(d => ({
          id: d.id,
          title: d.data().judul,
          start: d.data().tanggal,
          backgroundColor: warnaKategori(d.data().kategori),
          borderColor: warnaKategori(d.data().kategori)
        }));
        success(events);
      }
    }
  );

  calendar.render();
  loadTable();
});

// ================= TABLE =================
async function loadTable() {
  const snapshot = await getDocs(kalenderRef);
  const tbody = document.getElementById("eventTable");
  tbody.innerHTML = "";

  snapshot.forEach(d => {
    const data = d.data();
    tbody.innerHTML += `
      <tr class="border-t">
        <td class="p-3">${data.judul}</td>
        <td class="p-3 text-center">${data.tanggal}</td>
        <td class="p-3 text-center">${data.kategori}</td>
        <td class="p-3 text-center space-x-2">
          <button onclick="editEvent('${d.id}')"
            class="bg-yellow-500 text-white px-3 py-1 rounded text-xs">
            Edit
          </button>
          <button onclick="hapusEvent('${d.id}')"
            class="bg-red-600 text-white px-3 py-1 rounded text-xs">
            Hapus
          </button>
        </td>
      </tr>
    `;
  });
}

// ================= EDIT =================
window.editEvent = async function(id) {
  const snapshot = await getDocs(kalenderRef);
  const docData = snapshot.docs.find(d => d.id === id);
  if (!docData) return;

  const data = docData.data();

  editId = id;
  document.getElementById("modalTitle").textContent = "Edit Event";
  document.getElementById("judul").value = data.judul;
  document.getElementById("tanggal").value = data.tanggal;
  document.getElementById("kategori").value = data.kategori;
  document.getElementById("deskripsi").value = data.deskripsi || "";

  openModal();
};

// ================= SAVE =================
window.saveEvent = async function() {

  const judul = document.getElementById("judul").value;
  const tanggal = document.getElementById("tanggal").value;
  const kategori = document.getElementById("kategori").value;
  const deskripsi = document.getElementById("deskripsi").value;

  if (!judul || !tanggal) {
    alert("Judul & tanggal wajib diisi");
    return;
  }

  if (editId) {
    await updateDoc(doc(db, "Kalender", editId), {
      judul, tanggal, kategori, deskripsi
    });
  } else {
    await addDoc(kalenderRef, {
      judul, tanggal, kategori, deskripsi
    });
  }

  closeModal();
  calendar.refetchEvents();
  loadTable();
};

// ================= DELETE =================
window.hapusEvent = async function(id) {
  if (!confirm("Yakin hapus event?")) return;
  await deleteDoc(doc(db, "Kalender", id));
  calendar.refetchEvents();
  loadTable();
};

// ================= MODAL =================
window.openModal = () =>
  document.getElementById("eventModal").classList.remove("hidden");

window.closeModal = () =>
  document.getElementById("eventModal").classList.add("hidden");
