import React, { useState, useRef } from 'react';
import { Paperclip, ChevronDown } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import type { ChatMessage, ChatHistory, OutfitFilters } from '../types';

// Mock data
const MOCK_CHAT_HISTORY: ChatHistory[] = [
  { id: '1', title: 'Interview outfit 200€', lastMessage: new Date() },
  { id: '2', title: 'Summer wedding look', lastMessage: new Date() },
];

// Mock chat filters for each conversation
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

// Mock chat messages for each conversation
const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
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
      content: "Absolutely! Given the filters (budget $200, smart casual style, partial), here is an excellent proposal for the requested items:",
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
        // explanation: Initially not generated - user must click "Explain this outfit"
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
      content: "Perfect! Here's a stylish summer wedding outfit that will make you look elegant and feel comfortable:",
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
        explanation: "This light linen suit is perfect for a summer wedding - breathable and elegant. The white dress shirt adds a classic touch, and the brown leather loafers complete the sophisticated look while keeping you comfortable throughout the event.",
        // This chat already has explanation (to test the disabled button state)
      },
    },
  ],
};

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>(MOCK_CHAT_HISTORY);
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  
  const [filters, setFilters] = useState<OutfitFilters>({
    budgetMax: undefined,
    outfitType: 'full',
    selectedItems: [],
  });

  // Get auth state from AuthContext
  const { isAuthenticated, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  const userName = user?.name || 'Guest';

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
    setInputMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    // Reset filters to default
    setFilters({
      budgetMax: undefined,
      outfitType: 'full',
      selectedItems: [],
    });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    
    // Load chat messages (mock data)
    // TODO: Replace with API call when backend is ready
    const chatMessages = MOCK_CHAT_MESSAGES[chatId] || [];
    setMessages(chatMessages);
    
    // Load chat filters
    const chatFilters = MOCK_CHAT_FILTERS[chatId];
    if (chatFilters) {
      setFilters(chatFilters);
    }
    
    console.log('Loaded chat:', chatId, 'with', chatMessages.length, 'messages and filters:', chatFilters);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    // Create user message with optional image
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage || 'Attached an image',
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // TODO: Call API to get outfit recommendations with image
    // For now, use mock response
    // In real implementation:
    // const formData = new FormData();
    // formData.append('message', inputMessage);
    // if (selectedImage) {
    //   formData.append('image', selectedImage);
    // }
    // formData.append('filters', JSON.stringify(filters));
    // const response = await chatService.sendMessage(currentChatId, formData);

    // Clear image after sending
    setSelectedImage(null);
    setImagePreview(null);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Absolutely! Here's a great outfit recommendation based on your request:",
        timestamp: new Date(),
        outfit: {
          id: Date.now().toString(),
          totalPrice: 199.97,
          items: [
            {
              id: 'new1',
              name: 'Navy Blue Blazer',
              price: 89.99,
              category: 'blazer',
              brand: 'J.Crew',
              imageUrl: 'https://via.placeholder.com/300x400?text=Navy+Blazer',
              link: '#',
            },
            {
              id: 'new2',
              name: 'Oxford Shirt',
              price: 49.99,
              category: 'shirt',
              brand: 'Brooks Brothers',
              imageUrl: 'https://via.placeholder.com/300x400?text=Oxford+Shirt',
              link: '#',
            },
            {
              id: 'new3',
              name: 'Chino Pants',
              price: 59.99,
              category: 'pants',
              brand: 'Banana Republic',
              imageUrl: 'https://via.placeholder.com/300x400?text=Chino+Pants',
              link: '#',
            },
          ],
          explanation: "This 'smart casual' combination is perfect for an interview. The Navy Blazer projects professionalism and confidence. The Oxford Shirt is a timeless classic that keeps the look clean, and the Chino Pants are more relaxed than suit trousers, hitting the 'smart casual' note perfectly while staying well within your $200 budget.",
        },
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // If this is a new chat (no currentChatId), we could create a new chat history entry
      // TODO: When backend is ready, save the new conversation
      if (!currentChatId) {
        console.log('New conversation started - will be saved to backend');
      }
    }, 1500);
  };

  const handleExplainOutfit = async (messageId: string, outfitId: string) => {
    // Find the message in the current messages
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || !messages[messageIndex].outfit) return;

    // Check if explanation already exists
    if (messages[messageIndex].outfit?.explanation) {
      console.log('Explanation already generated');
      return;
    }

    console.log('Requesting explanation for outfit:', outfitId);
    
    // TODO: Call API to generate explanation
    // For now, simulate API call with timeout
    setTimeout(() => {
      const mockExplanation = "This outfit combination works perfectly because the Navy Blazer adds a professional touch while remaining versatile. The Oxford Shirt provides a clean, classic foundation that pairs well with almost any blazer. The Chino Pants strike the perfect balance between formal and casual, making them ideal for a smart casual setting. Together, these pieces create a cohesive look that's both polished and comfortable.";
      
      // Update the message with the explanation
      setMessages(prev => {
        const updated = [...prev];
        if (updated[messageIndex].outfit) {
          updated[messageIndex] = {
            ...updated[messageIndex],
            outfit: {
              ...updated[messageIndex].outfit!,
              explanation: mockExplanation,
            }
          };
        }
        return updated;
      });

      // TODO: Save explanation to backend
      // POST /chats/:chatId/messages/:messageId/explanation
      console.log('Explanation generated and saved to backend');
    }, 1000);
  };

  // Show empty state if no messages
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
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center transition-all duration-200 pointer-events-none">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-primary border-dashed transform scale-100 transition-transform duration-200">
              <div className="text-center">
                <Paperclip className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-roboto font-bold text-text-dark mb-2">
                  Drop your image here
                </h3>
                <p className="text-text-medium font-inter">
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                </p>
              </div>
            </div>
          </div>
        )}
        <Header />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {showEmptyState ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              {isLoggedIn ? (
                <>
                  <h2 className="text-[32px] font-roboto font-bold text-text-dark mb-2">Hi {userName}!</h2>
                  <p className="font-inter text-[15.8px] text-text-light">How can I help you today?</p>
                </>
              ) : (
                <>
                  <h2 className="text-[32px] font-roboto font-bold text-text-medium mb-2">StyleFinder AI</h2>
                  <p className="font-inter text-[15.8px] text-text-light">Ask me for a style tip to get started</p>
                </>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }`}
                >
                  {message.role === 'user' ? (
                    <div className="bg-primary text-white font-inter px-6 py-3 rounded-2xl max-w-3xl">
                      {message.imageUrl && (
                        <img 
                          src={message.imageUrl} 
                          alt="User uploaded" 
                          className="rounded-lg mb-2 max-w-xs max-h-64 object-cover"
                        />
                      )}
                      {message.content}
                    </div>
                  ) : (
                    <div className="max-w-full">
                      {/* Unified white background container */}
                      <div className="bg-white border border-border rounded-2xl p-6">
                        {/* Message content */}
                        <div className="font-inter text-text-dark mb-4">
                          {message.content}
                        </div>
                        
                        {message.outfit && (
                          <>
                            {/* Product Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              {message.outfit.items.map((item) => (
                                <ProductCard key={item.id} item={item} />
                              ))}
                            </div>

                            {/* Explain Button - Only show if explanation doesn't exist */}
                            {!message.outfit.explanation ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExplainOutfit(message.id, message.outfit!.id)}
                                className="mb-4 rounded-lg"
                              >
                                Explain this outfit
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="mb-4 rounded-lg opacity-50 cursor-not-allowed"
                              >
                                Explanation shown below
                              </Button>
                            )}

                            {/* Explanation - Show if it exists */}
                            {message.outfit.explanation && (
                              <div className="bg-gray-50 border border-border rounded-xl p-6 mt-4">
                                <h4 className="font-roboto font-bold text-text-dark mb-3">
                                  Why this outfit works:
                                </h4>
                                <p className="font-inter text-text-dark leading-relaxed">
                                  {message.outfit.explanation}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
        <div className="p-8 bg-background">
          <div className="max-w-[900px] mx-auto">
            {/* Filters */}
            <div className="flex gap-4 mb-4 items-center justify-center">
              {/* Budget */}
              <div className="flex flex-col items-center gap-1.5">
                <label className="text-[13px] font-roboto font-bold text-text-medium">Budget Max</label>
                <input
                  type="text"
                  value={filters.budgetMax || ''}
                  onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-32 px-4 py-3 font-inter text-[13px] text-text-dark placeholder:text-text-muted border border-border-input rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. '150'"
                />
              </div>

              {/* Outfit Type */}
              <div className="flex flex-col items-center gap-1.5">
                <label className="text-[13px] font-roboto font-bold text-text-medium">Outfit Type</label>
                <div className="relative">
                  <select
                    value={filters.outfitType}
                    onChange={(e) => setFilters({ ...filters, outfitType: e.target.value as 'full' | 'partial' })}
                    className="w-28 px-4 py-3 pr-10 font-inter text-[14px] text-text-dark border border-border-input rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white cursor-pointer"
                  >
                    <option value="full">Full</option>
                    <option value="partial">Partial</option>
                  </select>
                  {/* Chevron Icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-text-muted" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Item Selection - Only show when Partial is selected */}
            {filters.outfitType === 'partial' && (
              <div className="mb-4 bg-white border border-border rounded-2xl p-6">
                <p className="text-center text-[15px] font-roboto font-medium text-text-dark mb-4">
                  Select the items of interest:
                </p>
                <div className="flex gap-6 items-center justify-center flex-wrap">
                  {/* Jacket / Blazer */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedItems.includes('jacket') || filters.selectedItems.includes('blazer')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFilters({
                          ...filters,
                          selectedItems: checked
                            ? [...filters.selectedItems.filter(item => item !== 'jacket' && item !== 'blazer'), 'jacket', 'blazer']
                            : filters.selectedItems.filter(item => item !== 'jacket' && item !== 'blazer')
                        });
                      }}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-[15px] font-inter text-text-dark">Jacket / Blazer</span>
                  </label>

                  {/* Shirt */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedItems.includes('shirt')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFilters({
                          ...filters,
                          selectedItems: checked
                            ? [...filters.selectedItems, 'shirt']
                            : filters.selectedItems.filter(item => item !== 'shirt')
                        });
                      }}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-[15px] font-inter text-text-dark">Shirt</span>
                  </label>

                  {/* Pants */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedItems.includes('pants')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFilters({
                          ...filters,
                          selectedItems: checked
                            ? [...filters.selectedItems, 'pants']
                            : filters.selectedItems.filter(item => item !== 'pants')
                        });
                      }}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-[15px] font-inter text-text-dark">Pants</span>
                  </label>

                  {/* Shoes */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedItems.includes('shoes')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFilters({
                          ...filters,
                          selectedItems: checked
                            ? [...filters.selectedItems, 'shoes']
                            : filters.selectedItems.filter(item => item !== 'shoes')
                        });
                      }}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-[15px] font-inter text-text-dark">Shoes</span>
                  </label>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 bg-white border border-border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="rounded-lg max-h-32 object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-inter text-text-dark">Image ready to send</p>
                    <p className="text-xs font-inter text-text-light mt-1">
                      {selectedImage?.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Box */}
            <div className="flex gap-3 items-center bg-white border border-[#CED4DA] rounded-xl shadow-lg p-2 pl-5">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label 
                htmlFor="image-upload"
                className="text-text-medium hover:text-text-dark transition-colors cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </label>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me for a style tip..."
                className="flex-1 py-3 font-inter text-[15px] text-text-dark placeholder:text-text-light focus:outline-none bg-transparent"
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
                variant="primary"
                size="md"
                className="rounded-lg"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
