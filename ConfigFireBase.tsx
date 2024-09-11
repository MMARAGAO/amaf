import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrkyhNmqlYwB8m1lOTvyPyjuNvLMaLEz4",
  authDomain: "amaf-27051.firebaseapp.com",
  projectId: "amaf-27051",
  storageBucket: "amaf-27051.appspot.com",
  messagingSenderId: "454016935398",
  appId: "1:454016935398:web:fb0a4cd4594e0c8301e227",
  measurementId: "G-VYETQVJYNP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
