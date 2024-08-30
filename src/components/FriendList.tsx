"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FriendList() {
  const { data: session } = useSession();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch friends list
      fetch("/api/friends")
        .then((res) => res.json())
        .then((data) => setFriends(data));
    }
  }, [session]);

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
}
