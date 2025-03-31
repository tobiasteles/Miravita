// Importe os módulos necessários do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEb1g1NWV0sW1KWYf1ZSe1IyQEzHGZbzg",
  authDomain: "firebornmmo.firebaseapp.com",
  databaseURL: "https://firebornmmo-default-rtdb.firebaseio.com",
  projectId: "firebornmmo",
  storageBucket: "firebornmmo.firebasestorage.app",
  messagingSenderId: "680663551686",
  appId: "1:680663551686:web:fabfa865813f196a9491c7"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, ref, set, onValue, createUserWithEmailAndPassword, signInWithEmailAndPassword };