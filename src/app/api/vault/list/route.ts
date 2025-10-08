import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VaultItem } from "@/models/VaultItems";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vaultItems = await VaultItem.find({ owner: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ items: vaultItems });
  } catch (err) {
    console.error("Failed to fetch vault items:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}