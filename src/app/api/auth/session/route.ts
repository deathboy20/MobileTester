import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const idToken = await request.text();

  if (!idToken) {
    return NextResponse.json(
      { error: "ID token is required." },
      { status: 400 }
    );
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await auth().createSessionCookie(idToken, {
      expiresIn,
    });

    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json({ status: "success" }, { status: 200 });
    response.cookies.set(options);
    
    return response;
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json(
      { error: "Failed to create session." },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const options = {
    name: "session",
    value: "",
    maxAge: -1,
  };

  const response = NextResponse.json({ status: "signedOut" }, { status: 200 });
  response.cookies.set(options);

  return response;
}
