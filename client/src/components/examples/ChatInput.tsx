import { useState } from 'react';
import ChatInput from '../ChatInput';

export default function ChatInputExample() {
  const [lastMessage, setLastMessage] = useState<string>("");

  return (
    <div className="p-6 bg-background space-y-4">
      <div className="max-w-4xl mx-auto">
        <ChatInput
          onSendMessage={(msg) => {
            console.log('Message sent:', msg);
            setLastMessage(msg);
          }}
          placeholder="Type your message..."
        />
        {lastMessage && (
          <p className="mt-4 text-sm text-muted-foreground">
            Last sent: {lastMessage}
          </p>
        )}
      </div>
    </div>
  );
}
