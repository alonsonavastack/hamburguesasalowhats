/**
 * SEED FIRESTORE — Hamburguesas ALO
 * ──────────────────────────────────
 * Corre con:
 *   cd ~/Desktop/hamnurguesasAlo
 *   npm run seed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDavRcB4DHxIB2f5zsW2jXZXbf7g37teQw",
  authDomain: "menu-5d081.firebaseapp.com",
  databaseURL: "https://menu-5d081-default-rtdb.firebaseio.com",
  projectId: "menu-5d081",
  storageBucket: "menu-5d081.firebasestorage.app",
  messagingSenderId: "60185344139",
  appId: "1:60185344139:web:7a23d47b28cc332c07bc8e"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── Credenciales del admin (solo para el seed) ────────────────────
const ADMIN_EMAIL    = 'alonso.nava086@gmail.com';
const ADMIN_PASSWORD = '123456';

const ingredientes = [
  { name: 'Cheddar',               emoji: '🧀', imageUrl: '', available: true, order: 1,  categorias: ['hotdog','hamburguesa','taco'] },
  { name: 'Jalapeños',             emoji: '🌶️', imageUrl: '', available: true, order: 2,  categorias: ['hotdog','hamburguesa','taco'] },
  { name: 'Cebolla caramelizada',  emoji: '🧅', imageUrl: '', available: true, order: 3,  categorias: ['hotdog','hamburguesa','taco'] },
  { name: 'Tocino',                emoji: '🥓', imageUrl: '', available: true, order: 4,  categorias: ['hamburguesa','taco'] },
  { name: 'Aguacate',              emoji: '🥑', imageUrl: '', available: true, order: 5,  categorias: ['hamburguesa','taco'] },
  { name: 'Jitomate',              emoji: '🍅', imageUrl: '', available: true, order: 6,  categorias: ['hotdog','hamburguesa','taco'] },
  { name: 'Lechuga',               emoji: '🥬', imageUrl: '', available: true, order: 7,  categorias: ['hamburguesa'] },
  { name: 'Mayonesa',              emoji: '🥄', imageUrl: '', available: true, order: 8,  categorias: ['hotdog','hamburguesa','taco'] },
  { name: 'Mostaza',               emoji: '💛', imageUrl: '', available: true, order: 9,  categorias: ['hotdog','hamburguesa'] },
  { name: 'Ketchup',               emoji: '🍅', imageUrl: '', available: true, order: 10, categorias: ['hotdog','hamburguesa'] },
  { name: 'Salsa picante',         emoji: '🔥', imageUrl: '', available: true, order: 11, categorias: ['hotdog','hamburguesa','taco'] },
  { name: 'Pepinillos',            emoji: '🥒', imageUrl: '', available: true, order: 12, categorias: ['hotdog','hamburguesa'] },
  { name: 'Chile de árbol',        emoji: '🌶️', imageUrl: '', available: true, order: 13, categorias: ['taco'] },
  { name: 'Cilantro',              emoji: '🌿', imageUrl: '', available: true, order: 14, categorias: ['taco'] },
  { name: 'Cebolla blanca',        emoji: '🧅', imageUrl: '', available: true, order: 15, categorias: ['taco'] },
  { name: 'Queso Oaxaca',          emoji: '🧀', imageUrl: '', available: true, order: 16, categorias: ['taco'] },
];

const carnes = [
  { name: 'Res',               emoji: '🥩', available: true, categorias: ['hamburguesa'] },
  { name: 'Pollo',             emoji: '🍗', available: true, categorias: ['hamburguesa','taco'] },
  { name: 'Mixta (Res+Pollo)', emoji: '🍖', available: true, categorias: ['hamburguesa'] },
  { name: 'Pastor',            emoji: '🌮', available: true, categorias: ['taco'] },
  { name: 'Suadero',           emoji: '🥩', available: true, categorias: ['taco'] },
  { name: 'Barbacoa',          emoji: '🫕', available: true, categorias: ['taco'] },
  { name: 'Bistec',            emoji: '🥩', available: true, categorias: ['taco'] },
];

const precios = [
  { categoria: 'hotdog',      label: 'Sencillo',  precio: 45,  available: true },
  { categoria: 'hotdog',      label: 'Con queso', precio: 55,  available: true },
  { categoria: 'hotdog',      label: 'Especial',  precio: 65,  available: true },
  { categoria: 'hamburguesa', label: 'Sencilla',  precio: 70,  available: true },
  { categoria: 'hamburguesa', label: 'Doble',     precio: 95,  available: true },
  { categoria: 'hamburguesa', label: 'Triple',    precio: 120, available: true },
  { categoria: 'hamburguesa', label: 'Especial',  precio: 110, available: true },
  { categoria: 'taco',        label: 'x1 taco',  precio: 20,  available: true },
  { categoria: 'taco',        label: 'x3 tacos', precio: 55,  available: true },
  { categoria: 'taco',        label: 'x5 tacos', precio: 85,  available: true },
];

const branding = {
  nombreNegocio: 'Hamburguesas ALO',
  logoUrl: '',
  telefono: '527181043376',
  direccion: 'Tu ciudad, México',
  horario: 'Mar-Dom 14:00 - 22:00',
  tacosActivos: true,
  instagramUrl: ''
};

async function seed() {
  console.log('🍔 Iniciando seed de Hamburguesas ALO...\n');

  console.log('🔐 Autenticando admin...');
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('  ✅ Sesión iniciada\n');

  console.log('📦 Subiendo ingredientes...');
  for (const ing of ingredientes) {
    const ref = await addDoc(collection(db, 'ingredientes'), ing);
    console.log(`  ✅ ${ing.emoji} ${ing.name} → ${ref.id}`);
  }

  console.log('\n🥩 Subiendo carnes...');
  for (const carne of carnes) {
    const ref = await addDoc(collection(db, 'carnes'), carne);
    console.log(`  ✅ ${carne.emoji} ${carne.name} → ${ref.id}`);
  }

  console.log('\n🏷️  Subiendo precios...');
  for (const precio of precios) {
    const ref = await addDoc(collection(db, 'precios'), precio);
    console.log(`  ✅ ${precio.categoria} · ${precio.label} · $${precio.precio} → ${ref.id}`);
  }

  console.log('\n⚙️  Configurando branding...');
  await setDoc(doc(db, 'config', 'branding'), branding);
  console.log('  ✅ Branding guardado');

  console.log('\n🎉 ¡Seed completado!\n');
  console.log('➡️  Ve a Firebase Console → Authentication → Agregar usuario admin.');
  console.log('➡️  Copia el UID y ve a /admin/empleados para registrarlo con rol "admin".\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
