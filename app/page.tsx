import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Demo</CardTitle>
          <CardDescription>
            Modern Next.js authentication with Auth.js v5
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {session?.user ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Logged in as:</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="w-full">
                  <Button variant="default" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/qa" className="w-full">
                  <Button variant="outline" className="w-full">
                    Q&A Community
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Sign in or create an account to get started
              </p>
              <div className="flex gap-2 flex-col">
                <Link href="/login" className="w-full">
                  <Button variant="default" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/qa" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Browse Q&A (Public)
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
