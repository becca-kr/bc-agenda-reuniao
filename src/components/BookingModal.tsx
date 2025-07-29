'use client' ;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void; // fecha o modal
  onConfirm: (title: string) => void; // confirma a reserva
  day: string; // dia selecionado
  hour: string; // hora selecionada
}