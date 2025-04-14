import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function GET() {
  try {
    const patients = await db.patient.findMany();
    
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { message: 'Error fetching patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    

    if (!data.nome || !data.cpf || !data.email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const patient = await db.patient.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
      },
    });
    
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { message: 'Error creating patient' },
      { status: 500 }
    );
  }
}