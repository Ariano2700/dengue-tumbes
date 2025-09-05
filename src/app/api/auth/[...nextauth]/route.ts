import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // ❌ Sin PrismaAdapter - solo JWT
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const, // Solo JWT, sin base de datos
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Cuando el usuario se autentica por primera vez
      if (user && account) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar info del JWT a la sesión
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Usuario autenticando:", { user, account, profile });
      
      // Aquí puedes guardar el usuario en tu BD manualmente si quieres
      if (account?.provider === "google" && user.email) {
        try {
          // Guardar/actualizar usuario en tu tabla User existente
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              picture: user.image, // Usar 'picture' que es tu campo
            },
            create: {
              email: user.email,
              name: user.name,
              picture: user.image, // Usar 'picture' que es tu campo
              profileCompleted: false,
            },
          });
        } catch (error) {
          console.error("Error guardando usuario:", error);
          // Continuar con la autenticación aunque falle el guardado
        }
      }
      
      return true; // Permitir autenticación
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };