import { useState, useEffect } from 'react';
import { Conversation } from '../../types';
import { websocketService } from '../../api/websocketService';

const reviveConversationDates = (conversation: any): Conversation => ({
  ...conversation,
  product: {
    ...conversation.product,
    endDate: new Date(conversation.product.endDate),
  },
  messages: conversation.messages.map((message: any) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  })),
});


export const useChat = (conversation: Conversation | null) => {
  const [liveConversation, setLiveConversation] = useState<Conversation | null>(conversation);

  useEffect(() => {
    if (!conversation) return;

    setLiveConversation(reviveConversationDates(conversation));

    const handleConversationUpdate = (updatedConversation: Conversation) => {
        setLiveConversation(reviveConversationDates(updatedConversation));
    };

    websocketService.subscribeToConversation(conversation.id, handleConversationUpdate);

    return () => {
      websocketService.unsubscribeFromConversation(conversation.id, handleConversationUpdate);
    };
  }, [conversation]);

  return liveConversation;
};