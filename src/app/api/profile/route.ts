import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Verificar que el usuario esté autenticado
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener los datos del cuerpo de la petición
    const body = await request.json();
    const { firstName, lastName, dni, phone } = body;

    // Validar campos requeridos
    if (!firstName || !lastName || !dni || !phone) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que el DNI no esté en uso
    const existingUser = await prisma.user.findFirst({
      where: {
        dni: dni,
        email: { not: session.user.email } // Excluir al usuario actual
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El DNI ya está registrado" },
        { status: 400 }
      );
    }

    // Actualizar el perfil del usuario
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName,
        lastName,
        dni,
        phone,
        profileCompleted: true
      }
    });

    return NextResponse.json(
      { 
        message: "Perfil completado exitosamente",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          name: updatedUser.name,
          picture: updatedUser.picture,
          profileCompleted: updatedUser.profileCompleted
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error completando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Obtener información del perfil del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        name: true,
        picture: true,
        profileCompleted: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
