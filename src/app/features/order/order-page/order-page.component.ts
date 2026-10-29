import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { FirebaseService } from '../../../core/services/firebase.service';
import { OrderService } from '../../../core/services/order.service';
import { WhatsappService } from '../../../core/services/whatsapp.service';
import { OfflineSyncService } from '../../../core/services/offline-sync.service';
import {
  ItemPedido, TipoCarne,
  PrecioProducto, ProductoPopular,
} from '../../../core/models/product.model';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './order-page.component.html',
})
export class OrderPageComponent implements OnInit {
  fb      = inject(FirebaseService);
  order   = inject(OrderService);
  offline = inject(OfflineSyncService);
  private whatsapp = inject(WhatsappService);

  Math = Math;

  logoLoaded = false;
  logoError  = false;
  isSending  = false;

  tabActivo            = signal<string>('');
  selectedPrecio       = signal<PrecioProducto | null>(null);
  selectedCarne        = signal<TipoCarne | null>(null);
  selectedIngredientes = signal<string[]>([]);
  cantidad             = signal<number>(1);
  notasItem            = '';

  nombreCliente   = signal<string>('');
  telefonoCliente = signal<string>('');

  categoriasActivas = computed(() => this.fb.categorias());

  constructor() {
    // Inicializar tab con la primera categoría al cargar
    effect(() => {
      const cats = this.categoriasActivas();
      if (cats.length > 0 && !this.tabActivo()) {
        this.tabActivo.set(cats[0].slug);
        const ings = this.fb.ingredientes().filter(i =>
          Array.isArray(i.categorias) && i.categorias.length > 0 && i.categorias.includes(cats[0].slug)
        );
        this.selectedIngredientes.set(ings.map(i => i.id));
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.fb.incrementVisit();
    this.offline.forceSync();
  }

  onLogoLoad()  { this.logoLoaded = true; }
  onLogoError() { this.logoError = true; this.logoLoaded = true; }

  setTab(slug: string) {
    this.tabActivo.set(slug);
    this.selectedPrecio.set(null);
    this.selectedCarne.set(null);
    this.cantidad.set(1);
    this.notasItem = '';
    // Pre-seleccionar ingredientes del nuevo tab inmediatamente
    const ings = this.fb.ingredientes().filter(i =>
      Array.isArray(i.categorias) && i.categorias.length > 0 && i.categorias.includes(slug)
    );
    this.selectedIngredientes.set(ings.map(i => i.id));
  }

  categoriaActiva = computed(() =>
    this.categoriasActivas().find(c => c.slug === this.tabActivo()) ?? null
  );

  preciosDeTab = computed(() =>
    this.fb.precios().filter(p => p.categoria === this.tabActivo())
  );

  carnesDeTab = computed(() => {
    const precio = this.selectedPrecio();
    return this.fb.carnes().filter(c => {
      if (!c.categorias?.includes(this.tabActivo())) return false;
      // Si la carne tiene precios definidos, solo mostrarla si aplica al precio seleccionado
      if (c.precios && c.precios.length > 0 && precio) {
        return c.precios.includes(precio.id);
      }
      return true;
    });
  });

  ingredientesDeTab = computed(() => {
    const precio = this.selectedPrecio();
    return this.fb.ingredientes().filter(i => {
      if (!Array.isArray(i.categorias) || i.categorias.length === 0) return false;
      if (!i.categorias.includes(this.tabActivo())) return false;
      // Si el ingrediente tiene precios definidos, filtrar por precio seleccionado
      if (i.precios && i.precios.length > 0 && precio) {
        return i.precios.includes(precio.id);
      }
      return true;
    });
  });

  esHotdog = computed(() => this.tabActivo() === 'hotdog');

  puedeAgregar = computed(() => {
    if (!this.selectedPrecio()) return false;
    if (!this.esHotdog() && !this.selectedCarne()) return false;
    return true;
  });

  selectPrecio(p: PrecioProducto) {
    this.selectedPrecio.set(p);
    // Limpiar carne si ya no aplica al nuevo precio
    const carneActual = this.selectedCarne();
    if (carneActual) {
      const sigueDisponible = !carneActual.precios || carneActual.precios.length === 0 || carneActual.precios.includes(p.id);
      if (!sigueDisponible) this.selectedCarne.set(null);
    }
    // Re-seleccionar ingredientes filtrando por el nuevo precio
    const ings = this.fb.ingredientes().filter(i => {
      if (!Array.isArray(i.categorias) || !i.categorias.includes(this.tabActivo())) return false;
      if (i.precios && i.precios.length > 0) return i.precios.includes(p.id);
      return true;
    });
    this.selectedIngredientes.set(ings.map(i => i.id));
  }
  selectCarne(c: TipoCarne)       { this.selectedCarne.set(c); }

  toggleIngrediente(id: string) {
    this.selectedIngredientes.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  isIngredienteSelected(id: string) {
    return this.selectedIngredientes().includes(id);
  }

  agregarItem() {
    if (!this.puedeAgregar()) return;
    const precio     = this.selectedPrecio()!;
    const carne      = this.selectedCarne();
    const ingIds     = this.selectedIngredientes();
    const cat        = this.categoriaActiva();
    const ingNombres = this.ingredientesDeTab()
      .filter(i => ingIds.includes(i.id))
      .map(i => i.name);

    const item: ItemPedido = {
      id:               crypto.randomUUID(),
      categoria:        this.tabActivo(),
      categoriaLabel:   cat?.nombre ?? this.tabActivo(),
      tipoCarne:        carne?.id        ?? '',
      tipoCarneName:    carne?.name      ?? '',
      precioId:         precio.id,
      precio:           precio.precio,
      precioLabel:      precio.label,
      ingredientes:     [...ingIds],
      ingredienteNames: ingNombres,
      cantidad:         this.cantidad(),
      notas:            this.notasItem.trim(),
    };

    this.order.addItem(item);

    this.selectedPrecio.set(null);
    this.selectedCarne.set(null);
    this.cantidad.set(1);
    this.notasItem = '';
    // Re-seleccionar ingredientes del tab actual
    const ings = this.fb.ingredientes().filter(i =>
      Array.isArray(i.categorias) && i.categorias.length > 0 && i.categorias.includes(this.tabActivo())
    );
    this.selectedIngredientes.set(ings.map(i => i.id));
  }

  agregarPopular(pop: ProductoPopular) {
    const precio = this.fb.precios().find(p => p.id === pop.precioId);
    if (!precio) return;

    const cat = this.fb.categorias().find(c => c.slug === pop.categoria);

    const item: ItemPedido = {
      id:               crypto.randomUUID(),
      categoria:        pop.categoria,
      categoriaLabel:   cat?.nombre ?? pop.categoria,
      tipoCarne:        '',
      tipoCarneName:    '',
      precioId:         precio.id,
      precio:           precio.precio,
      precioLabel:      precio.label,
      ingredientes:     [],
      ingredienteNames: [],
      cantidad:         1,
      notas:            pop.nombre,
    };

    this.order.addItem(item);
  }

  emojiDeCategoria(slug: string): string {
    return this.fb.categorias().find(c => c.slug === slug)?.emoji ?? '🍽️';
  }

  get pedidoListo(): boolean {
    return (
      this.order.items().length > 0 &&
      this.order.items().every(i => i.precio > 0) &&
      this.nombreCliente().trim().length > 0
    );
  }

  updateCantidadItem(id: string, delta: number) {
    const item = this.order.items().find(i => i.id === id);
    if (!item) return;
    const nueva = Math.max(1, item.cantidad + delta);
    this.order.updateItem({ ...item, cantidad: nueva });
  }

  async enviarPedido() {
    if (!this.pedidoListo || this.isSending) return;
    this.isSending = true;
    try {
      const nombre  = this.nombreCliente().trim();
      const tel     = this.telefonoCliente().trim();
      const items   = this.order.items();
      const mensaje = this.whatsapp.buildMessage(nombre, tel, items);

      // IMPORTANTE: abrir WhatsApp de forma SÍNCRONA, dentro del mismo
      // gesto de clic del usuario. En iOS Safari, si hay un `await` antes
      // (p.ej. la escritura a Firestore), el navegador deja de considerarlo
      // una acción iniciada por el usuario y bloquea la apertura en silencio.
      this.whatsapp.send(nombre, tel, items);

      // El guardado en Firestore ya no bloquea la apertura de WhatsApp.
      // Si falla, no debe impedir que el pedido ya enviado se limpie de la UI.
      this.offline.checkout({
        nombreCliente:   nombre,
        telefonoCliente: tel,
        items,
        totalItems:      this.order.totalItems(),
        totalPrecio:     this.order.totalPrecio(),
        timestamp:       new Date(),
        mensaje,
        status:          'pendiente',
        tipo:            'whatsapp',
      }).catch(err => console.error('Error guardando pedido en Firestore:', err));

      this.order.reset();
      this.nombreCliente.set('');
      this.telefonoCliente.set('');
    } finally {
      this.isSending = false;
    }
  }
}
