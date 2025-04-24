import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        dataConsulta: 'desc',
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const consultationData = {
      ...body,
      patientId: parseInt(body.patientId)
    };
    
    const newConsultation = await prisma.consultation.create({
      data: consultationData
    });
    
    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { message: 'Error creating consultation', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}