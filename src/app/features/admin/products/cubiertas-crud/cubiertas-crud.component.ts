import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// NOTA: Cubiertas no aplica en Hamburguesas ALO.
// Este módulo existía en Fresas ALO. Aquí se redirige a Ingredientes.

@Component({
  selector: 'app-cubiertas-crud',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding:2rem; text-align:center;">
      <p style="color:var(--texto-muted); margin-bottom:1rem;">
        Las "cubiertas" no aplican en Hamburguesas ALO.<br>
        Gestiona los ingredientes desde la sección <strong style="color:var(--neon-blue)">Ingredientes</strong>.
      </p>
      <a routerLink="/admin/ingredientes" class="btn-neon" style="display:inline-block; padding:0.6rem 1.5rem; border-radius:8px; text-decoration:none;">
        Ir a Ingredientes
      </a>
    </div>
  `
})
export class CubiertasCrudComponent {}
