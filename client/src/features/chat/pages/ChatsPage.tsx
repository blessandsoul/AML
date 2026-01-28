import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { NewChatDialog } from '../components/NewChatDialog';
import { useChat } from '../hooks/useChats';
import { ROUTES } from '@/lib/constants/routes';
import type { Chat } from '../types/chat.types';

export const ChatsPage = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  // Fetch chat details if chatId is in URL
  const { data: chatFromUrl } = useChat(chatId || '');

  // Update selected chat when URL changes
  useEffect(() => {
    if (chatFromUrl) {
      setSelectedChat(chatFromUrl);
    }
  }, [chatFromUrl]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    navigate(ROUTES.CHATS.DETAILS(chat.id));
  };

  const handleChatCreated = (chat: Chat) => {
    setSelectedChat(chat);
    navigate(ROUTES.CHATS.DETAILS(chat.id));
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex h-full border border-border rounded-lg overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-border flex flex-col bg-background">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="font-semibold">Messages</h1>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewChatDialog(true)}
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </div>
          <ChatList
            selectedChatId={selectedChat?.id}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-background">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Dialog */}
      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};
