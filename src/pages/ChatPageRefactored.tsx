import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatMessages } from '../hooks/useChatMessages';
import { useImageUpload } from '../hooks/useImageUpload';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ChatEmptyState from '../components/chat/ChatEmptyState';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import DragDropOverlay from '../components/chat/DragDropOverlay';
import type { ChatHistory, OutfitFilters } from '../types';

// Mock data
const MOCK_CHAT_HISTORY: ChatHistory[] = [
  { id: '1', title: 'Interview outfit 200€', lastMessage: new Date() },
  { id: '2', title: 'Summer wedding look', lastMessage: new Date() },
];

const MOCK_CHAT_FILTERS: Record<string, OutfitFilters> = {
  '1': {
    budgetMax: 200,
    outfitType: 'partial',
    selectedItems: ['jacket', 'blazer', 'shirt', 'pants'],
  },
  '2': {
    budgetMax: 300,
    outfitType: 'full',
    selectedItems: [],
  },
};

const MOCK_CHAT_MESSAGES: Record<string, any[]> = {
  '1': [
    {
      id: 'm1',
      role: 'user',
      content: 'I need a professional outfit for a job interview, budget max 200€',
      timestamp: new Date('2024-01-15T10:00:00'),
    },
    {
      id: 'm2',
      role: 'assistant',
      content:
        'Absolutely! Given the filters (budget $200, smart casual style, partial), here is an excellent proposal for the requested items:',
      timestamp: new Date('2024-01-15T10:00:30'),
      outfit: {
        id: 'outfit1',
        totalPrice: 199.97,
        items: [
          {
            id: 'item1',
            name: 'Navy Blue Blazer',
            price: 89.99,
            category: 'blazer',
            brand: 'J.Crew',
            imageUrl: 'https://via.placeholder.com/300x400?text=Navy+Blazer',
            link: '#',
          },
          {
            id: 'item2',
            name: 'Oxford Shirt',
            price: 49.99,
            category: 'shirt',
            brand: 'Brooks Brothers',
            imageUrl: 'https://via.placeholder.com/300x400?text=Oxford+Shirt',
            link: '#',
          },
          {
            id: 'item3',
            name: 'Chino Pants',
            price: 59.99,
            category: 'pants',
            brand: 'Banana Republic',
            imageUrl: 'https://via.placeholder.com/300x400?text=Chino+Pants',
            link: '#',
          },
        ],
      },
    },
  ],
  '2': [
    {
      id: 'm3',
      role: 'user',
      content: 'I need an elegant outfit for a summer wedding',
      timestamp: new Date('2024-01-10T14:30:00'),
    },
    {
      id: 'm4',
      role: 'assistant',
      content:
        "Perfect! Here's a stylish summer wedding outfit that will make you look elegant and feel comfortable:",
      timestamp: new Date('2024-01-10T14:30:45'),
      outfit: {
        id: 'outfit2',
        totalPrice: 245.97,
        items: [
          {
            id: 'item4',
            name: 'Light Linen Suit',
            price: 149.99,
            category: 'blazer',
            brand: 'Hugo Boss',
            imageUrl: 'https://via.placeholder.com/300x400?text=Linen+Suit',
            link: '#',
          },
          {
            id: 'item5',
            name: 'White Dress Shirt',
            price: 45.99,
            category: 'shirt',
            brand: 'Ralph Lauren',
            imageUrl: 'https://via.placeholder.com/300x400?text=White+Shirt',
            link: '#',
          },
          {
            id: 'item6',
            name: 'Brown Leather Loafers',
            price: 49.99,
            category: 'shoes',
            brand: 'Cole Haan',
            imageUrl: 'https://via.placeholder.com/300x400?text=Loafers',
            link: '#',
          },
        ],
        explanation:
          "This light linen suit is perfect for a summer wedding - breathable and elegant. The white dress shirt adds a classic touch, and the brown leather loafers complete the sophisticated look while keeping you comfortable throughout the event.",
      },
    },
  ],
};

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory] = useState<ChatHistory[]>(MOCK_CHAT_HISTORY);
  const [filters, setFilters] = useState<OutfitFilters>({
    budgetMax: undefined,
    outfitType: 'full',
    selectedItems: [],
  });

  // Auth context
  const { isAuthenticated, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  const userName = user?.name || 'Guest';

  // Custom hooks
  const { messages, isLoading, currentChatId, loadChatMessages, sendMessage, explainOutfit, clearMessages } = useChatMessages();
  
  const {
    selectedImage,
    imagePreview,
    isDragging,
    handleImageSelect,
    handleRemoveImage,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearImage,
  } = useImageUpload();

  const handleNewChat = () => {
    clearMessages();
    setInputMessage('');
    clearImage();
    setFilters({
      budgetMax: undefined,
      outfitType: 'full',
      selectedItems: [],
    });
  };

  const handleSelectChat = (chatId: string) => {
    const chatMessages = MOCK_CHAT_MESSAGES[chatId] || [];
    loadChatMessages(chatId, chatMessages);

    const chatFilters = MOCK_CHAT_FILTERS[chatId];
    if (chatFilters) {
      setFilters(chatFilters);
    }

    console.log('Loaded chat:', chatId, 'with', chatMessages.length, 'messages');
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage, imagePreview || undefined, filters, () => {
      setInputMessage('');
      clearImage();
    });
  };

  const showEmptyState = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag and Drop Overlay */}
        {isDragging && <DragDropOverlay />}

        <Header />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {showEmptyState ? (
            <ChatEmptyState isLoggedIn={isLoggedIn} userName={userName} />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onExplainOutfit={explainOutfit}
                />
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-border px-6 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-text-medium rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-text-medium rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-text-medium rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          filters={filters}
          setFilters={setFilters}
          imagePreview={imagePreview}
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
          onRemoveImage={handleRemoveImage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatPage;
