"use client";

import { useState } from "react";

export default function FollowButton({
  userId,
  isFollowingInitial,
}: {
  userId: string;
  isFollowingInitial: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);

    const method = isFollowing ? "DELETE" : "POST";

    await fetch("/api/follow", {
      method,
      body: JSON.stringify({ followingId: userId }),
    });

    setIsFollowing(!isFollowing);
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white ${
        isFollowing ? "bg-red-500" : "bg-blue-600"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
