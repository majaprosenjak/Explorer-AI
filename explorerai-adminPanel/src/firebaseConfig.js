import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyD2wC2PKSCegoiACgCKcR3s5io9cLuxmn0",
  authDomain: "explorerai-de956.firebaseapp.com",
  projectId: "explorerai-de956",
  storageBucket: "explorerai-de956.appspot.com",
  messagingSenderId: "655607572855",
  appId: "1:655607572855:web:58d045d0d25cb635e0d972"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export { db };
