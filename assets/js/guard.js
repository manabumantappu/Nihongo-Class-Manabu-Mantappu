import { auth } from "./firebase.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // belum login → balik ke login
    location.href = "index.html";
  }
});
