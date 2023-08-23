// GET /api/todos

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

// POST /api/todos
export async function POST(request: Request) {
  const body = await request.json();
  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      completed: false,
    },
  });
  return NextResponse.json(todo);
}
