import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { statusConsulta } = await req.json();

    // Validar statusConsulta
    const validStatuses = [
      "Agendada",
      "Confirmada",
      "EmAndamento",
      "Concluida",
      "Cancelada",
      "Remarcada",
    ];
    if (!statusConsulta || !validStatuses.includes(statusConsulta)) {
      return NextResponse.json(
        { message: "Invalid or missing statusConsulta" },
        { status: 400 }
      );
    }

    // Verificar se a consulta existe
    const existingConsultation = await prisma.consultation.findUnique({
      where: { id },
    });
    if (!existingConsultation) {
      return NextResponse.json(
        { message: "Consultation not found" },
        { status: 404 }
      );
    }

    // Atualizar a consulta
    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: { statusConsulta },
      include: { patient: true }, // Incluir patient para consistência com GET
    });

    return NextResponse.json(updatedConsultation);
  } catch (error) {
    console.error("Error updating consultation:", error);
    return NextResponse.json(
      {
        message: "Error updating consultation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Verificar se a consulta existe
    const existingConsultation = await prisma.consultation.findUnique({
      where: { id },
    });
    if (!existingConsultation) {
      return NextResponse.json(
        { message: "Consultation not found" },
        { status: 404 }
      );
    }

    // Excluir a consulta
    await prisma.consultation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Consultation deleted successfully" });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    return NextResponse.json(
      {
        message: "Error deleting consultation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}