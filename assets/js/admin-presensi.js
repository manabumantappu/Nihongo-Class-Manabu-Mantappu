const tbody = document.getElementById("rekap");
const data = JSON.parse(localStorage.getItem("presensiData")) || [];

function render() {
  tbody.innerHTML = "";
  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="p-4 text-center text-gray-500">
          Belum ada data presensi
        </td>
      </tr>`;
    return;
  }

  data.forEach(d => {
    tbody.innerHTML += `
      <tr class="border-t">
        <td class="p-2">${d.email}</td>
        <td class="p-2 text-center">${d.waktu}</td>
        <td class="p-2 text-center">${d.status}</td>
      </tr>`;
  });
}

function clearData() {
  if (confirm("Yakin hapus semua data presensi?")) {
    localStorage.removeItem("presensiData");
    location.reload();
  }
}

render();
