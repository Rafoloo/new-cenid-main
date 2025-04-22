import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

// Singleton para o Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Interface para os dados recebidos do frontend
interface ConsultationInput {
  patientId: number;
  dataConsulta: string;
  horaConsulta: string;
  duracaoConsulta: number;
  tipoConsulta: string;
  especialidade: string;
  profissional: string;
  motivoConsulta: string;
  sintomasRelatados?: string;
  statusConsulta: string;
  prioridade: string;
  ultimaGlicemia?: string;
  ultimaHemoglobina?: string;
  medicamentos?: string;
  alergias?: string;
  precisaAcompanhante: boolean;
  nomeAcompanhante?: string;
  telefoneAcompanhante?: string;
  salaAtendimento?: string;
  consultaRemota: boolean;
  linkConsultaRemota?: string;
  enviarLembreteEmail: boolean;
  enviarLembreteSMS: boolean;
  observacoes?: string;
}

export async function GET() {
  try {
    const consultations = await prisma.consultation.findMany({
      take: 100,
      skip: 0,
      select: {
        id: true,
        dataConsulta: true,
        horaConsulta: true,
        duracaoConsulta: true,
        tipoConsulta: true,
        especialidade: true,
        profissional: true,
        motivoConsulta: true,
        sintomasRelatados: true,
        statusConsulta: true,
        prioridade: true,
        ultimaGlicemia: true,
        ultimaHemoglobina: true,
        medicamentos: true,
        alergias: true,
        precisaAcompanhante: true,
        nomeAcompanhante: true,
        telefoneAcompanhante: true,
        salaAtendimento: true,
        consultaRemota: true,
        linkConsultaRemota: true,
        enviarLembreteEmail: true,
        enviarLembreteSMS: true,
        observacoes: true,
        createdAt: true,
        updatedAt: true,
        patientId: true,
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
    return NextResponse.json(consultations, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return NextResponse.json({ message: 'Erro ao buscar consultas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationInput = await request.json();

    // Validações básicas
    if (!body.patientId || isNaN(body.patientId)) {
      return NextResponse.json({ message: 'patientId é obrigatório e deve ser um número' }, { status: 400 });
    }
    if (!body.dataConsulta) {
      return NextResponse.json({ message: 'dataConsulta é obrigatória' }, { status: 400 });
    }
    if (!body.horaConsulta) {
      return NextResponse.json({ message: 'horaConsulta é obrigatória' }, { status: 400 });
    }
    if (!body.duracaoConsulta || isNaN(body.duracaoConsulta)) {
      return NextResponse.json({ message: 'duracaoConsulta é obrigatória e deve ser um número' }, { status: 400 });
    }
    if (!body.tipoConsulta) {
      return NextResponse.json({ message: 'tipoConsulta é obrigatório' }, { status: 400 });
    }
    if (!body.especialidade) {
      return NextResponse.json({ message: 'especialidade é obrigatória' }, { status: 400 });
    }
    if (!body.profissional) {
      return NextResponse.json({ message: 'profissional é obrigatório' }, { status: 400 });
    }
    if (!body.motivoConsulta) {
      return NextResponse.json({ message: 'motivoConsulta é obrigatório' }, { status: 400 });
    }
    if (!body.statusConsulta) {
      return NextResponse.json({ message: 'statusConsulta é obrigatório' }, { status: 400 });
    }
    if (!body.prioridade) {
      return NextResponse.json({ message: 'prioridade é obrigatória' }, { status: 400 });
    }

    const newConsultation = await prisma.consultation.create({
      data: {
          patientId: body.patientId,
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
      } as unknown as Prisma.ConsultationCreateInput, // Forçando a tipagem para evitar erros
    });

    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    return NextResponse.json({ message: 'Erro ao criar consulta', error: String(error) }, { status: 500 });
  }
}

export default prisma;