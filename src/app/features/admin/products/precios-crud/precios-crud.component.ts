import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { PrecioProducto, CategoriaProducto, Categoria } from '../../../../core/models/product.model';

@Component({
  selector: 'app-precios-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './precios-crud.component.html',
})
export class PreciosCrudComponent {
  fb = inject(FirebaseService);

  // Todos los precios (incluyendo inactivos) para el admin
  items = computed(() => this.fb.allPrecios());

  // Categorías dinámicas desde Firestore (todas, no solo activas)
  categorias = computed(() => this.fb.allCategorias());

  modalOpen   = signal(false);
  editingItem = signal<PrecioProducto | null>(null);
  saving      = signal(false);

  form = new FormGroup({
    categoria: new FormControl<CategoriaProducto>('', Validators.required),
    label:     new FormControl('', Validators.required),
    precio:    new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    available: new FormControl(true),
  });

  // Obtiene la etiqueta con emoji de una categoría dado su slug
  categoriaLabel(slug: CategoriaProducto): string {
    const cat = this.fb.allCategorias().find(c => c.slug === slug);
    return cat ? `${cat.emoji} ${cat.nombre}` : slug;
  }

  openCreate(): void {
    // Usa el slug de la primera categoría disponible como valor por defecto
    const primerSlug = this.categorias()[0]?.slug ?? '';
    this.form.reset({ categoria: primerSlug, label: '', precio: 0, available: true });
    this.editingItem.set(null);
    this.modalOpen.set(true);
  }

  openEdit(item: PrecioProducto): void {
    this.form.patchValue({
      categoria: item.categoria,
      label:     item.label,
      precio:    item.precio,
      available: item.available,
    });
    this.editingItem.set(item);
    this.modalOpen.set(true);
  }

  closeModal(): void { this.modalOpen.set(false); }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      const data = {
        categoria: this.form.value.categoria ?? '',
        label:     this.form.value.label?.trim() ?? '',
        precio:    this.form.value.precio ?? 0,
        available: this.form.value.available ?? true,
      };
      if (this.editingItem()) {
        await this.fb.update('precios', this.editingItem()!.id, data);
      } else {
        await this.fb.add('precios', data);
      }
      this.closeModal();
    } finally { this.saving.set(false); }
  }

  async delete(item: PrecioProducto): Promise<void> {
    if (!confirm(`¿Eliminar "${item.label}"?`)) return;
    await this.fb.delete('precios', item.id);
  }
}
