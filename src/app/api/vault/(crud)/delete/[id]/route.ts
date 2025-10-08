import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VaultItem } from "@/models/VaultItems";
import { getCurrentUser } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, context: Params) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;

    const deleted = await VaultItem.findOneAndDelete({
      _id: id,
      owner: user._id,
    });

    if (!deleted) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vault delete error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}