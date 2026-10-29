import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// En Hamburguesas ALO, los "productos" están divididos en módulos específicos:
// Ingredientes, Carnes, Precios y Populares.
// Este componente genérico no aplica.

@Component({
  selector: 'app-productos-crud',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding:2rem; max-width:600px; margin:0 auto;">
      <h2 style="font-family:'Bebas Neue',sans-serif; font-size:2rem; color:var(--neon-blue); margin-bottom:1rem;">Catálogo de Productos</h2>
      <p style="color:var(--texto-secondary); margin-bottom:1.5rem;">
        En Hamburguesas ALO el catálogo está dividido en secciones específicas:
      </p>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <a routerLink="/admin/ingredientes" style="display:flex; align-items:center; gap:0.75rem; padding:1rem 1.25rem; background:var(--bg-card); border:1px solid rgba(57,255,20,0.2); border-radius:12px; text-decoration:none; color:var(--texto-primary); transition:border-color 0.2s;"
          onmouseenter="this.style.borderColor='rgba(57,255,20,0.5)'" onmouseleave="this.style.borderColor='rgba(57,255,20,0.2)'">
          <span style="font-size:1.5rem;">🥗</span>
          <div>
            <p style="font-weight:700;">Ingredientes</p>
            <p style="font-size:0.8rem; color:var(--texto-muted);">Queso, tocino, jalapeños, aguacate…</p>
          </div>
        </a>
        <a routerLink="/admin/carnes" style="display:flex; align-items:center; gap:0.75rem; padding:1rem 1.25rem; background:var(--bg-card); border:1px solid rgba(255,45,155,0.2); border-radius:12px; text-decoration:none; color:var(--texto-primary); transition:border-color 0.2s;"
          onmouseenter="this.style.borderColor='rgba(255,45,155,0.5)'" onmouseleave="this.style.borderColor='rgba(255,45,155,0.2)'">
          <span style="font-size:1.5rem;">🥩</span>
          <div>
            <p style="font-weight:700;">Tipos de Carne</p>
            <p style="font-size:0.8rem; color:var(--texto-muted);">Arrachera, res, sirlón, pastor…</p>
          </div>
        </a>
        <a routerLink="/admin/precios" style="display:flex; align-items:center; gap:0.75rem; padding:1rem 1.25rem; background:var(--bg-card); border:1px solid rgba(255,140,0,0.2); border-radius:12px; text-decoration:none; color:var(--texto-primary); transition:border-color 0.2s;"
          onmouseenter="this.style.borderColor='rgba(255,140,0,0.5)'" onmouseleave="this.style.borderColor='rgba(255,140,0,0.2)'">
          <span style="font-size:1.5rem;">💰</span>
          <div>
            <p style="font-weight:700;">Precios</p>
            <p style="font-size:0.8rem; color:var(--texto-muted);">Hot-Dog, Hamburguesa Chica/Grande, Taco…</p>
          </div>
        </a>
        <a routerLink="/admin/populares" style="display:flex; align-items:center; gap:0.75rem; padding:1rem 1.25rem; background:var(--bg-card); border:1px solid rgba(0,212,255,0.2); border-radius:12px; text-decoration:none; color:var(--texto-primary); transition:border-color 0.2s;"
          onmouseenter="this.style.borderColor='rgba(0,212,255,0.5)'" onmouseleave="this.style.borderColor='rgba(0,212,255,0.2)'">
          <span style="font-size:1.5rem;">⭐</span>
          <div>
            <p style="font-weight:700;">Populares / Combos</p>
            <p style="font-size:0.8rem; color:var(--texto-muted);">Productos destacados prearmados</p>
          </div>
        </a>
      </div>
    </div>
  `
})
export class ProductosCrudComponent {}
