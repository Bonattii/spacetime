import decode from "jwt-decode";
import { cookies } from "next/headers";

interface User {
  sub: string;
  name: string;
  avatarUrl: string;
}

export function getUser(): User {
  // Get the value of the token cookie
  const token = cookies().get("token")?.value;

  // Check if it exists
  if (!token) {
    throw new Error("Unauthenticated");
  }

  // Decode the token to get the user
  const user: User = decode(token);

  return user;
}
