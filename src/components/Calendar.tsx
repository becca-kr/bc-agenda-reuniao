'use client'; // Essencial para componentes que usam interatividade

import React from 'react';

// Dados da agenda
// Dias da semana e horários fixos para simplificação
const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const hours = Array.from({ length: (18 - 8) * 2 + 1 }, (_, i) => {
  const totalMinutes = i * 30 + 8 * 60; // Total de minutos desde a meia-noite
  const hour = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minute = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
});

export default function Calendar() {
  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {/* Cabeçalho de Horários (célula vazia) */}
      <div className="font-bold"></div>

      {/* Cabeçalho dos Dias da Semana */}
      {days.map((day) => (
        <div key={day} className="font-bold py-2">
          {day}
        </div>
      ))}

      {/* Grid da Agenda */}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          {/* Coluna de Horários */}
          <div className="font-bold pr-2 text-right">{hour}</div>

          {/* Células de Agendamento (uma para cada dia) */}
          {days.map((day) => (
            <div
              key={`${day}-${hour}`}
              className="bg-green-100 h-16 border border-gray-200 rounded-md hover:bg-green-200 cursor-pointer transition-colors"
              onClick={() => alert(`Você clicou em ${day} às ${hour}`)}
            >
              {/* Espaço para o nome do evento no futuro */}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}