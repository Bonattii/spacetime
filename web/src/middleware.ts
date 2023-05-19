import { NextRequest, NextResponse } from "next/server";

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;

export const middleware = (request: NextRequest) => {
  // Get the value of the token cookie
  const token = request.cookies.get("token")?.value;

  // If the user is not logged in, will redirect to the login page
  if (!token) {
    return NextResponse.redirect(signInURL, {
      headers: {
        "Set-Cookie": `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20;`,
      },
    });
  }

  // Just continue
  return NextResponse.next();
};

// Middleware will be called when any memories route try to be accessed
export const config = {
  matcher: "/memories/:path*",
};
