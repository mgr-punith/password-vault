import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { pin } = await req.json();

    if (!pin || pin.length !== 6) {
      return NextResponse.json(
        { error: "PIN must be 6 digits" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await User.findByIdAndUpdate(user._id, { vaultPin: hashedPin });

    return NextResponse.json({ message: "Vault PIN set successfully" });
  } catch (error) {
    console.error("Error setting PIN:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
