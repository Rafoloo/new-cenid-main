import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const PatientSchema = z.object({
  nome: z.string().min(1).optional(),
  cpf: z.string().min(1).regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/).optional(),
  cartaoSus: z.string().min(1).length(15).optional(),
  rg: z.string().min(7).max(14).optional(),
  telefone: z.string().min(1).regex(/\(\d{2}\) \d{4,5}-\d{4}/).optional(),
  dataNascimento: z.string().min(1).optional(),
  email: z.string().min(1).email(),
  ocupacao: z.string().min(1).optional(),
  sexo: z.enum(["MASCULINO", "FEMININO", "OUTRO"]).optional(),
  endereco: z.string().min(1).optional(),
  numero: z.string().min(1).optional(),
  municipio: z.string().min(1).optional(),
  tipoAtendimento: z.string().min(1).optional(),
  diagnostico: z.string().min(1).optional(),
  outrasFormasDm: z.string().optional(),
  dataDiagnostico: z.string().min(1).optional(),
  gestante: z.string().min(1).optional(),
  semanasGestacao: z.number().min(1).optional(),
  amamentando: z.string().min(1).optional(),
  tempoPosParto: z.string().optional(),
  deficiencia: z.string().min(1).optional(),
  tipoDeficiencia: z.string().optional(),
  historicoDm1: z.string().min(1).optional(),
  parentescoDm1: z.string().optional(),
  historicoDm2: z.string().min(1).optional(),
  parentescoDm2: z.string().optional(),
  historicoOutrasFormasDm: z.string().min(1).optional(),
  parentescoOutrasFormasDm: z.string().optional(),
  metodoInsulina: z.string().min(1).optional(),
  marcaModeloBomba: z.string().optional(),
  metodoMonitoramentoGlicemia: z.string().min(1).optional(),
  marcaModeloGlicometroSensor: z.string().min(1).optional(),
  usoAppGlicemia: z.string().min(1).optional(),
  outrosApps: z.string().optional(),
  nomeResponsavel: z.string().min(1).optional(),
  cpfResponsavel: z.string().min(1).regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/).optional(),
  rgResponsavel: z.string().min(7).max(14).optional(),
  parentescoResponsavel: z.string().min(1).optional(),
  telefoneResponsavel: z.string().min(1).regex(/\(\d{2}\) \d{4,5}-\d{4}/).optional(),
  ocupacaoResponsavel: z.string().min(1).optional(),
  dataNascimentoResponsavel: z.string().min(1).optional(),
  auxilio: z.string().min(1).optional(),
  outrosAuxilios: z.string().optional(),
  possuiCelularComAcessoInternet: z.string().min(1).optional(),
  dateCadastro: z.string().min(1).optional(),
});

export async function GET() {
  try {
    const patients = await prisma.patient.findMany();
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar pacientes' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Converter campos booleanos para string antes da validação
    const convertedBody = {
      ...body,
      gestante: body.gestante ? 'SIM' : 'NÃO',
      amamentando: body.amamentando ? 'SIM' : 'NÃO',
      deficiencia: body.deficiencia ? 'SIM' : 'NÃO',
      historicoDm1: body.historicoDm1 ? 'SIM' : 'NÃO',
      historicoDm2: body.historicoDm2 ? 'SIM' : 'NÃO',
      historicoOutrasFormasDm: body.historicoOutrasFormasDm ? 'SIM' : 'NÃO',
      possuiCelularComAcessoInternet: body.possuiCelularComAcessoInternet ? 'SIM' : 'NÃO',
      // Corrigindo o nome do campo para dateCadastro conforme seu schema
      dateCadastro: body.dataCadastro || new Date().toISOString()
    };

    const validatedData = PatientSchema.parse(convertedBody);
    
    // Criar objeto apenas com campos que existem no modelo Prisma
    const dataToCreate = {
      nome: validatedData.nome,
      cpf: validatedData.cpf,
      cartaoSus: validatedData.cartaoSus,
      rg: validatedData.rg,
      telefone: validatedData.telefone,
      dataNascimento: validatedData.dataNascimento ? new Date(validatedData.dataNascimento) : null,
      email: validatedData.email,
      ocupacao: validatedData.ocupacao,
      sexo: validatedData.sexo,
      endereco: validatedData.endereco,
      numero: validatedData.numero,
      municipio: validatedData.municipio,
      tipoAtendimento: validatedData.tipoAtendimento,
      diagnostico: validatedData.diagnostico,
      outrasFormasDm: validatedData.outrasFormasDm,
      dataDiagnostico: validatedData.dataDiagnostico ? new Date(validatedData.dataDiagnostico) : null,
      gestante: validatedData.gestante,
      semanasGestacao: validatedData.semanasGestacao,
      amamentando: validatedData.amamentando,
      tempoPosParto: validatedData.tempoPosParto,
      deficiencia: validatedData.deficiencia,
      tipoDeficiencia: validatedData.tipoDeficiencia,
      historicoDm1: validatedData.historicoDm1,
      parentescoDm1: validatedData.parentescoDm1,
      historicoDm2: validatedData.historicoDm2,
      parentescoDm2: validatedData.parentescoDm2,
      historicoOutrasFormasDm: validatedData.historicoOutrasFormasDm,
      parentescoOutrasFormasDm: validatedData.parentescoOutrasFormasDm,
      metodoInsulina: validatedData.metodoInsulina,
      marcaModeloBomba: validatedData.marcaModeloBomba,
      metodoMonitoramentoGlicemia: validatedData.metodoMonitoramentoGlicemia,
      marcaModeloGlicometroSensor: validatedData.marcaModeloGlicometroSensor,
      usoAppGlicemia: validatedData.usoAppGlicemia,
      outrosApps: validatedData.outrosApps,
      nomeResponsavel: validatedData.nomeResponsavel,
      cpfResponsavel: validatedData.cpfResponsavel,
      rgResponsavel: validatedData.rgResponsavel,
      parentescoResponsavel: validatedData.parentescoResponsavel,
      telefoneResponsavel: validatedData.telefoneResponsavel,
      ocupacaoResponsavel: validatedData.ocupacaoResponsavel,
      dataNascimentoResponsavel: validatedData.dataNascimentoResponsavel ? new Date(validatedData.dataNascimentoResponsavel) : null,
      auxilio: validatedData.auxilio,
      outrosAuxilios: validatedData.outrosAuxilios,
      possuiCelularComAcessoInternet: validatedData.possuiCelularComAcessoInternet,
      dateCadastro: validatedData.dateCadastro ? new Date(validatedData.dateCadastro) : new Date(),
    };

    const newPatient = await prisma.patient.create({
      data: dataToCreate,
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao criar paciente:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Dados inválidos',
          errors: error.errors 
        }, 
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Erro ao criar paciente',
          error: error.message 
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Erro desconhecido ao criar paciente' }, 
      { status: 500 }
    );
  }
}