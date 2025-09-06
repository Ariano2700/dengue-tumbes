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

// Actualizar información del perfil del usuario (solo campos específicos)
export async function PATCH(request: Request) {
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
    
    // Crear objeto con solo los campos permitidos y no vacíos
    const allowedFields = ['firstName', 'lastName', 'dni', 'phone'];
    const updateData: any = {};
    
    // Filtrar solo los campos permitidos que se envían
    allowedFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
        updateData[field] = body[field].toString().trim();
      }
    });

    // Verificar que se envió al menos un campo para actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Debe proporcionar al menos un campo para actualizar (firstName, lastName, dni, phone)" },
        { status: 400 }
      );
    }

    // Si se está actualizando el DNI, verificar que no esté en uso
    if (updateData.dni) {
      const existingUser = await prisma.user.findFirst({
        where: {
          dni: updateData.dni,
          email: { not: session.user.email } // Excluir al usuario actual
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "El DNI ya está registrado por otro usuario" },
          { status: 400 }
        );
      }
    }

    // Validaciones básicas
    if (updateData.dni && (updateData.dni.length < 8 || updateData.dni.length > 8)) {
      return NextResponse.json(
        { error: "El DNI debe tener exactamente 8 dígitos" },
        { status: 400 }
      );
    }

    if (updateData.phone && updateData.phone.length < 9) {
      return NextResponse.json(
        { error: "El teléfono debe tener al menos 9 dígitos" },
        { status: 400 }
      );
    }

    if (updateData.firstName && updateData.firstName.length < 2) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }

    if (updateData.lastName && updateData.lastName.length < 2) {
      return NextResponse.json(
        { error: "El apellido debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }

    // Actualizar el perfil del usuario (updatedAt se actualiza automáticamente)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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
        updatedAt: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      { 
        message: "Perfil actualizado exitosamente",
        user: updatedUser,
        updatedFields: Object.keys(updateData)
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error actualizando perfil:", error);
    
    // Manejar errores específicos de Prisma
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: "El DNI ya está registrado" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
