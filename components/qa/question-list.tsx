"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"

interface Question {
  id: string;
  title: string;
  content: string;
  user: { id: string; name: string; email: string };
  _count: { answers: number; votes: number };
  createdAt: string;
}

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {questions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        questions.map((question) => (
          <Link key={question.id} href={`/qa/${question.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer my-4">
              <CardHeader>
                <CardTitle className="line-clamp-2">{question.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {question.content}
                </p>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {question._count.answers} answers
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {question._count.votes} votes
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Asked by {question.user.name || question.user.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
