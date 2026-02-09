import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "ISI_PUNYA_KAMU",
  authDomain: "ISI_PUNYA_KAMU",
  projectId: "ISI_PUNYA_KAMU",
  storageBucket: "ISI_PUNYA_KAMU",
  messagingSenderId: "ISI_PUNYA_KAMU",
  appId: "ISI_PUNYA_KAMU"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
