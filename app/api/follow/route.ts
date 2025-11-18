import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Follow a user
 * @param {Request} req - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    /**
     * Return an error response if the user is not authenticated
     */
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { followingId } = await req.json();

  /**
   * Check if the user is trying to follow themselves
   */
  if (followingId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot follow yourself" },
      { status: 400 }
    );
  }

  /**
   * Create a follow relationship between the current user and the specified user
   */
  const follow = await prisma.follow.create({
    data: {
      followerId: session.user.id,
      followingId,
    },
  });

  /**
   * Return the result of the create operation
   */
  return NextResponse.json(follow, { status: 201 });
}

/**
 * Unfollow a user
 * @param {Request} req - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    /**
     * Return an error response if the user is not authenticated
     */
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { followingId } = await req.json();

  /**
   * Delete the follow relationship between the current user and the specified user
   */
  const follow = await prisma.follow.deleteMany({
    where: {
      followerId: session.user.id,
      followingId,
    },
  });

  /**
   * Return the result of the delete operation
   */
  return NextResponse.json(follow, { status: 201 });
}
