import React, { useState, useRef, useEffect } from 'react';
import { Conversation, User } from '../../types';
import * as backendService from '../../api/backendService';
import { useChat } from './useChat';
import { ArrowLeftIcon, BotIcon } from '../../components/icons';

interface ChatViewProps {
  initialConversation: Conversation;
  currentUser: User;
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialConversation, currentUser, onBack }) => {
  const conversation = useChat(initialConversation);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !conversation) return;
    try {
      await backendService.sendMessage(conversation.id, newMessage, currentUser);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Error: Could not send message.");
    }
  };

  const handleToggleBot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!conversation) return;
    const isEnabled = e.target.checked;
    try {
      await backendService.toggleChatBot(conversation.id, isEnabled);
    } catch (error) {
        console.error("Failed to toggle bot", error);
        alert("Error: Could not update bot status.");
    }
  };

  if (!conversation) {
    return <div>Loading chat...</div>;
  }

  const otherUser = conversation.buyer.id === currentUser.id ? conversation.seller : conversation.buyer;
  const isSeller = currentUser.id === conversation.seller.id;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-64px)] flex flex-col">
       <button onClick={onBack} className="flex items-center gap-2 text-primary font-semibold mb-4 hover:underline">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to All Chats
        </button>
      <div className="bg-surface rounded-xl shadow-lg flex flex-col flex-grow">
        <div className="p-4 border-b flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <img src={conversation.product.imageUrl} alt={conversation.product.name} className="w-12 h-12 rounded-md object-cover" />
                <div>
                    <h2 className="font-bold text-on-surface">{conversation.product.name}</h2>
                    <p className="text-sm text-subtle">Chat with {otherUser.name}</p>
                </div>
            </div>
            {isSeller && (
                <div className="flex items-center gap-3">
                    <label htmlFor="bot-toggle" className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm font-medium text-on-surface">Enable Bot</span>
                        <div className="relative">
                            <input id="bot-toggle" type="checkbox" className="sr-only" checked={conversation.isBotEnabled} onChange={handleToggleBot} />
                            <div className="block bg-gray-200 w-12 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                        </div>
                    </label>
                </div>
            )}
        </div>
        
        {conversation.isBotEnabled && (
            <div className="p-2 bg-blue-50 text-blue-800 text-sm flex items-center justify-center gap-2">
                <BotIcon className="w-4 h-4" />
                AI assistant is active in this chat.
            </div>
        )}

        <div className="p-4 flex-grow overflow-y-auto bg-gray-50">
          {conversation.messages.length === 0 ? (
            <div className="text-center text-subtle mt-8">Start the conversation!</div>
          ) : (
            conversation.messages.map(msg => (
              <div key={msg.id} className={`flex my-2 ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.sender.id === currentUser.id ? 'bg-primary text-white' : 'bg-gray-200 text-on-surface'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender.id === currentUser.id ? 'text-blue-200' : 'text-subtle'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover">
              Send
            </button>
          </div>
        </form>
      </div>
       <style>{`
          #bot-toggle:checked ~ .dot {
            transform: translateX(100%);
            background-color: #1E40AF;
          }
           #bot-toggle:checked ~ .block {
            background-color: #BFDBFE;
          }
        `}</style>
    </div>
  );
};