// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD2wC2PKSCegoiACgCKcR3s5io9cLuxmn0",
  authDomain: "explorerai-de956.firebaseapp.com",
  projectId: "explorerai-de956",
  storageBucket: "explorerai-de956.appspot.com",
  messagingSenderId: "655607572855",
  appId: "1:655607572855:web:08c2a80830329145e0d972"
};

const app = initializeApp(firebaseConfig);

export { app };