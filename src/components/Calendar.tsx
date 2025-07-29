'use client';

import React, { useState } from 'react';
import BookingModal from './BookingModal';

// Tipo para um agendamento individual
interface Booking {
  day: string;
  hour: string;
  title: string;
}

// Tipo para o horário selecionado no clique
interface SelectedSlot {
  day: string;
  hour: string;
}

// Dados da agenda
// Dias da semana e horários
const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const hours = Array.from({ length: (18 - 8) * 2 + 1 }, (_, i) => {
  const totalMinutes = i * 30 + 8 * 60; // 8:00 AM é o início
  const hour = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minute = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
});

export default function Calendar() {
  //Estados do componente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);

  //Funções de manipulação de eventos
  const handleSlotClick = (day: string, hour: string) => {
    const isBooked = bookings.some(booking => booking.day === day && booking.hour === hour);
    if (isBooked) return;
    // Atualiza o estado com o horário selecionado e abre o modal
    setSelectedSlot({ day, hour });
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  // Função para confirmar a reserva
  // Aqui você pode adicionar lógica para salvar a reserva, por exemplo, enviando para um servidor
  const handleConfirmBooking = (title: string) => {
    if (selectedSlot) {
      const newBooking: Booking = {
        ...selectedSlot,
        title,
      };
      // Adiciona o novo agendamento à lista existente
      setBookings([...bookings, newBooking]);
    }
    handleCloseModal();
  };
  // Função para deletar um agendamento
  const handleDeleteBooking = (day: string, hour: string) => {
    // Filtra a lista, mantendo apenas os agendamentos que NÃO são o que queremos deletar
    setBookings(bookings.filter(booking => !(booking.day === day && booking.hour === hour)));
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
            
            {/* LÓGICA DE RENDERIZAÇÃO ATUALIZADA */}
            {days.map((day) => {
              // Procura se existe um agendamento para este dia e hora
              const booking = bookings.find(b => b.day === day && b.hour === hour);

              return (
                <div key={`${day}-${hour}`}>
                  {booking ? (
                    // Se houver agendamento, mostra o card de evento (azul)
                    <div className="bg-blue-200 h-16 border border-blue-300 rounded-md p-1 text-left text-sm relative flex flex-col justify-between">
                      <span className="font-semibold text-blue-900 break-words">{booking.title}</span>
                      <button 
                        onClick={() => handleDeleteBooking(booking.day, booking.hour)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    // Se não houver, mostra o slot livre (verde)
                    <div
                      className="bg-green-100 h-16 border border-gray-200 rounded-md hover:bg-green-200 cursor-pointer transition-colors"
                      onClick={() => handleSlotClick(day, hour)}
                    ></div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

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

