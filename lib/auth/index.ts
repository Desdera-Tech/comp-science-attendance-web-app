import { prisma } from "@/lib/prisma";
import { passwordCompare } from "@/utils/password";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const valid = await passwordCompare(
          credentials.password,
          user.password,
        );

        if (!valid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.middleName = (user as any).middleName;
        token.lastName = (user as any).lastName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).firstName = token.firstName;
        (session.user as any).middleName = token.middleName;
        (session.user as any).lastName = token.lastName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
