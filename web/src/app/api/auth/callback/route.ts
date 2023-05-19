import { NextRequest, NextResponse } from "next/server";

import { api } from "@/lib/api";

export async function GET(request: NextRequest) {
  // Get all the search params from the url
  const { searchParams } = new URL(request.url);
  // Get the code from the search params
  const code = searchParams.get("code");

  // Get the cookie that have the redirectUrl after logging in
  const redirectTo = request.cookies.get("redirectTo")?.value;

  // Send the code to the backend to get the token
  const registerResponse = await api.post("/register", {
    code,
  });

  // Get the token from the register response data
  const { token } = registerResponse.data;

  // Get the home page url or to the redirectURL
  const redirectURL = redirectTo ?? new URL("/", request.url);

  // Transform a month into seconds
  const cookiExpiresInSeconds = 60 * 60 * 24 * 30;

  // Redirect to the home page and save the token on the cookies
  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": `token=${token}; Path=/; max-age=${cookiExpiresInSeconds};`,
    },
  });
}
