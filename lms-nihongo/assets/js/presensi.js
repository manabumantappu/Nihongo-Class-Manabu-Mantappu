const masuk = document.getElementById('masuk');
const pulang = document.getElementById('pulang');
const table = document.getElementById('table');

masuk.onclick = () => {
  table.innerHTML += `<tr><td>${new Date().toLocaleString()}</td><td>Masuk</td></tr>`;
};

pulang.onclick = () => {
  table.innerHTML += `<tr><td>${new Date().toLocaleString()}</td><td>Pulang</td></tr>`;
};
