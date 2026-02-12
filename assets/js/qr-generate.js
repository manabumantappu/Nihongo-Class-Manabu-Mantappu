function getToday() {
  return new Date().toISOString().split("T")[0];
}

window.generateQR = function() {

  const token = {
    tanggal: getToday(),
    kelas: "JP-NIHONGO"
  };

  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: JSON.stringify(token),
    width: 250,
    height: 250
  });
};
