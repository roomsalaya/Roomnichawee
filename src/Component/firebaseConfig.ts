import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// กำหนดค่าของ Firebase สำหรับเว็บแอปของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyBV1zfZd4vmzDczjVgPgEVEUHpCE_igUTU",
    authDomain: "newroom-76a50.firebaseapp.com",
    projectId: "newroom-76a50",
    storageBucket: "newroom-76a50.appspot.com",
    messagingSenderId: "321915333016",
    appId: "1:321915333016:web:504716e934036d3e6be3ed",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ส่งออก
export { auth, db, doc, getDoc, storage }; // ตรวจสอบว่ามี doc ถูกส่งออก