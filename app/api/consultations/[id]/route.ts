import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultationId = params.id;
    
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            email: true,
          },
        },
      },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultationId = params.id;
    const body = await request.json();

    // Validações básicas
    if (!body.statusConsulta) {
      return NextResponse.json({ message: 'statusConsulta é obrigatório' }, { status: 400 });
    }

    const updatedConsultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        dataConsulta: body.dataConsulta,
        horaConsulta: body.horaConsulta,
        duracaoConsulta: body.duracaoConsulta,
        tipoConsulta: body.tipoConsulta,
        especialidade: body.especialidade,
        profissional: body.profissional,
        motivoConsulta: body.motivoConsulta,
        sintomasRelatados: body.sintomasRelatados,
        statusConsulta: body.statusConsulta,
        prioridade: body.prioridade,
        ultimaGlicemia: body.ultimaGlicemia,
        ultimaHemoglobina: body.ultimaHemoglobina,
        medicamentos: body.medicamentos,
        alergias: body.alergias,
        precisaAcompanhante: body.precisaAcompanhante,
        nomeAcompanhante: body.nomeAcompanhante,
        telefoneAcompanhante: body.telefoneAcompanhante,
        salaAtendimento: body.salaAtendimento,
        consultaRemota: body.consultaRemota,
        linkConsultaRemota: body.linkConsultaRemota,
        enviarLembreteEmail: body.enviarLembreteEmail,
        enviarLembreteSMS: body.enviarLembreteSMS,
        observacoes: body.observacoes,
        updatedAt: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedConsultation, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    return NextResponse.json({ message: 'Erro ao atualizar consulta' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultationId = params.id;
    
    await prisma.consultation.delete({
      where: { id: consultationId },
    });

    return NextResponse.json({ message: 'Consulta removida com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir consulta:', error);
    return NextResponse.json({ message: 'Erro ao excluir consulta' }, { status: 500 });
  }
}