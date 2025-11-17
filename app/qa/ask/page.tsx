import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuestionForm } from "@/components/qa/question-form";

export default async function AskPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/qa">
            <Button variant="outline" className="mb-4">
              Back to Questions
            </Button>
          </Link>
          <QuestionForm />
        </div>
      </div>
    </main>
  );
}
