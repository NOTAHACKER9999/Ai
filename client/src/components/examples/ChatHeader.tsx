import { useState } from 'react';
import ChatHeader from '../ChatHeader';

export default function ChatHeaderExample() {
  const [messageCount, setMessageCount] = useState(5);

  return (
    <div className="bg-background">
      <ChatHeader
        messageCount={messageCount}
        onClearChat={() => {
          console.log('Clear chat clicked');
          setMessageCount(0);
        }}
      />
    </div>
  );
}
