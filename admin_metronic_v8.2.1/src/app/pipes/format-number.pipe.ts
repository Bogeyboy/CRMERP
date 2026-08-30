import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true  // ✅ Para usarlo en componentes standalone
})
export class FormatNumberPipe implements PipeTransform {
  
  transform(value: number | string | null | undefined, decimals = 2): string
  {
    // Validar que el valor existe y es un número válido
    if (value === null || value === undefined || value === '')
    {
      return '0,00';
    }
    
    // Convertir a número si es string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Validar que es un número
    if (isNaN(numValue) || !isFinite(numValue))
    {
      return '0,00';
    }
    
    // Formatear con decimales
    const fixedValue = numValue.toFixed(decimals);
    const parts = fixedValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '00';
    
    // Agregar separadores de miles (puntos)
    const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Retornar con coma decimal
    return `${integerWithSeparators},${decimalPart}`;
  }
}