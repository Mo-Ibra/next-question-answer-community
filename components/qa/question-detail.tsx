"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { VoteButton } from "./vote-button";

interface Question {
  id: string;
  title: string;
  content: string;
  user: { id: string; name: string; email: string };
  _count: { answers: number; votes: number };
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
    return <div className="text-center py-8">Loading...</div>;
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
          <VoteButton questionId={question.id} />
          <div className="text-sm text-muted-foreground">
            Asked by{" "}
            <strong>{question.user.name || question.user.email}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
