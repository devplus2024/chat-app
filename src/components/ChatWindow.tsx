"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ChatWindow({ friendId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (session?.user?.id && friendId) {
      // Fetch messages for this friend
      fetch(`/api/messages?friendId=${friendId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [session, friendId]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: friendId, content: inputMessage }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
