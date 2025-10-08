import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { pin } = await req.json();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const foundUser = await User.findById(user._id);
    if (!foundUser?.vaultPin) {
      return NextResponse.json({ error: "PIN not set" }, { status: 400 });
    }

    const valid = await bcrypt.compare(pin, foundUser.vaultPin);
    if (!valid) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
