import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-data',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './card-data.component.html',
  styleUrl: './card-data.component.css'
})
export class CardDataComponent {
  @Input() title: string = '';
  @Input() amount: number = 0;
}