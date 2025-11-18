"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButton } from "./vote-button";
import { Skeleton } from "@/components/ui/skeleton";

interface Answer {
  id: string;
  content: string;
  user: { id: string; name: string; email: string };
  voteSum: number;
  userVoteValue: number | null;
  createdAt: string;
}

interface AnswerListProps {
  questionId: string;
  onRefreshNeeded?: (callback: () => void) => void;
}

export function AnswerList({ questionId, onRefreshNeeded }: AnswerListProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/questions/${questionId}`);
      if (res.ok) {
        const data = await res.json();
        setAnswers(data.answers || []);
      }
    } catch (error) {
      console.error("Failed to fetch answers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();

    // Register the refresh function with parent once
    if (onRefreshNeeded) {
      onRefreshNeeded(fetchAnswers);
    }
  }, [questionId]); // Only depend on questionId

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" /> {/* اسم المستخدم */}
                <Skeleton className="h-6 w-10" /> {/* زرار التصويت */}
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
      </h3>
      {answers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No answers yet. Be the first to answer!
        </div>
      ) : (
        answers.map((answer) => (
          <Card key={answer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {answer.user.name || answer.user.email}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground whitespace-pre-wrap">
                {answer.content}
              </p>
              <VoteButton
                answerId={answer.id}
                initialUpvoted={answer.userVoteValue === 1}
                initialDownvoted={answer.userVoteValue === -1}
                initialVoteCount={answer.voteSum}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
