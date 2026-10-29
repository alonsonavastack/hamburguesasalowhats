import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-print-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-menu.component.html'
})
export class PrintMenuComponent {
  fb = inject(FirebaseService);

  printMenu() {
    window.print();
  }
}
