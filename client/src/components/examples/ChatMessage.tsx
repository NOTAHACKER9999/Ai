import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="p-6 space-y-4 bg-background">
      <ChatMessage
        role="user"
        content="Hello! Can you help me understand quantum computing?"
        timestamp={new Date(Date.now() - 300000)}
      />
      <ChatMessage
        role="assistant"
        content="Of course! Quantum computing is a type of computing that uses quantum-mechanical phenomena like superposition and entanglement to perform operations on data. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or 'qubits' which can exist in multiple states simultaneously."
        timestamp={new Date(Date.now() - 240000)}
      />
      <ChatMessage
        role="user"
        content="That's fascinating! What are some practical applications?"
        timestamp={new Date()}
      />
    </div>
  );
}
