import { useState } from "react";
import { IoChatbubble } from "react-icons/io5";
import ChatWindow from "./ChatWindow";

interface FloatingChatIconProps {
  userId: string;
}

function FloatingChatIcon({ userId }: FloatingChatIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer bg-[#fa5e06] hover:bg-[#fa5e06]/80 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
      >
        <IoChatbubble size={24} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          userId={userId}
          chatType="admin"
        />
      )}
    </>
  );
}

export default FloatingChatIcon; 