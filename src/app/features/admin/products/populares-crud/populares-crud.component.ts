import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ProductoPopular, CategoriaProducto } from '../../../../core/models/product.model';

@Component({
  selector: 'app-populares-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
<div class="p-4 md:p-6">
  <div class="flex items-center justify-between mb-6">
    <h2 class="font-bebas text-3xl text-neon-blue tracking-widest">⭐ Productos Populares</h2>
    <button class="btn-neon px-4 py-2 rounded-lg text-sm font-bold" (click)="openCreate()">
      + Nuevo Popular
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    @for (item of fb.allPopulares(); track item.id) {
      <div class="card-base p-4 flex flex-col gap-2">
        @if (item.imageUrl) {
          <img [src]="item.imageUrl" class="w-full h-32 object-cover rounded-lg" />
        }
        <p class="font-bold text-sm">{{ item.nombre }}</p>
        <p class="text-xs" style="color:var(--texto-muted)">{{ categoriaLabel(item.categoria) }}</p>
        <p class="text-xs" style="color:var(--texto-secondary)">{{ item.descripcion }}</p>
        <p class="text-xs" [style.color]="item.visible ? 'var(--neon-green)' : '#ef4444'">
          {{ item.visible ? '✅ Visible' : '❌ Oculto' }}
        </p>
        <div class="flex gap-1 mt-1">
          <button class="flex-1 text-xs py-1 rounded bg-[var(--bg-surface)] border border-[var(--neon-blue)]/20 hover:border-[var(--neon-blue)]/60 transition-colors"
            (click)="openEdit(item)">Editar</button>
          <button class="flex-1 text-xs py-1 rounded bg-[var(--bg-surface)] border border-red-800/40 hover:border-red-500/60 text-red-400 transition-colors"
            (click)="delete(item)">Borrar</button>
        </div>
      </div>
    }
  </div>

  @if (modalOpen()) {
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.85);">
      <div class="card-base p-6 w-full max-w-md neon-glow overflow-y-auto" style="max-height:90vh;">
        <h3 class="font-bebas text-2xl text-neon-blue mb-4">
          {{ editingItem() ? 'Editar' : 'Nuevo' }} Popular
        </h3>

        <form [formGroup]="form" class="flex flex-col gap-3">
          <input type="text" placeholder="Nombre del producto" formControlName="nombre" />
          <input type="text" placeholder="Descripción breve" formControlName="descripcion" />

          <select formControlName="categoria">
            <option value="hotdog">🌭 Hot-Dog</option>
            <option value="hamburguesa">🍔 Hamburguesa</option>
            <option value="taco">🌮 Taco</option>
          </select>

          <div>
            <label class="block text-sm font-bold mb-1" style="color:var(--texto-secondary)">Imagen</label>
            <div class="flex gap-2 mb-2">
              <button type="button" (click)="uploadMode.set('url')"
                [style.color]="uploadMode() === 'url' ? 'var(--neon-blue)' : 'var(--texto-muted)'"
                class="text-xs font-bold border-b-2 pb-0.5 transition-colors"
                [style.borderColor]="uploadMode() === 'url' ? 'var(--neon-blue)' : 'transparent'">URL</button>
              <button type="button" (click)="uploadMode.set('file')"
                [style.color]="uploadMode() === 'file' ? 'var(--neon-blue)' : 'var(--texto-muted)'"
                class="text-xs font-bold border-b-2 pb-0.5 transition-colors"
                [style.borderColor]="uploadMode() === 'file' ? 'var(--neon-blue)' : 'transparent'">Subir archivo</button>
            </div>
            @if (uploadMode() === 'url') {
              <input type="url" placeholder="URL de imagen" formControlName="imageUrl" />
            } @else {
              <input type="file" accept="image/*" (change)="onFileChange($event)"
                style="font-size:0.8rem; padding:0.3rem;" />
              @if (uploading()) {
                <p class="text-xs mt-1" style="color:var(--neon-blue);">Subiendo imagen...</p>
              }
            }
          </div>

          <input type="number" placeholder="Orden (1, 2, 3...)" formControlName="orden" />

          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" formControlName="visible" class="w-4 h-4 accent-cyan-400" />
            Visible en la página
          </label>
        </form>

        <div class="flex gap-3 mt-5">
          <button class="flex-1 btn-neon py-2 rounded-lg font-bold"
            (click)="save()" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Guardando...' : 'Guardar' }}
          </button>
          <button class="flex-1 py-2 rounded-lg font-bold border border-[var(--neon-blue)]/30 hover:border-[var(--neon-blue)]/60 transition-colors"
            (click)="closeModal()">Cancelar</button>
        </div>
      </div>
    </div>
  }
</div>
  `
})
export class PopularesCrudComponent {
  fb      = inject(FirebaseService);   // public — usado en template
  private storage = inject(StorageService);

  fb2         = this.fb; // alias para template (legacy)
  modalOpen   = signal(false);
  editingItem = signal<ProductoPopular | null>(null);
  uploading   = signal(false);
  saving      = signal(false);
  uploadMode  = signal<'url' | 'file'>('url');

  form = new FormGroup({
    nombre:      new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    categoria:   new FormControl<CategoriaProducto>('hamburguesa', Validators.required),
    imageUrl:    new FormControl(''),
    visible:     new FormControl(true),
    orden:       new FormControl(1),
  });

  categoriaLabel(cat: CategoriaProducto): string {
    const map: Record<CategoriaProducto, string> = {
      hotdog: '🌭 Hot-Dog', hamburguesa: '🍔 Hamburguesa', taco: '🌮 Taco'
    };
    return map[cat] ?? cat;
  }

  openCreate(): void {
    this.form.reset({ visible: true, nombre: '', descripcion: '', categoria: 'hamburguesa', imageUrl: '', orden: this.fb.allPopulares().length + 1 });
    this.editingItem.set(null);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  openEdit(item: ProductoPopular): void {
    this.form.patchValue({
      nombre: item.nombre,
      descripcion: item.descripcion,
      categoria: item.categoria,
      imageUrl: item.imageUrl,
      visible: item.visible,
      orden: item.orden,
    });
    this.editingItem.set(item);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  closeModal(): void { this.modalOpen.set(false); }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    try {
      const url = await this.storage.uploadImage(file, 'populares');
      this.form.patchValue({ imageUrl: url });
    } finally { this.uploading.set(false); }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      const data = {
        nombre:      this.form.value.nombre?.trim() ?? '',
        descripcion: this.form.value.descripcion?.trim() ?? '',
        categoria:   this.form.value.categoria ?? 'hamburguesa',
        imageUrl:    this.form.value.imageUrl?.trim() ?? '',
        visible:     this.form.value.visible ?? true,
        orden:       this.form.value.orden ?? 0,
        ingredientesIds: [],
        precioId: '',
        tipoCarne: '',
      };
      if (this.editingItem()) {
        await this.fb.update('populares', this.editingItem()!.id, data);
      } else {
        await this.fb.add('populares', data);
      }
      this.closeModal();
    } finally { this.saving.set(false); }
  }

  async delete(item: ProductoPopular): Promise<void> {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;
    await this.fb.delete('populares', item.id);
  }
}
