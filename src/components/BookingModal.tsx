'use client' ;

import { on } from "events";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void; // fecha o modal
  onConfirm: (title: string) => void; // confirma a reserva
  day: string; // dia selecionado
  hour: string; // hora selecionada
}

export default function BookingModal({ isOpen, onClose, onConfirm, day, hour }: BookingModalProps){
    if (!isOpen) 
        return null;

    // Envio do formulário
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        if (title) {
            onConfirm(title);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
            {/* O card do modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Agendar Reunião</h2>
                <p className="text-gray-500 mb-4">
                Você está agendando para: <span className="font-semibold">{day}, às {hour}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-500 mb-1">
                        Nome da Reunião / Responsável
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                        placeholder="Ex: Reunião de Marketing"
                    />

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300"
                        >
                        Cancelar
                        </button>
                        <button
                        type="submit"
                        className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-400"
                        >
                        Confirmar Agendamento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
