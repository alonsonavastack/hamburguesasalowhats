import { Component, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuraciones.component.html'
})
export class ConfiguracionesComponent {
  public fb = inject(FirebaseService);

  direccion   = signal<string>('');
  telefono    = signal<string>('');
  horario     = signal<string>('');
  dias        = signal<string>('');
  saving      = signal<boolean>(false);
  savingTacos = signal<boolean>(false);
  showSuccess = signal<boolean>(false);

  private dataLoaded = false;

  constructor() {
    effect(() => {
      const current = this.fb.contactInfo();
      untracked(() => {
        if (!this.dataLoaded && (current.direccion || current.telefono || current.horario || current.dias)) {
          this.direccion.set(current.direccion || '');
          this.telefono.set(current.telefono   || '');
          this.horario.set(current.horario     || '');
          this.dias.set(current.dias           || '');
          this.dataLoaded = true;
        }
      });
    });
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.fb.saveContactInfo({
        direccion: this.direccion(),
        telefono:  this.telefono(),
        horario:   this.horario(),
        dias:      this.dias()
      });
      this.showSuccess.set(true);
      setTimeout(() => this.showSuccess.set(false), 3000);
    } catch (e) {
      console.error('Error guardando configuraciones', e);
      alert('Error al guardar las configuraciones');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleTacos(): Promise<void> {
    this.savingTacos.set(true);
    try {
      await this.fb.toggleTacos(!this.fb.tacosActivos());
    } catch (e) {
      console.error('Error toggling tacos', e);
    } finally {
      this.savingTacos.set(false);
    }
  }
}
