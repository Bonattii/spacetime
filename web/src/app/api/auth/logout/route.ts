import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the home page url
  const redirectURL = new URL("/", request.url);

  // Redirect to the home page and save the token on the cookies
  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": `token=; Path=/; max-age=0;`,
    },
  });
}
