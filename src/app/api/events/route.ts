import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Função GET: Para buscar todos os agendamentos
export async function GET() {
  try {
    const bookings = await kv.get('bookings');
    return NextResponse.json(bookings || []);
  } catch (error) {
    return new NextResponse('Erro ao buscar agendamentos', { status: 500 });
  }
}

// Função POST: Para criar ou deletar um agendamento
export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    if (action === 'CREATE') {
      const currentBookings: any[] = (await kv.get('bookings')) || [];
      const newBookings = [...currentBookings, payload];
      await kv.set('bookings', newBookings);
      return NextResponse.json(payload);
    }

    if (action === 'DELETE') {
      const currentBookings: any[] = (await kv.get('bookings')) || [];
      const newBookings = currentBookings.filter(
        b => !(b.day === payload.day && b.hour === payload.hour)
      );
      await kv.set('bookings', newBookings);
      return new NextResponse(null, { status: 204 }); // Sucesso, sem conteúdo
    }

    return new NextResponse('Ação inválida', { status: 400 });

  } catch (error) {
    return new NextResponse('Erro ao salvar agendamento', { status: 500 });
  }
}