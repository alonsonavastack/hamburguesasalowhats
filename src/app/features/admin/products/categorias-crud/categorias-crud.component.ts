import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { Categoria } from '../../../../core/models/product.model';

@Component({
  selector: 'app-categorias-crud',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-4 md:p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-bebas text-3xl text-neon-blue tracking-widest">🏷️ Categorías</h2>
        <button class="btn-neon px-4 py-2 rounded-lg text-sm font-bold" (click)="openNew()">
          + Nueva Categoría
        </button>
      </div>

      <p class="text-sm text-[var(--texto-muted)] mb-4">
        Las categorías definen los tipos de productos (Hamburguesa, Hot-Dog, Taco…).
        Se usan en ingredientes, carnes y precios. Puedes agregar todas las que necesites.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        @for (cat of fb.allCategorias(); track cat.id) {
          <div class="card-base p-4 flex flex-col gap-2">
            <div class="text-3xl text-center">{{ cat.emoji }}</div>
            <p class="text-center font-bold text-sm">{{ cat.nombre }}</p>
            <p class="text-center text-xs text-[var(--texto-muted)]">{{ cat.slug }}</p>
            <p class="text-center text-xs" [style.color]="cat.activa ? 'var(--neon-green)' : '#ef4444'">
              {{ cat.activa ? '✅ Activa' : '❌ Inactiva' }}
            </p>
            <div class="flex gap-1 mt-1">
              <button
                class="flex-1 text-xs py-1 rounded bg-[var(--bg-surface)] border border-[var(--neon-blue)]/20 hover:border-[var(--neon-blue)]/60 transition-colors"
                (click)="edit(cat)">Editar</button>
              <button
                class="flex-1 text-xs py-1 rounded bg-[var(--bg-surface)] border border-red-800/40 hover:border-red-500/60 text-red-400 transition-colors"
                (click)="delete(cat)">Borrar</button>
            </div>
          </div>
        }

        @if (fb.allCategorias().length === 0) {
          <div class="col-span-full text-center text-[var(--texto-muted)] py-12">
            <div class="text-5xl mb-3">🏷️</div>
            <p>No hay categorías aún. ¡Crea la primera!</p>
          </div>
        }
      </div>

      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.85)">
          <div class="card-base p-6 w-full max-w-md neon-glow">
            <h3 class="font-bebas text-2xl text-neon-blue mb-4">
              {{ editing() ? 'Editar' : 'Nueva' }} Categoría
            </h3>
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-[var(--texto-muted)]">Nombre</label>
                <input type="text" placeholder="ej: Hamburguesa" [(ngModel)]="form.nombre"
                  (ngModelChange)="autoSlug()" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-[var(--texto-muted)]">Emoji</label>
                <input type="text" placeholder="ej: 🍔" [(ngModel)]="form.emoji" maxlength="4" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-[var(--texto-muted)]">
                  Slug <span class="font-normal">(identificador único, sin espacios)</span>
                </label>
                <input type="text" placeholder="ej: hamburguesa" [(ngModel)]="form.slug"
                  style="font-family: monospace;" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-[var(--texto-muted)]">Orden</label>
                <input type="number" placeholder="1, 2, 3…" [(ngModel)]="form.orden" min="0" />
              </div>
              <label class="flex items-center gap-2 text-sm cursor-pointer mt-1">
                <input type="checkbox" [(ngModel)]="form.activa" class="w-4 h-4 accent-cyan-400" />
                Activa
              </label>
            </div>

            @if (errorMsg()) {
              <p class="text-red-400 text-sm mt-3">⚠️ {{ errorMsg() }}</p>
            }

            <div class="flex gap-3 mt-5">
              <button class="flex-1 btn-neon py-2 rounded-lg font-bold" (click)="save()" [disabled]="saving()">
                {{ saving() ? 'Guardando...' : 'Guardar' }}
              </button>
              <button
                class="flex-1 py-2 rounded-lg font-bold border border-[var(--neon-blue)]/30 hover:border-[var(--neon-blue)]/60 transition-colors"
                (click)="closeModal()">Cancelar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CategoriasCrudComponent {
  fb = inject(FirebaseService);

  showModal = signal(false);
  editing   = signal<Categoria | null>(null);
  saving    = signal(false);
  errorMsg  = signal('');

  form: { nombre: string; emoji: string; slug: string; orden: number; activa: boolean } = {
    nombre: '', emoji: '', slug: '', orden: 1, activa: true,
  };

  openNew() {
    this.editing.set(null);
    this.errorMsg.set('');
    this.form = { nombre: '', emoji: '', slug: '', orden: this.fb.allCategorias().length + 1, activa: true };
    this.showModal.set(true);
  }

  edit(cat: Categoria) {
    this.editing.set(cat);
    this.errorMsg.set('');
    this.form = { nombre: cat.nombre, emoji: cat.emoji, slug: cat.slug, orden: cat.orden ?? 0, activa: cat.activa };
    this.showModal.set(true);
  }

  autoSlug() {
    if (!this.editing()) {
      this.form.slug = this.form.nombre
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    }
  }

  closeModal() { this.showModal.set(false); }

  async save() {
    this.errorMsg.set('');
    if (!this.form.nombre.trim()) { this.errorMsg.set('El nombre es obligatorio.'); return; }
    if (!this.form.slug.trim())   { this.errorMsg.set('El slug es obligatorio.'); return; }
    if (!this.form.emoji.trim())  { this.errorMsg.set('El emoji es obligatorio.'); return; }

    const slugExiste = this.fb.allCategorias().some(
      c => c.slug === this.form.slug.trim() && c.id !== this.editing()?.id
    );
    if (slugExiste) { this.errorMsg.set('Ya existe una categoría con ese slug.'); return; }

    this.saving.set(true);
    try {
      const data = {
        nombre: this.form.nombre.trim(),
        emoji:  this.form.emoji.trim(),
        slug:   this.form.slug.trim(),
        orden:  this.form.orden,
        activa: this.form.activa,
      };
      if (this.editing()) {
        await this.fb.update('categorias', this.editing()!.id, data);
      } else {
        await this.fb.add('categorias', data);
      }
      this.closeModal();
    } finally {
      this.saving.set(false);
    }
  }

  async delete(cat: Categoria) {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    await this.fb.delete('categorias', cat.id);
  }
}
