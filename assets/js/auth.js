function login() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Masukkan email");
    return;
  }

  let role = "siswa";
  if (email.includes("guru")) role = "guru";
  if (email.includes("admin")) role = "admin";

  localStorage.setItem("auth", JSON.stringify({
    email,
    role
  }));

  // redirect
  if (role === "admin") {
    location.href = "admin/index.html";
  } else {
    location.href = "dashboard.html";
  }
}

function logout() {
  localStorage.clear();
  location.href = "../index.html";
}
