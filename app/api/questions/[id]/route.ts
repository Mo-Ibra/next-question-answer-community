import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET: Fetch a single question with answers (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const userId = session?.user?.id

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        answers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
            votes: true,
          },
          orderBy: { createdAt: "desc" },
        },
        votes: true,
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    const userQuestionVote = question.votes.find(v => v.userId === userId)
    const questionVoteSum = question.votes.reduce((sum, v) => sum + v.value, 0)
    
    const answersWithVotes = question.answers.map(answer => {
      const userAnswerVote = answer.votes.find(v => v.userId === userId)
      const answerVoteSum = answer.votes.reduce((sum, v) => sum + v.value, 0)
      return {
        ...answer,
        voteSum: answerVoteSum,
        userVoteValue: userAnswerVote?.value || null,
        votes: undefined, // remove raw votes array from response
      }
    })

    return NextResponse.json({
      ...question,
      questionVoteSum,
      userQuestionVote: userQuestionVote?.value || null,
      answers: answersWithVotes,
      votes: undefined, // remove raw votes array from response
    })
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}
