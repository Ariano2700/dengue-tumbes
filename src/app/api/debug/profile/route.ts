import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Debug - Session:", {
      session: session,
      user: session?.user,
      email: session?.user?.email
    });
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "No autorizado", session: session },
        { status: 401 }
      );
    }

    // Buscar usuario en la base de datos
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
        createdAt: true,
        updatedAt: true
      }
    });

    console.log("Debug - User from DB:", user);

    if (!user) {
      return NextResponse.json(
        { 
          error: "Usuario no encontrado",
          email: session.user.email,
          sessionUser: session.user
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      session: {
        user: session.user,
        expires: session.expires
      },
      userFromDB: user,
      shouldProfileBeCompleted: !!(user.firstName && user.lastName && user.dni && user.phone),
      actualProfileCompleted: user.profileCompleted
    }, { status: 200 });

  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error },
      { status: 500 }
    );
  }
}
