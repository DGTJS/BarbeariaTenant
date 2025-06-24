// src/lib/getUserData.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserData() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return null;

  return {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}
