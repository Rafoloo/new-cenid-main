import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
    });

    if (!consultation) {
      return NextResponse.json({ message: 'Consulta não encontrada' }, { status: 404 });
    }

    return NextResponse.json(consultation, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar consulta:', error);
    return NextResponse.json({ message: 'Erro ao buscar consulta' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const updatedConsultation = await prisma.consultation.update({
      where: { id: params.id },
      data: {
        statusConsulta: body.statusConsulta,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedConsultation, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    return NextResponse.json({ message: 'Erro ao atualizar consulta' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.consultation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar consulta:', error);
    return NextResponse.json({ message: 'Erro ao deletar consulta' }, { status: 500 });
  }
}