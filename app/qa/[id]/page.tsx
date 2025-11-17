import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { QuestionDetail } from "@/components/qa/question-detail"
import { AnswerList } from "@/components/qa/answer-list"
import { AnswerForm } from "@/components/qa/answer-form"

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/qa">
          <Button variant="outline" className="mb-4">
            Back to Questions
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto space-y-8">
          <QuestionDetail questionId={id} />
          <AnswerList questionId={id} />

          {session?.user?.id ? (
            <AnswerForm questionId={id} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Sign in to answer this question
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
