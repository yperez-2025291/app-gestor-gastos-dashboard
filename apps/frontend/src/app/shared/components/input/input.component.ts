import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-container">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <div class="input-wrapper" [class.has-error]="errorMessage">
        <input
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          class="custom-input" />
      </div>
      <span *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</span>
    </div>
  `,
  styles: [`
    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    .input-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .custom-input {
      width: 100%;
      padding: 0.85rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      transition: var(--transition);
    }
    .custom-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }
    .input-wrapper.has-error .custom-input {
      border-color: var(--danger);
    }
    .error-msg {
      font-size: 0.78rem;
      color: var(--danger);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessage: string | null = null;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void { this.value = val || ''; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}