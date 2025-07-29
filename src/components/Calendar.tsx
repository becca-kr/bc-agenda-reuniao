'use client';

import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';

// Tipo para os dados de agendamento
interface Booking {
  day: string;
  hour: string;
  title: string;
}

// Tipo para o slot selecionado
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
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para buscar agendamentos ao montar o componente
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Falha ao buscar agendamentos:", error);
        alert("Não foi possível carregar os agendamentos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);


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
  const handleConfirmBooking = async (title: string) => {
    if (!selectedSlot) return;
    const newBooking: Booking = { ...selectedSlot, title };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', payload: newBooking }),
      });
      if (!response.ok) throw new Error('Falha ao salvar');
      
      setBookings([...bookings, newBooking]); // Atualiza a tela imediatamente
      handleCloseModal();

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o agendamento. Tente novamente.");
    }
  };

  // Função para deletar um agendamento
  const handleDeleteBooking = async (day: string, hour: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reunião?")) return;

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', payload: { day, hour } }),
      });
      if (!response.ok) throw new Error('Falha ao deletar');

      setBookings(bookings.filter(b => !(b.day === day && b.hour === hour)));
    } catch (error) {
      console.error(error);
      alert("Erro ao cancelar a reunião. Tente novamente.");
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Carregando agenda...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center">
        <div className="font-bold"></div>
        {days.map((day) => (
          <div key={day} className="font-bold py-2 text-gray-400">{day}</div>
        ))}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="font-bold pr-2 text-right text-gray-400">{hour}</div>

            {/* LÓGICA DE RENDERIZAÇÃO ATUALIZADA */}
            {days.map((day) => {
              // Procura se existe um agendamento para este dia e hora
              const booking = bookings.find(b => b.day === day && b.hour === hour);

              return (
                <div key={`${day}-${hour}`}>
                  {booking ? (
                    // Se houver agendamento, mostra o card de evento (azul)
                    <div className="bg-[#151E3D] text-white h-16 border border-transparent rounded-md p-2 text-left text-sm relative flex flex-col justify-center">
                    <span className="font-semibold break-words leading-tight">{booking.title}</span>
                    <button 
                      onClick={() => handleDeleteBooking(booking.day, booking.hour)}
                      className="absolute top-1 right-1 bg-[#B43D35] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-[#9c342d] transition-colors"
                    >
                      X
                    </button>
                  </div>
                  ) : (
                    // Se não houver, mostra o slot livre
                    <div
                      className="bg-[#80A9D2] h-16 border border-transparent rounded-md hover:bg-[#6c98c1] cursor-pointer transition-colors"
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

