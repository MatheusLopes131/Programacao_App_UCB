export function calcularHorasSono(dormir, acordar) {
    const minDormir = dormir.getHours() * 60 + dormir.getMinutes();
    const minAcordar = acordar.getHours() * 60 + acordar.getMinutes();
    let diff = minAcordar - minDormir;
    if (diff < 0) diff += 24 * 60;
    return diff / 60;
  }
  
  export function formatarHoras(horas) {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return h + 'h ' + String(m).padStart(2, '0') + 'min';
  }