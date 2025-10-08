import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers"; // Import cookies utility
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { signAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword, vaultPin: null });
    await user.save();

    const token = signAuthToken({
      _id: user._id,
      userId: user._id!.toString(),
      email: user.email,
    });

    (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("[API] User saved successfully and token set as cookie.");
    return NextResponse.json({ success: true, token });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[API] Signup failed:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
