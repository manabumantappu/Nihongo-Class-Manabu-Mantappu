const tbody = document.getElementById("rekap");
const emailInput = document.getElementById("filterEmail");
const dateInput = document.getElementById("filterDate");

let data = JSON.parse(localStorage.getItem("presensiData")) || [];

function render(list) {
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="p-4 text-center text-gray-500">
          Data tidak ditemukan
        </td>
      </tr>`;
    return;
  }

  list.forEach(d => {
    tbody.innerHTML += `
      <tr class="border-t">
        <td class="p-2">${d.email}</td>
        <td class="p-2 text-center">${d.waktu}</td>
        <td class="p-2 text-center">${d.status}</td>
      </tr>`;
  });
}

function applyFilter() {
  let filtered = [...data];

  const email = emailInput.value.trim().toLowerCase();
  const date = dateInput.value; // format yyyy-mm-dd

  if (email) {
    filtered = filtered.filter(d =>
      d.email.toLowerCase().includes(email)
    );
  }

  if (date) {
    filtered = filtered.filter(d =>
      d.waktu.includes(date)
    );
  }

  render(filtered);
}

function resetFilter() {
  emailInput.value = "";
  dateInput.value = "";
  render(data);
}

function clearData() {
  if (confirm("Yakin hapus semua data presensi?")) {
    localStorage.removeItem("presensiData");
    data = [];
    render(data);
  }
}

// render awal
render(data);
