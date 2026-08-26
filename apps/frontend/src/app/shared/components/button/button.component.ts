import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label: string = 'Boton';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() btnClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.isLoading) {
      this.btnClick.emit();
    }
  }
}