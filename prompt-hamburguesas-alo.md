# 🍔 PROMPT — Hamburguesas ALO
## Proyecto Angular 21 completo con Firebase + Tailwind + Signals + PWA

> **Última actualización:** 26 de abril de 2026 — refleja el estado real del proyecto en producción.

---

## ⚙️ Stack tecnológico

- **Angular 21.2** con standalone components, **100% Signals** (sin RxJS en componentes).
- **PWA (Progressive Web App)** configurada para ser instalable e incluir soporte offline.
- **Firebase 11** (Firestore + Auth + Storage) — sin AngularFire, usando SDK modular directamente.
- **Tailwind CSS 4** con PostCSS.
- **Chart.js + ng2-charts** para analíticas.
- **WhatsApp Web API** (`wa.me`) para el envío de pedidos.
- **IndexedDB** nativo para pedidos offline con sincronización atómica anti-duplicados.
- **Anime.js** para animaciones.
- Deploy en **Netlify** (Netlify Drop) — `netlify.toml` con headers CSP configurados.
- **Sin librerías de UI externas** — solo CSS personalizado con variables de neón.

---

## 📦 `package.json` — dependencias exactas

```json
{
  "dependencies": {
    "@angular/common": "^21.2.4",
    "@angular/compiler": "^21.2.4",
    "@angular/core": "^21.2.4",
    "@angular/forms": "^21.2.4",
    "@angular/platform-browser": "^21.2.4",
    "@angular/router": "^21.2.4",
    "@angular/service-worker": "^21.2.4",
    "@tailwindcss/postcss": "^4.1.11",
    "chart.js": "^4.4.2",
    "firebase": "^11.10.0",
    "ng2-charts": "^6.0.1",
    "postcss": "^8.5.6",
    "rxjs": "~7.8.0",
    "tailwindcss": "^4.1.11",
    "tslib": "^2.3.0"
  }
}
```

---

## 🔥 Firebase — credenciales activas

```typescript
// src/environments/environment.ts y environment.prod.ts
export const environment = {
  production: false, // true en prod
  firebase: {
    apiKey: "AIzaSyDavRcB4DHxIB2f5zsW2jXZXbf7g37teQw",
    authDomain: "menu-5d081.firebaseapp.com",
    databaseURL: "https://menu-5d081-default-rtdb.firebaseio.com",
    projectId: "menu-5d081",
    storageBucket: "menu-5d081.firebasestorage.app",
    messagingSenderId: "60185344139",
    appId: "1:60185344139:web:7a23d47b28cc332c07bc8e"
  },
  whatsappNumber: "527181043376"
};
```

**URL de producción:** `https://hamburguesasalo.netlify.app/`

---

## 🎨 Identidad visual

Logo: hamburguesa neón sobre fondo negro. Texto "HAMBURGUESAS" en magenta/rosa neón y "ALO" en azul cyan neón. Estilo letrero Las Vegas nocturno.

### Paleta de colores (`styles.css`)

```css
:root {
  --neon-blue:       #00d4ff;
  --neon-blue-light: #67e8f9;
  --neon-blue-dark:  #0891b2;
  --neon-blue-glow:  rgba(0, 212, 255, 0.4);
  --neon-green:      #39ff14;
  --neon-green-light:#86efac;
  --neon-green-dark: #16a34a;
  --neon-green-glow: rgba(57, 255, 20, 0.35);
  --neon-pink:       #ff2d9b;
  --neon-pink-light: #f9a8d4;
  --neon-pink-glow:  rgba(255, 45, 155, 0.35);
  --neon-orange:     #ff8c00;
  --neon-orange-glow:rgba(255, 140, 0, 0.35);
  --bg-base:         #050508;
  --bg-card:         #0d0d12;
  --bg-surface:      #14141c;
  --texto-primary:   #f0f9ff;
  --texto-secondary: rgba(240, 249, 255, 0.6);
  --texto-muted:     rgba(240, 249, 255, 0.35);
}
```

### Tipografía
- **`Bebas Neue`** — títulos, nombre del negocio, precios.
- **`Nunito`** — cuerpo, botones, etiquetas.

### Logo
- Archivo local: `public/logo-hamburguesas-alo.png` y `public/logo-hamburguesas-alo.ico`
- URL Cloudinary: `https://res.cloudinary.com/dmlespzah/image/upload/v1777146968/logo-hamburguesas-alo_xpvav7.png`
- El `logoUrl` se guarda en `config/branding.logoUrl` en Firestore (editable desde el admin).
- `og:image` en `index.html` apunta a `https://hamburguesasalo.netlify.app/logo-hamburguesas-alo.png`

---

## 🍔 Catálogo de Productos

### Categorías dinámicas
Las categorías se almacenan en Firestore (`categorias`) y son completamente configurables desde el admin (`/admin/categorias`). Cada categoría tiene: `slug`, `nombre`, `emoji`, `activa`, `orden`.

Categorías actuales:
- `hotdog` 🌭 Hot-Dogs
- `hamburguesa` 🍔 Hamburguesas  
- `taco` 🌮 Tacos *(activable/desactivable desde Configuraciones)*

### Ingredientes
CRUD completo desde `/admin/ingredientes`. Campos: `name`, `emoji`, `imageUrl`, `available`, `order`, `categorias: string[]` (slugs de categorías donde aparece).

### Tipos de Carne
CRUD completo desde `/admin/carnes`. Campos: `name`, `emoji`, `available`, `categorias: string[]`.

### Precios
CRUD completo desde `/admin/precios`. Campos: `categoria`, `label`, `precio`, `available`.

### Horarios de atención (hardcoded en el HTML del footer)
- 🔥 Al Carbón: Jueves, Viernes y Sábado — 7pm a 10pm
- 🍖 A la Parrilla: Lunes y Martes — 1pm a 10pm

---

## 🗄️ Modelos TypeScript (`product.model.ts`)

```typescript
export type CategoriaProducto = 'hotdog' | 'hamburguesa' | 'taco';

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  emoji: string;
  activa: boolean;
  orden: number;
}

export interface Ingrediente {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  available: boolean;
  order: number;
  categorias: string[];  // slugs dinámicos
  precios?: string[];    // filtro por precioId opcional
}

export interface TipoCarne {
  id: string;
  name: string;
  emoji: string;
  available: boolean;
  categorias: string[];  // slugs
  precios?: string[];    // filtro por precioId opcional
}

export interface PrecioProducto {
  id: string;
  categoria: string;     // slug dinámico
  label: string;
  precio: number;
  available: boolean;
}

export interface ProductoPopular {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;     // slug dinámico
  imageUrl: string;
  tipoCarne?: string;
  ingredientesIds: string[];
  precioId: string;
  visible: boolean;
  orden: number;
}

export interface ItemPedido {
  id: string;
  categoria: string;         // slug dinámico
  categoriaLabel: string;
  tipoCarne: string;
  tipoCarneName: string;
  precioId: string;
  precio: number;
  precioLabel: string;
  ingredientes: string[];
  ingredienteNames: string[];
  cantidad: number;
  notas: string;
}

export type PedidoStatus =
  | 'pendiente' | 'recibido' | 'en_preparacion'
  | 'listo' | 'entregado' | 'cancelado';

export interface Pedido {
  id: string;
  localId?: string;          // presente cuando fue sincronizado desde offline
  nombreCliente: string;
  telefonoCliente: string;
  items: ItemPedido[];
  totalItems: number;
  totalPrecio: number;
  timestamp: Date;
  mensaje: string;
  status?: PedidoStatus;
  tipo: 'whatsapp' | 'mostrador';
}

export type CategoriaGasto = 'Insumos' | 'Empaques' | 'Servicios' | 'Sueldos' | 'Otros';

export interface Gasto {
  id: string;
  monto: number;
  concepto: string;
  categoria: CategoriaGasto;
  timestamp: Date;
  notas?: string;
}

export interface Visita {
  id: string;
  timestamp: Date;
}

export type Role = 'admin' | 'empleado' | 'inactivo';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: Role;
}

export interface ConfigBranding {
  nombreNegocio: string;
  logoUrl: string;
  telefono: string;
  direccion: string;
  horario: string;
  dias: string;
  tacosActivos: boolean;
  instagramUrl?: string;
}
```

---

## 🗂️ Colecciones Firestore

| Colección | Contenido |
|---|---|
| `categorias` | Categorías dinámicas (hotdog, hamburguesa, taco) |
| `ingredientes` | Toppings/ingredientes por categoría |
| `carnes` | Tipos de carne por categoría |
| `precios` | Precios por categoría y tamaño |
| `populares` | Combos/productos destacados |
| `pedidos` | Historial de órdenes — campo `localId?` para deduplicación offline |
| `gastos` | Gastos del negocio |
| `visits` | Timestamps de visitas |
| `config/branding` | logoUrl, telefono, direccion, horario, tacosActivos |
| `config/stats` | contador de visitas |
| `usuarios` | Roles RBAC (admin/empleado/inactivo) |

### Reglas Firestore publicadas
```
categorias, ingredientes, carnes, precios, populares, config → read: true, write: isAdmin()
pedidos → create: true, read/update: isEmpleado(), delete: isAdmin()
gastos → read/write: isAdmin()
visits → create: true, read: isEmpleado()
usuarios → read: isSignedIn() && (propio || isAdmin()), write: isAdmin()
```

---

## 📱 Flujo del cliente (Página principal `/`)

1. **Hero** — Logo centrado + título con gradiente neón + subtítulo
2. **Sección "Los más pedidos"** — Grid 2 columnas con populares de Firestore
3. **Datos del cliente** — Nombre * (requerido) y Teléfono (opcional). El configurador de producto está COLAPSADO hasta que el cliente ingresa su nombre.
4. **Tabs de categoría** — Se muestran solo las categorías activas desde Firestore
5. **Configurador** — Precio/tamaño → Carne → Ingredientes (todos activos por default, desmarca para quitar) → Cantidad → Notas
6. **Carrito** — Items con subtotales, edición de cantidad, botón quitar
7. **Botón flotante "Pedir por WhatsApp"** (sticky footer, verde WhatsApp)
8. **Footer** — Horarios hardcoded + QR apuntando a `https://hamburguesasalo.netlify.app/`

### Formato mensaje WhatsApp
```
🍔 *HAMBURGUESAS ALO*
──────────────────
👤 *Cliente:* Juan Pérez
📱 *Tel:* 8181234567

🍔 *Hamburguesa x1* — $125
   🥩 Arrachera
   ✅ Queso Oaxaca, Tocino, Jitomate
   📝 Bien cocida

──────────────────
💰 *TOTAL: $125*
⏰ 26/04/2026 7:41 PM
```

> **Nota:** El emoji de categoría usa fallback `?? '🍽️'` para categorías dinámicas fuera del set hardcodeado.

---

## 🚀 Módulos del Admin

### Rutas
```
/admin/dashboard
/admin/pedidos
/admin/pos
/admin/finanzas
/admin/clientes
/admin/visitas
/admin/categorias
/admin/ingredientes
/admin/carnes
/admin/precios
/admin/populares
/admin/configuraciones
/admin/imprimir-menu
/admin/empleados
```

### Funcionalidades clave
- **POS:** Online → `status: 'entregado'`; Offline → `status: 'pendiente'` (aparece en Pedidos para que el empleado sepa qué preparar)
- **Pedidos:** Mezcla pedidos de Firestore + pedidos locales de IndexedDB. Badge `📴 LOCAL` en pedidos offline. Deduplicación por campo `localId` en Firestore.
- **Finanzas:** Ingresos (pedidos `entregado`/`listo`) vs Egresos (gastos manuales). Filtros: hoy/semana/mes/histórico/rango personalizado.
- **Clientes:** Agrupados por `telefonoCliente`, ordenados por total gastado.
- **Analytics:** Chart.js — visitas por hora (día individual) o por día (rango).
- **Configuraciones:** Datos de contacto + toggle Tacos on/off.
- **Dashboard:** Logo editable (URL o archivo), botón Descargar QR.

---

## 📱 OfflineSyncService — anti-duplicados

**IndexedDB:** `hamburguesasAlo_offline` → store `ventas_pendientes`

**Interfaz VentaOffline:**
```typescript
interface VentaOffline extends Omit<Pedido, 'id'> {
  localId: string;
  syncStatus: 'pendiente' | 'sincronizando' | 'sincronizado' | 'error';
  intentos: number;
}
```

**Flujo anti-duplicados:**
1. Al reconectar → `syncAll()` con `syncLock` booleano
2. Por cada pendiente → `marcarSincronizando()` (transacción atómica en IndexedDB)
3. Solo si marcado exitosamente → `fb.savePedido(data, localId)` (guarda `localId` en Firestore)
4. Borrar de IndexedDB
5. Si falla → `markError()` revierte a `pendiente`
6. `todosPedidos` en PedidosComponent deduplica comparando `localId` de locales vs campo `localId` en Firestore

---

## 🌐 Netlify — configuración

```toml
[build]
  command = "npm run build"
  publish = "dist/hamnurguesas-alo/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com https://firebasestorage.googleapis.com https://api.qrserver.com https://www.google.com https://lh3.googleusercontent.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com; frame-src 'none';"
```

---

## 📋 Reglas generales obligatorias

1. **100% Signals** — `signal()`, `computed()`, `effect()`. Cero `subscribe()` en componentes.
2. **Nueva sintaxis** — `@if`, `@for`, `@switch`.
3. **Standalone components** — Todo `standalone: true` con lazy loading.
4. **Sin `?.` innecesarios** — Evitar NG8107: no usar optional chain en tipos que no incluyen `null | undefined`.
5. **Categorías dinámicas** — No hardcodear slugs de categoría. Usar `fb.categorias()` y normalización de slugs (`normSlug`) para comparaciones tolerantes.
6. **Diseño premium oscuro** — Glassmorphism, bordes semitransparentes, sombras neón multicolor. Ambiente letrero Las Vegas nocturno.
7. **Modularidad** — Lógica en servicios, componentes solo consumen signals.

---

## 👤 Admin

- **Email:** `alonso.nava086@gmail.com`
- **Role:** `admin` en colección `usuarios/{uid}`
- **UID:** en Firebase Authentication proyecto `menu-5d081`

---

*Fin del prompt — Hamburguesas ALO · Producción: hamburguesasalo.netlify.app*
