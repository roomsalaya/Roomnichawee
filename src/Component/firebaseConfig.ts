import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// กำหนดค่าของ Firebase สำหรับเว็บแอปของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyCj6hYxlMJecV31KFv9_MNY0LYbuzteUvE",
    authDomain: "roomsalaya1.firebaseapp.com",
    projectId: "roomsalaya1",
    storageBucket: "roomsalaya1.appspot.com",
    messagingSenderId: "482437655803",
    appId: "1:482437655803:web:7c4721ad5fe6e1a09c945e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ส่งออก
export { auth, db, doc, getDoc, storage }; // ตรวจสอบว่ามี doc ถูกส่งออก
