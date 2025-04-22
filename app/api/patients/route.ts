import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export async function GET() {
    try {
      const patients = await prisma.patient.findMany();
      return NextResponse.json(patients, { status: 200 });
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      return NextResponse.json({ message: 'Erro ao buscar pacientes' }, { status: 500 });
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const newPatient = await prisma.patient.create({
        data: {
          nome: body.nomePaciente, 
          cpf: body.cpf,
          email: body.email,
        },
      });
      return NextResponse.json(newPatient, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return NextResponse.json({ message: 'Erro ao criar paciente' }, { status: 500 });
    }
  }