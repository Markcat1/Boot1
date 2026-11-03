import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      datetime,
      streetAndNumber,
      colony,
      userName,
      gasCompany,
      cylinderCapacity,
      damageTypes,
      observations,
      finalStatus,
    } = body;

    const intervention = await prisma.intervention.create({
      data: {
        datetime: datetime ? new Date(datetime) : new Date(),
        streetAndNumber,
        colony,
        userName,
        gasCompany,
        cylinderCapacity,
        damageTypes: JSON.stringify(damageTypes), // Ensure it is stored as JSON string
        observations,
        finalStatus,
      },
    });

    return NextResponse.json(intervention, { status: 201 });
  } catch (error) {
    console.error("Error saving intervention:", error);
    return NextResponse.json(
      { error: "Error saving intervention" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interventions = await prisma.intervention.findMany({
      orderBy: {
        datetime: "asc",
      },
    });

    // Parse the JSON string for damageTypes before sending to the client
    const mappedInterventions = interventions.map((item) => ({
      ...item,
      damageTypes: JSON.parse(item.damageTypes),
    }));

    return NextResponse.json(mappedInterventions);
  } catch (error) {
    console.error("Error fetching interventions:", error);
    return NextResponse.json(
      { error: "Error fetching interventions" },
      { status: 500 }
    );
  }
}
