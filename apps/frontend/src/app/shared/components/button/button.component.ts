import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="'btn btn-' + variant"
      [disabled]="disabled || isLoading"
      (click)="onClick.emit($event)">
      <span *ngIf="isLoading" class="spinner"></span>
      <ng-content *ngIf="!isLoading"></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      width: 100%;
      padding: 0.85rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.95rem;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: var(--transition);
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--accent-purple));
      color: var(--text-primary);
      box-shadow: 0 4px 15px var(--primary-glow);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px var(--primary-glow);
    }
    .btn-secondary {
      background: var(--bg-surface);
      color: var(--text-primary);
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover:not(:disabled) {
      background: var(--accent-purple);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(227, 227, 227, 0.3);
      border-radius: 50%;
      border-top-color: var(--text-primary);
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() onClick = new EventEmitter<Event>();
}