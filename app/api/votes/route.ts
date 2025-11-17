import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST: Create or update a vote (auth required)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, answerId, value } = await req.json();

    if (!value || ![1, -1].includes(value)) {
      return NextResponse.json(
        { error: "Vote value must be 1 (upvote) or -1 (downvote)" },
        { status: 400 }
      );
    }

    if (!questionId && !answerId) {
      return NextResponse.json(
        { error: "Either questionId or answerId is required" },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_questionId_answerId: {
          userId: session.user.id,
          questionId: questionId || null,
          answerId: answerId || null,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if same value (unvote)
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        return NextResponse.json({ message: "Vote removed" });
      } else {
        // Update vote if different value
        const updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        });
        return NextResponse.json(updatedVote);
      }
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        questionId: questionId || null,
        answerId: answerId || null,
        value,
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    console.error("Error handling vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
