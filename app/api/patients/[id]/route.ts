// /app/api/patients/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id, 10);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: "ID inválido. Deve ser um número." },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    const formattedPatient = {
      ...patient,
      dataNascimento: patient.dataNascimento
        ? patient.dataNascimento.toISOString().split("T")[0]
        : "",
      dataDiagnostico: patient.dataDiagnostico
        ? patient.dataDiagnostico.toISOString().split("T")[0]
        : "",
      dataNascimentoResponsavel: patient.dataNascimentoResponsavel
        ? patient.dataNascimentoResponsavel.toISOString().split("T")[0]
        : "",
      dateCadastro: patient.dateCadastro
        ? patient.dateCadastro.toISOString().split("T")[0]
        : "",
    };

    return NextResponse.json(formattedPatient, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return NextResponse.json(
      { error: "Não foi possível buscar o paciente" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id, 10);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: "ID inválido. Deve ser um número." },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    await prisma.patient.delete({
      where: { id: patientId },
    });

    return NextResponse.json(
      { message: "Paciente removido com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover paciente:", error);
    return NextResponse.json(
      { error: "Não foi possível remover o paciente" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id, 10);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: "ID inválido. Deve ser um número." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      nome,
      cpf,
      cartaoSus,
      rg,
      telefone,
      dataNascimento,
      email,
      ocupacao,
      sexo,
      endereco,
      numero,
      municipio,
      tipoAtendimento,
      diagnostico,
      outrasFormasDm,
      dataDiagnostico,
      gestante,
      semanasGestacao,
      amamentando,
      tempoPosParto,
      deficiencia,
      tipoDeficiencia,
      historicoDm1,
      parentescoDm1,
      historicoDm2,
      parentescoDm2,
      historicoOutrasFormasDm,
      parentescoOutrasFormasDm,
      metodoInsulina,
      marcaModeloBomba,
      metodoMonitoramentoGlicemia,
      marcaModeloGlicometroSensor,
      usoAppGlicemia,
      outrosApps,
      nomeResponsavel,
      cpfResponsavel,
      rgResponsavel,
      parentescoResponsavel,
      telefoneResponsavel,
      ocupacaoResponsavel,
      dataNascimentoResponsavel,
      auxilio,
      outrosAuxilios,
      possuiCelularComAcessoInternet,
    } = body;

    // Validação básica
    if (!nome || !cpf || !email || !diagnostico) {
      return NextResponse.json(
        { error: "Campos obrigatórios (nome, cpf, email, diagnostico) devem ser fornecidos." },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        nome,
        cpf,
        cartaoSus,
        rg,
        telefone,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        email,
        ocupacao,
        sexo,
        endereco,
        numero,
        municipio,
        tipoAtendimento,
        diagnostico,
        outrasFormasDm,
        dataDiagnostico: dataDiagnostico ? new Date(dataDiagnostico) : null,
        gestante,
        semanasGestacao: semanasGestacao ? parseInt(semanasGestacao, 10) : null,
        amamentando,
        tempoPosParto,
        deficiencia,
        tipoDeficiencia,
        historicoDm1,
        parentescoDm1,
        historicoDm2,
        parentescoDm2,
        historicoOutrasFormasDm,
        parentescoOutrasFormasDm,
        metodoInsulina,
        marcaModeloBomba,
        metodoMonitoramentoGlicemia,
        marcaModeloGlicometroSensor,
        usoAppGlicemia,
        outrosApps,
        nomeResponsavel,
        cpfResponsavel,
        rgResponsavel,
        parentescoResponsavel,
        telefoneResponsavel,
        ocupacaoResponsavel,
        dataNascimentoResponsavel: dataNascimentoResponsavel
          ? new Date(dataNascimentoResponsavel)
          : null,
        auxilio,
        outrosAuxilios,
        possuiCelularComAcessoInternet,
      },
    });

    const formattedPatient = {
      ...updatedPatient,
      dataNascimento: updatedPatient.dataNascimento
        ? updatedPatient.dataNascimento.toISOString().split("T")[0]
        : "",
      dataDiagnostico: updatedPatient.dataDiagnostico
        ? updatedPatient.dataDiagnostico.toISOString().split("T")[0]
        : "",
      dataNascimentoResponsavel: updatedPatient.dataNascimentoResponsavel
        ? updatedPatient.dataNascimentoResponsavel.toISOString().split("T")[0]
        : "",
      dateCadastro: updatedPatient.dateCadastro
        ? updatedPatient.dateCadastro.toISOString().split("T")[0]
        : "",
    };

    return NextResponse.json(formattedPatient, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o paciente" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}