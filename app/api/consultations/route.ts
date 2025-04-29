import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        dataConsulta: "desc",
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { message: "Error fetching consultations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      patientId,
      dataConsulta,
      horaConsulta,
      duracaoConsulta,
      especialidade,
      profissional,
      motivoConsulta,
      statusConsulta = "Agendada", 
    } = body;

    if (
      !patientId ||
      !dataConsulta ||
      !horaConsulta ||
      !duracaoConsulta ||
      !especialidade ||
      !profissional ||
      !motivoConsulta
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "Agendada",
      "Confirmada",
      "EmAndamento",
      "Concluida",
      "Cancelada",
      "Remarcada",
    ];
    if (!validStatuses.includes(statusConsulta)) {
      return NextResponse.json(
        { message: "Invalid statusConsulta" },
        { status: 400 }
      );
    }

    const consultationData = {
      patientId: parseInt(patientId),
      dataConsulta: new Date(dataConsulta).toISOString(),
      horaConsulta,
      duracaoConsulta: parseInt(duracaoConsulta),
      especialidade,
      profissional,
      motivoConsulta,
      statusConsulta,
      sintomasRelatados: body.sintomasRelatados || null,
      ultimaGlicemia: body.ultimaGlicemia || null,
      ultimaHemoglobina: body.ultimaHemoglobina || null,
      precisaAcompanhante: body.precisaAcompanhante || false,
      nomeAcompanhante: body.nomeAcompanhante || null,
      telefoneAcompanhante: body.telefoneAcompanhante || null,
      observacoes: body.observacoes || null,
      tipoConsulta: body.tipoConsulta || 'Regular',
      prioridade: body.prioridade || 'Normal',
      consultaRemota: body.consultaRemota || false,
      enviarLembreteEmail: body.enviarLembreteEmail || false,
      enviarLembreteSMS: body.enviarLembreteSMS || false,
    };

    const newConsultation = await prisma.consultation.create({
      data: consultationData,
    });

    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      {
        message: "Error creating consultation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}