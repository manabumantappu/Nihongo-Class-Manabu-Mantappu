const masukBtn = document.getElementById("masuk");
const pulangBtn = document.getElementById("pulang");
const table = document.getElementById("table");

const KEY = "presensiData";
const batas = "09:05";

function getData() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function now() {
  const d = new Date();
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toTimeString().slice(0, 5)
  };
}

function render() {
  table.innerHTML = "";
  getData().forEach(r => {
    table.innerHTML += `
      <tr class="border-t">
        <td>${r.date}</td>
        <td>${r.masuk || "-"}</td>
        <td>${r.pulang || "-"}</td>
        <td>${r.status}</td>
      </tr>`;
  });
}

masukBtn?.addEventListener("click", () => {
  const data = getData();
  const { date, time } = now();

  if (data.find(d => d.date === date)) {
    alert("Sudah absen masuk");
    return;
  }

  const status = time <= batas ? "Hadir" : "Telat";

  data.unshift({
    date,
    masuk: time,
    pulang: "",
    status
  });

  saveData(data);
  render();
});

pulangBtn?.addEventListener("click", () => {
  const data = getData();
  const { date, time } = now();

  const today = data.find(d => d.date === date);
  if (!today) {
    alert("Belum absen masuk");
    return;
  }

  if (today.pulang) {
    alert("Sudah absen pulang");
    return;
  }

  today.pulang = time;
  saveData(data);
  render();
});

render();
