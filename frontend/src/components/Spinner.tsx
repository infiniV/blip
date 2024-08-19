import { useEffect, useState } from "react";
import { grid } from "ldrs";

interface Message {
  step: string;
  data: any;
}

export default function Spinner() {
  const [message, setMessage] = useState<Message | null>(null);
  const [timeoutMessage, setTimeoutMessage] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    grid.register();

    const eventSource = new EventSource("http://127.0.0.1:5000/sse");

    // Set up a timer to show the timeout message
    const id = setTimeout(() => {
      setTimeoutMessage(
        "Please wait, processing is taking longer than expected..."
      );
    }, 30000); // 30 seconds
    setTimeoutId(id);

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      // Clear the timer if connection is opened before timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
        setTimeoutMessage("");
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessage((prevMessage) => {
          // Update only if the new message is different from the heartbeat
          if (data.step !== "heartbeat") {
            return data as Message;
          }
          return prevMessage;
        });
        console.log("Received message:", data);

        // Clear the timer when a message is received
        if (timeoutId) {
          clearTimeout(timeoutId);
          setTimeoutId(null);
          setTimeoutMessage("");
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      // Clear the timer if the component unmounts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array to ensure effect runs once

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <l-grid size="70" speed="1.5" color="#95e138"></l-grid>
      {timeoutMessage && (
        <div className="text-xl font-thin mt-20 text-[#95e138] m-4">
          <h1>{timeoutMessage}</h1>
        </div>
      )}
      {message ? (
        <div className="text-xl font-thin mt-20 text-[#95e138] m-4">
          <h1>{message.data}</h1>
        </div>
      ) : (
        <div className="mt-4 text-center text-white">
          <h1>No message received yet.</h1>
        </div>
      )}
    </div>
  );
}
