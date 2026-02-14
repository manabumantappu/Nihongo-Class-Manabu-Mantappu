import { initializeApp, getApps } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWe_8KQh5J5gzgKYDWnzNKiw-y1Vj3908",
  authDomain: "jp-nihongo-class.firebaseapp.com",
  projectId: "jp-nihongo-class",
  storageBucket: "jp-nihongo-class.appspot.com",
  messagingSenderId: "102563702284",
  appId: "1:102563702284:web:9a5166a4f7450127647029"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

export { db };
