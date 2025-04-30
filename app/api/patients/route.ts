// /app/api/patients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Criar uma única instância do Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Função para tentar reconectar com retry
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.warn(`Tentativa ${attempt} falhou. Tentando novamente em ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("Número máximo de tentativas excedido.");
};

// Ajustar o schema Zod para compatibilidade com o dashboard
const PatientSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "CPF inválido").optional(),
  cartaoSus: z.string().length(15, "Cartão SUS deve ter 15 dígitos").optional(),
  rg: z.string().min(7).max(14, "RG inválido").optional(),
  telefone: z.string().regex(/\(\d{2}\) \d{4,5}-\d{4}/, "Telefone inválido").optional(),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  email: z.string().email("Email inválido"),
  ocupacao: z.string().optional(),
  sexo: z.enum(["MASCULINO", "FEMININO", "OUTRO"]).optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  municipio: z.string().optional(),
  tipoAtendimento: z.string().optional(),
  diagnostico: z.string().optional(),
  outrasFormasDm: z.string().optional(),
  dataDiagnostico: z.string().optional(),
  gestante: z.string().optional(),
  semanasGestacao: z.number().min(1).optional(),
  amamentando: z.string().optional(),
  tempoPosParto: z.string().optional(),
  deficiencia: z.string().optional(),
  tipoDeficiencia: z.string().optional(),
  historicoDm1: z.string().optional(),
  parentescoDm1: z.string().optional(),
  historicoDm2: z.string().optional(),
  parentescoDm2: z.string().optional(),
  historicoOutrasFormasDm: z.string().optional(),
  parentescoOutrasFormasDm: z.string().optional(),
  metodoInsulina: z.string().optional(),
  marcaModeloBomba: z.string().optional(),
  metodoMonitoramentoGlicemia: z.string().optional(),
  marcaModeloGlicometroSensor: z.string().optional(),
  usoAppGlicemia: z.string().optional(),
  outrosApps: z.string().optional(),
  nomeResponsavel: z.string().optional(),
  cpfResponsavel: z.string().regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "CPF do responsável inválido").optional(),
  rgResponsavel: z.string().min(7).max(14, "RG do responsável inválido").optional(),
  parentescoResponsavel: z.string().optional(),
  telefoneResponsavel: z.string().regex(/\(\d{2}\) \d{4,5}-\d{4}/, "Telefone do responsável inválido").optional(),
  ocupacaoResponsavel: z.string().optional(),
  dataNascimentoResponsavel: z.string().optional(),
  auxilio: z.string().optional(),
  outrosAuxilios: z.string().optional(),
  possuiCelularComAcessoInternet: z.string().optional(),
  dataCadastro: z.string().optional(),
});

export async function GET() {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const patients = await retryOperation(async () => {
      return await prisma.patient.findMany();
    });

    const formattedPatients = patients.map((patient) => ({
      ...patient,
      dataNascimento: patient.dataNascimento ? patient.dataNascimento.toISOString().split("T")[0] : "",
      dataDiagnostico: patient.dataDiagnostico ? patient.dataDiagnostico.toISOString().split("T")[0] : "",
      dataNascimentoResponsavel: patient.dataNascimentoResponsavel ? patient.dataNascimentoResponsavel.toISOString().split("T")[0] : "",
      dataCadastro: patient.dateCadastro ? patient.dateCadastro.toISOString().split("T")[0] : "",
    }));

    return NextResponse.json(formattedPatients, { status: 200 });
  } catch (error: unknown) {
    // Verificar se error é uma instância de Error
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao buscar pacientes:", error);
    return NextResponse.json(
      { message: "Erro ao buscar pacientes", error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const convertedBody = {
      ...body,
      gestante: body.gestante ? "SIM" : "NÃO",
      amamentando: body.amamentando ? "SIM" : "NÃO",
      deficiencia: body.deficiencia ? "SIM" : "NÃO",
      historicoDm1: body.historicoDm1 ? "SIM" : "NÃO",
      historicoDm2: body.historicoDm2 ? "SIM" : "NÃO",
      historicoOutrasFormasDm: body.historicoOutrasFormasDm ? "SIM" : "NÃO",
      possuiCelularComAcessoInternet: body.possuiCelularComAcessoInternet ? "SIM" : "NÃO",
      dataCadastro: body.dataCadastro || new Date().toISOString().split("T")[0],
    };

    const validatedData = PatientSchema.parse(convertedBody);

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
      dataNascimentoResponsavel: validatedData.dataNascimentoResponsavel
        ? new Date(validatedData.dataNascimentoResponsavel)
        : null,
      auxilio: validatedData.auxilio,
      outrosAuxilios: validatedData.outrosAuxilios,
      possuiCelularComAcessoInternet: validatedData.possuiCelularComAcessoInternet,
      dateCadastro: validatedData.dataCadastro ? new Date(validatedData.dataCadastro) : new Date(),
    };

    const newPatient = await retryOperation(async () => {
      return await prisma.patient.create({
        data: dataToCreate,
      });
    });

    const formattedPatient = {
      ...newPatient,
      dataNascimento: newPatient.dataNascimento ? newPatient.dataNascimento.toISOString().split("T")[0] : "",
      dataDiagnostico: newPatient.dataDiagnostico ? newPatient.dataDiagnostico.toISOString().split("T")[0] : "",
      dataNascimentoResponsavel: newPatient.dataNascimentoResponsavel
        ? newPatient.dataNascimentoResponsavel.toISOString().split("T")[0]
        : "",
      dataCadastro: newPatient.dateCadastro ? newPatient.dateCadastro.toISOString().split("T")[0] : "",
    };

    return NextResponse.json(formattedPatient, { status: 201 });
  } catch (error: unknown) {
    console.error("Erro ao criar paciente:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // Verificar se error é uma instância de Error
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      {
        message: "Erro ao criar paciente",
        error: errorMessage,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}