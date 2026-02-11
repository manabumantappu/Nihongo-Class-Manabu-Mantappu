function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email dan password wajib diisi");
    return;
  }

  let role = "siswa";
  if (email.includes("admin")) role = "admin";

  localStorage.setItem("login", "true");
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);

  if (role === "admin") {
    location.href = "admin/index.html";
  } else {
    location.href = "dashboard.html";
  }
}

// 🔥 INI YANG PENTING
window.logout = function() {
  localStorage.clear();
  location.href = "index.html";
};
