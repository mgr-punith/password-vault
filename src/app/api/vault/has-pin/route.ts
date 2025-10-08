import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findById(user._id).select("vaultPin");
    const isSet = !!dbUser?.vaultPin;

    return NextResponse.json({ isSet });
  } catch (error) {
    console.error("Error checking PIN:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
