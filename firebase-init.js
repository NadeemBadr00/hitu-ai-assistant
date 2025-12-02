import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// هذه الدالة الآن تقوم بإرجاع وعد (Promise) يتم حله بخدمات Firebase بعد تهيئتها
export async function initializeFirebase() {
    try {
        const response = await fetch('/__/firebase/init.json');
        if (!response.ok) {
            throw new Error('Failed to fetch Firebase config');
        }
        const firebaseConfig = await response.json();
        
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        console.log("Firebase initialized successfully.");
        // إرجاع الخدمات بعد التأكد من تهيئتها
        return { db, auth };

    } catch (e) {
        console.error('Could not load Firebase config or initialize Firebase.', e);
        // عرض رسالة خطأ واضحة للمستخدم في حالة فشل الاتصال
        document.body.innerHTML = '<div style="color: red; font-family: Cairo, sans-serif; text-align: center; padding: 50px; font-size: 1.2rem;">فشل الاتصال بقاعدة البيانات. الرجاء التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.</div>';
        // رفض الوعد (Promise) لإيقاف تنفيذ الكود
        return Promise.reject(e);
    }
}

