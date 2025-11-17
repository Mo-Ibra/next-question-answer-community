import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all questions (public)
export async function GET(req: NextRequest) {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { answers: true, votes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST: Create a new question (auth required)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        userId: session.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { answers: true, votes: true },
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
