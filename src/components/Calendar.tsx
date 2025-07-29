'use client';

import React, { useState } from 'react';
import BookingModal from './BookingModal';

// Define um tipo para o horário selecionado
interface SelectedSlot {
  day: string;
  hour: string;
}
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
  //ESTADOS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  //FUNÇÕES
  const handleSlotClick = (day: string, hour: string) => {
    setSelectedSlot({ day, hour });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleConfirmBooking = (title: string) => {
    if (selectedSlot) {
      alert(`Reunião "${title}" agendada para ${selectedSlot.day} às ${selectedSlot.hour}!`);
    }
    handleCloseModal();
  };
  
  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center">
        <div className="font-bold"></div>
        {days.map((day) => (
          <div key={day} className="font-bold py-2">{day}</div>
        ))}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="font-bold pr-2 text-right">{hour}</div>
            {days.map((day) => (
                <div
                    key={`${day}-${hour}`}
                    className="bg-green-100 h-16 border border-gray-200 rounded-md hover:bg-green-200 cursor-pointer transition-colors"
                    // Atualizamos o onClick para chamar nossa nova função
                    onClick={() => handleSlotClick(day, hour)}
                >
                    {/* Espaço para o nome do evento */}
                </div>
                ))}
            </React.Fragment>
            ))}
        </div>
        {/* Renderizamos o Modal aqui */}
        <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmBooking}
            day={selectedSlot?.day || ''}
            hour={selectedSlot?.hour || ''}
        />
    </>
  );
}

