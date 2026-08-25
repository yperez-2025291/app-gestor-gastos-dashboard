import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="custom-card" [class.glass]="glass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .custom-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--glass-shadow);
      transition: var(--transition);
    }
    .custom-card.glass {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  `]
})
export class CardComponent {
  @Input() glass: boolean = true;
}