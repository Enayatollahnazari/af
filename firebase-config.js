// firebase-config.js - نسخه اصلاح شده
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// تنظیمات Firebase شما
const firebaseConfig = {
    apiKey: "AIzaSyC45gz-4c1291AYxluEr1Ces3XfTGwCt7Q",
    authDomain: "mysite-c28a2.firebaseapp.com",
    projectId: "mysite-c28a2",
    storageBucket: "mysite-c28a2.firebasestorage.app",
    messagingSenderId: "96470005461",
    appId: "1:96470005461:web:d82d0a08ee127ccc55d45c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تابع برای بررسی اتصال
async function testFirebaseConnection() {
    try {
        console.log('🔥 Testing Firebase connection...');
        const testDoc = await addDoc(collection(db, "test"), {
            message: "Connection test",
            timestamp: new Date()
        });
        console.log('✅ Firebase connected successfully! Test ID:', testDoc.id);
        
        // حذف سند تست
        await deleteDoc(testDoc);
        return true;
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        return false;
    }
}

// توابع مدیریت محصولات
export const productsAPI = {
    async getProducts() {
        try {
            console.log('📦 Loading products from Firebase...');
            const querySnapshot = await getDocs(collection(db, "products"));
            const products = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                products.push({ 
                    id: doc.id, 
                    name: data.name || '',
                    price: data.price || 0,
                    category: data.category || '',
                    description: data.description || '',
                    inStock: data.inStock !== undefined ? data.inStock : true,
                    images: data.images || '',
                    colors: data.colors || '',
                    sizes: data.sizes || '',
                    createdAt: data.createdAt || new Date().toISOString()
                });
            });
            
            console.log(`✅ Loaded ${products.length} products from Firebase`);
            return products;
        } catch (error) {
            console.error("❌ Error loading products from Firebase:", error);
            throw new Error(`خطا در بارگذاری محصولات: ${error.message}`);
        }
    },

    async addProduct(productData) {
        try {
            console.log('➕ Adding product to Firebase...', productData);
            
            // اعتبارسنجی داده‌ها
            if (!productData.name || !productData.price || !productData.category) {
                throw new Error('نام، قیمت و دسته‌بندی اجباری هستند');
            }

            const productToSave = {
                name: productData.name.trim(),
                price: parseInt(productData.price),
                category: productData.category,
                description: (productData.description || '').trim(),
                inStock: Boolean(productData.inStock),
                images: (productData.images || '').trim(),
                colors: (productData.colors || '').trim(),
                sizes: (productData.sizes || '').trim(),
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "products"), productToSave);
            console.log('✅ Product added to Firebase with ID:', docRef.id);
            
            return { 
                id: docRef.id, 
                ...productToSave 
            };
        } catch (error) {
            console.error("❌ Error adding product to Firebase:", error);
            throw new Error(`خطا در افزودن محصول: ${error.message}`);
        }
    },

    async deleteProduct(productId) {
        try {
            console.log('🗑️ Deleting product from Firebase:', productId);
            await deleteDoc(doc(db, "products", productId));
            console.log('✅ Product deleted from Firebase');
            return true;
        } catch (error) {
            console.error("❌ Error deleting product from Firebase:", error);
            throw new Error(`خطا در حذف محصول: ${error.message}`);
        }
    },

    async updateProduct(productId, productData) {
        try {
            console.log('✏️ Updating product in Firebase:', productId);
            
            const productToUpdate = {
                name: productData.name.trim(),
                price: parseInt(productData.price),
                category: productData.category,
                description: (productData.description || '').trim(),
                inStock: Boolean(productData.inStock),
                images: (productData.images || '').trim(),
                colors: (productData.colors || '').trim(),
                sizes: (productData.sizes || '').trim()
            };

            await updateDoc(doc(db, "products", productId), productToUpdate);
            console.log('✅ Product updated in Firebase');
            
            return { 
                id: productId, 
                ...productToUpdate 
            };
        } catch (error) {
            console.error("❌ Error updating product in Firebase:", error);
            throw new Error(`خطا در به‌روزرسانی محصول: ${error.message}`);
        }
    }
};

// تست اتصال هنگام بارگذاری
testFirebaseConnection();

window.productsAPI = productsAPI;
console.log('🔥 Firebase config loaded successfully');
