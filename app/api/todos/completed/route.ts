import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE /api/todos/completed
export async function DELETE() {
  await prisma.todo.deleteMany({
    where: { completed: true },
  });

  return NextResponse.json({ status: "OK" });
}
