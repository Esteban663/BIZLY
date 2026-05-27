export interface Movimiento {
  id?: number; // El ID es opcional porque al crear uno nuevo, PostgreSQL lo genera solo
  monto: number | null;
  descripcion: string;
  categoria: string;
  referencia?: string;
  fecha: string;
  tipo?: 'INGRESO' | 'EGRESO'; // Propiedad auxiliar para diferenciar el flujo en la UI
}

export interface MetricCard {
  label: string;
  value: string | number;
  sub: string;
  tagClass: string;
}