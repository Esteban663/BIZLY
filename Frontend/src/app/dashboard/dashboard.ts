import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MetricCard {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  sub: string;
  subType: 'up' | 'warn' | 'danger' | 'neutral';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  cards: MetricCard[] = [
    { label: 'Ventas de Hoy',           value: '$4,000.00', icon: 'ti-currency-dollar', iconBg: '#E1F5EE', iconColor: '#1D9E75', sub: '▲ 12% vs ayer',       subType: 'up' },
    { label: 'Productos Vendidos',       value: '2',         icon: 'ti-package',         iconBg: '#E6F1FB', iconColor: '#185FA5', sub: 'unidades hoy',         subType: 'neutral' },
    { label: 'Artículos con Stock Bajo', value: '1',         icon: 'ti-alert-triangle',  iconBg: '#FAEEDA', iconColor: '#BA7517', sub: 'Requiere reposición',   subType: 'warn' },
    { label: 'Ganancias Totales',        value: '$4,000.00', icon: 'ti-trending-up',     iconBg: '#E1F5EE', iconColor: '#1D9E75', sub: '▲ este mes',           subType: 'up' },
  ];
}