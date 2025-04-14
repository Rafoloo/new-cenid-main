

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function GET() {
  try {
    const consultations = await db.consultation.findMany({
      include: {
        patient: true,
      },
    });
    
    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { message: 'Error fetching consultations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.patientId || !data.dataConsulta || !data.horaConsulta || !data.especialidade) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    const consultation = await db.consultation.create({
      data: {
        patientId: data.patientId,
        dataConsulta: data.dataConsulta,
        horaConsulta: data.horaConsulta,
        duracaoConsulta: data.duracaoConsulta,
        tipoConsulta: data.tipoConsulta,
        especialidade: data.especialidade,
        profissional: data.profissional,
        motivoConsulta: data.motivoConsulta,
        sintomasRelatados: data.sintomasRelatados || null,
        statusConsulta: data.statusConsulta,
        prioridade: data.prioridade,
        ultimaGlicemia: data.ultimaGlicemia || null,
        ultimaHemoglobina: data.ultimaHemoglobina || null,
        medicamentos: data.medicamentos || null,
        alergias: data.alergias || null,
        precisaAcompanhante: data.precisaAcompanhante,
        nomeAcompanhante: data.precisaAcompanhante ? data.nomeAcompanhante : null,
        telefoneAcompanhante: data.precisaAcompanhante ? data.telefoneAcompanhante : null,
        salaAtendimento: data.salaAtendimento || null,
        consultaRemota: data.consultaRemota,
        linkConsultaRemota: data.consultaRemota ? data.linkConsultaRemota : null,
        enviarLembreteEmail: data.enviarLembreteEmail,
        enviarLembreteSMS: data.enviarLembreteSMS,
        observacoes: data.observacoes || null,
      },
    });
    
    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { message: 'Error creating consultation', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}