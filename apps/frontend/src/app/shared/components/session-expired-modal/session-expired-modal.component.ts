import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired-modal.component.html',
  styleUrl: './session-expired-modal.component.css'
})
export class SessionExpiredModalComponent {
  @Input() isVisible: boolean = false;
  @Output() onLoginAgain = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  relogin(): void {
    this.onLoginAgain.emit();
  }

  close(): void {
    this.onCancel.emit();
  }
}