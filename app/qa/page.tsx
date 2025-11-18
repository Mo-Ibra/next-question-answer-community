import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { QuestionList } from "@/components/qa/question-list";
import Navbar from "@/components/navbar";

export default async function QAPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Questions & Answers</h1>
            <p className="text-muted-foreground mt-2">
              Ask questions and share knowledge with the community
            </p>
          </div>
          {session?.user?.id ? (
            <Link href="/qa/ask">
              <Button>Ask a Question</Button>
            </Link>
          ) : (
            <div className="text-sm text-muted-foreground">
              Sign in to ask questions
            </div>
          )}
        </div>

        <QuestionList />
      </div>
    </main>
  );
}
