import React, { useState, useEffect } from 'react';
import { Conversation, User } from '../../types';
import * as backendService from '../../api/backendService';
import { MessageCircleIcon } from '../../components/icons';

interface ChatListPageProps {
  currentUser: User;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ChatListPage: React.FC<ChatListPageProps> = ({ currentUser, onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    backendService.getConversationsForUser(currentUser.id)
      .then(data => {
        const sorted = data.sort((a, b) => {
            const lastMsgA = a.messages[a.messages.length - 1];
            const lastMsgB = b.messages[b.messages.length - 1];
            if (!lastMsgA) return 1;
            if (!lastMsgB) return -1;
            return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
        });
        setConversations(sorted);
      })
      .finally(() => setIsLoading(false));
  }, [currentUser.id]);

  if (isLoading) {
    return <div className="text-center p-10">Loading conversations...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl animate-fade-in">
      <h2 className="text-3xl font-bold text-on-surface mb-6">Your Conversations</h2>
      <div className="bg-surface rounded-xl shadow-lg">
        {conversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {conversations.map(convo => {
              const otherUser = convo.buyer.id === currentUser.id ? convo.seller : convo.buyer;
              const lastMessage = convo.messages[convo.messages.length - 1];
              return (
                <li key={convo.id} onClick={() => onSelectConversation(convo)} className="p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-4">
                  <img src={convo.product.imageUrl} alt={convo.product.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-on-surface">{convo.product.name}</h3>
                        {lastMessage && <span className="text-xs text-subtle">{new Date(lastMessage.timestamp).toLocaleDateString()}</span>}
                    </div>
                    <p className="text-sm text-subtle">With {otherUser.name}</p>
                    <p className="text-sm text-on-surface mt-1 truncate">
                      {lastMessage ? `${lastMessage.sender.id === currentUser.id ? 'You: ' : ''}${lastMessage.text}` : 'No messages yet.'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-16">
            <MessageCircleIcon className="w-12 h-12 mx-auto text-subtle" />
            <h3 className="text-xl font-semibold text-on-surface mt-4">No conversations yet.</h3>
            <p className="text-subtle mt-2">Contact a seller on an item page to start a chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};