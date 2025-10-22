// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// 🔧 تنظیمات REAL Firebase پروژه شما
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

// توابع مدیریت محصولات
export const productsAPI = {
    async getProducts() {
        try {
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
                    images: Array.isArray(data.images) ? data.images.join(', ') : (data.images || ''),
                    colors: Array.isArray(data.colors) ? data.colors.join(', ') : (data.colors || ''),
                    sizes: Array.isArray(data.sizes) ? data.sizes.join(', ') : (data.sizes || ''),
                    createdAt: data.createdAt || new Date().toISOString()
                });
            });
            return products;
        } catch (error) {
            console.error("Error getting products: ", error);
            throw error;
        }
    },

    async addProduct(productData) {
        try {
            const processedData = {
                name: productData.name,
                price: parseInt(productData.price),
                category: productData.category,
                description: productData.description || '',
                inStock: Boolean(productData.inStock),
                images: productData.images ? productData.images.split(',').map(img => img.trim()).filter(img => img) : [],
                colors: productData.colors ? productData.colors.split(',').map(c => c.trim()).filter(c => c) : [],
                sizes: productData.sizes ? productData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "products"), processedData);
            return { id: docRef.id, ...processedData };
        } catch (error) {
            console.error("Error adding product: ", error);
            throw error;
        }
    },

    async deleteProduct(productId) {
        try {
            await deleteDoc(doc(db, "products", productId));
            return true;
        } catch (error) {
            console.error("Error deleting product: ", error);
            throw error;
        }
    },

    async updateProduct(productId, productData) {
        try {
            const processedData = {
                name: productData.name,
                price: parseInt(productData.price),
                category: productData.category,
                description: productData.description || '',
                inStock: Boolean(productData.inStock),
                images: productData.images ? productData.images.split(',').map(img => img.trim()).filter(img => img) : [],
                colors: productData.colors ? productData.colors.split(',').map(c => c.trim()).filter(c => c) : [],
                sizes: productData.sizes ? productData.sizes.split(',').map(s => s.trim()).filter(s => s) : []
            };

            await updateDoc(doc(db, "products", productId), processedData);
            return { id: productId, ...processedData };
        } catch (error) {
            console.error("Error updating product: ", error);
            throw error;
        }
    }
};

window.productsAPI = productsAPI;