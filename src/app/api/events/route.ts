import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Definição do tipo Booking
interface Booking {
  day: string;
  hour: string;
  title: string;
}

type RequestBody =
  | { action: 'CREATE'; payload: Booking }
  | { action: 'DELETE'; payload: DeletePayload };

// Função GET: Para buscar todos os agendamentos
export async function GET() {
  try {
    const bookings = (await kv.get('bookings')) as Booking[] | null;
    return NextResponse.json(bookings || []);
  } catch {
    return new NextResponse('Erro ao buscar agendamentos', { status: 500 });
  }
}

// Função POST: Para criar ou deletar um agendamento
export async function POST(request: Request) {
  try {
    const { action, payload } = (await request.json()) as RequestBody;

    const currentBookings = ((await kv.get('bookings')) as Booking[]) || [];

    if (action === 'CREATE') {
      const newBookings = [...currentBookings, payload];
      await kv.set('bookings', newBookings);
      return NextResponse.json(payload);
    }

    if (action === 'DELETE') {
      const newBookings = currentBookings.filter(
        (b) => !(b.day === payload.day && b.hour === payload.hour)
      );
      await kv.set('bookings', newBookings);
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse('Ação inválida', { status: 400 });

  } catch {
    return new NextResponse('Erro ao salvar agendamento', { status: 500 });
  }
}