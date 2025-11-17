"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteButtonProps {
  questionId?: string;
  answerId?: string;
}

export function VoteButton({ questionId, answerId }: VoteButtonProps) {
  const { data: session } = useSession();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  const handleVote = async (value: 1 | -1) => {
    if (!session?.user?.id) {
      return; // User should be redirected to login
    }

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questionId || null,
          answerId: answerId || null,
          value,
        }),
      });

      if (res.ok) {
        if (value === 1) {
          setUpvoted(!upvoted);
          setVoteCount(upvoted ? voteCount - 1 : voteCount + 1);
          if (downvoted) {
            setDownvoted(false);
            setVoteCount(upvoted ? voteCount - 1 : voteCount + 2);
          }
        } else {
          setDownvoted(!downvoted);
          setVoteCount(downvoted ? voteCount + 1 : voteCount - 1);
          if (upvoted) {
            setUpvoted(false);
            setVoteCount(downvoted ? voteCount + 1 : voteCount - 2);
          }
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Sign in to vote
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={upvoted ? "default" : "outline"}
        onClick={() => handleVote(1)}
        className="gap-1"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      <span className="text-sm font-medium">{voteCount}</span>
      <Button
        size="sm"
        variant={downvoted ? "default" : "outline"}
        onClick={() => handleVote(-1)}
        className="gap-1"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
