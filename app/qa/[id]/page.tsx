import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { QuestionPageClient } from "@/components/qa/question-page-client";

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

        <QuestionPageClient
          questionId={id}
          userId={session?.user?.id}
        />
      </div>
    </main>
  )
}