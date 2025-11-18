"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButton } from "./vote-button";
import { Skeleton } from "@/components/ui/skeleton";

interface Question {
  id: string;
  title: string;
  content: string;
  user: { id: string; name: string; email: string };
  questionVoteSum: number;
  userQuestionVote: number | null;
  createdAt: string;
}

export function QuestionDetail({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${questionId}`);
        if (res.ok) {
          const data = await res.json();
          setQuestion(data);
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          {/* Title placeholder */}
          <Skeleton className="h-6 w-3/4" />

          {/* Content placeholder */}
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />

          {/* Vote placeholder */}
          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </Card>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Question not found
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground whitespace-pre-wrap">
          {question.content}
        </p>
        <div className="flex items-center gap-4">
          <VoteButton
            questionId={question.id}
            initialUpvoted={question.userQuestionVote === 1}
            initialDownvoted={question.userQuestionVote === -1}
            initialVoteCount={question.questionVoteSum}
          />
          <div className="text-sm text-muted-foreground">
            Asked by{" "}
            <strong>{question.user.name || question.user.email}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
