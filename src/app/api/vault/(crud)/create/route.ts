import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VaultItem } from "@/models/VaultItems";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { ciphertext, iv } = await req.json();
    if (!ciphertext || !iv) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newItem = await VaultItem.create({
      owner: user._id,
      ciphertext,
      iv,
    });

    return NextResponse.json({ success: true, id: newItem._id });
  } catch (error) {
    console.error("Vault create error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
