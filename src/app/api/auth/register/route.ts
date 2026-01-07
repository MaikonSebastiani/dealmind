import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { 
  checkRateLimit, 
  getClientIdentifier, 
  getRateLimitHeaders,
  RATE_LIMIT_CONFIG 
} from "@/lib/rate-limit";

// Server-side validation schema (without confirmPassword)
const registerApiSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    // Rate limiting - stricter for registration
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`register:${clientId}`, RATE_LIMIT_CONFIG.register);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Too many registration attempts. Please try again later." },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const result = registerApiSchema.safeParse(body);
    
    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: firstError.message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "EMAIL_EXISTS", message: "This email is already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
