export function calcularHorasSono(dormir, acordar) {
  const d1 = new Date(dormir);
  const d2 = new Date(acordar);

  // Extrai apenas horas e minutos para comparar
  const horaDormir = d1.getHours() * 60 + d1.getMinutes();
  const horaAcordar = d2.getHours() * 60 + d2.getMinutes();

  // Se a hora de acordar for menor ou igual à de dormir,
  // significa que a pessoa dormiu antes da meia-noite e acordou no dia seguinte.
  if (horaAcordar <= horaDormir) {
    // Ancora o "acordar" para o dia seguinte em relação ao "dormir"
    d2.setDate(d1.getDate() + 1);
  } else {
    // Se for no mesmo dia (ex: dormiu 05:00, acordou 08:00), âncora ambos no mesmo dia
    d2.setDate(d1.getDate());
    d2.setMonth(d1.getMonth());
    d2.setFullYear(d1.getFullYear());
  }

  const diffMs = d2 - d1;
  const horas = diffMs / (1000 * 60 * 60);
  return horas;
}

export function formatarHoras(horas) {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${h}h ${m > 0 ? m + 'min' : ''}`.trim();
}