import Calendar from '../components/Calendar';

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Agenda da Sala de Reunião
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Clique em um horário livre para agendar sua reunião.
        </p>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        {/* Nosso componente de calendário virá aqui */}
        <Calendar />
      </div>

      <footer className="text-center text-gray-400 mt-8">
        <p>Desenvolvido com ❤️</p>
      </footer>
    </main>
  );
}