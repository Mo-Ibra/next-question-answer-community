"use client"

import { useRef } from "react"
import { QuestionDetail } from "@/components/qa/question-detail"
import { AnswerList } from "@/components/qa/answer-list"
import { AnswerForm } from "@/components/qa/answer-form"

interface QuestionPageClientProps {
  questionId: string
  userId?: string
}

export function QuestionPageClient({ questionId, userId }: QuestionPageClientProps) {
  const refreshAnswersRef = useRef<(() => void) | null>(null)

  const handleRefreshNeeded = (callback: () => void) => {
    refreshAnswersRef.current = callback
  }

  const handleAnswerAdded = () => {
    if (refreshAnswersRef.current) {
      refreshAnswersRef.current()
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <QuestionDetail questionId={questionId} />
      <AnswerList 
        questionId={questionId} 
        onRefreshNeeded={handleRefreshNeeded}
      />

      {userId ? (
        <AnswerForm 
          questionId={questionId}
          onAnswerAdded={handleAnswerAdded}
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Sign in to answer this question
        </div>
      )}
    </div>
  )
}