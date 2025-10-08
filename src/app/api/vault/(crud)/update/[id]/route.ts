import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VaultItem } from "@/models/VaultItems";
import { getCurrentUser } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, context: Params) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const { ciphertext, iv } = await req.json();
    if (!ciphertext || !iv) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updated = await VaultItem.findOneAndUpdate(
      { _id: id, owner: user._id },
      { ciphertext, iv },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vault update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}