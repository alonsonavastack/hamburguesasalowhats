import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// NOTA: Este módulo no aplica en Hamburguesas ALO.
// Los toppings/ingredientes se gestionan en /admin/ingredientes

@Component({
  selector: 'app-toppings-crud',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding:2rem; text-align:center;">
      <p style="color:var(--texto-muted); margin-bottom:1rem;">
        Este módulo no aplica en Hamburguesas ALO.<br>
        Los ingredientes se gestionan desde la sección <strong style="color:var(--neon-blue)">Ingredientes</strong>.
      </p>
      <a routerLink="/admin/ingredientes" class="btn-neon" style="display:inline-block; padding:0.6rem 1.5rem; border-radius:8px; text-decoration:none;">
        Ir a Ingredientes
      </a>
    </div>
  `
})
export class ToppingsCrudComponent {}
