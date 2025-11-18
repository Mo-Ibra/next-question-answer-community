import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { content } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Answer content is required" },
        { status: 400 }
      )
    }

    const { id } = await params

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    const answer = await prisma.answer.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        questionId: id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { votes: true },
        },
      },
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error("Error creating answer:", error)
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    )
  }
}
