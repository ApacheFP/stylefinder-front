import { forwardRef, useEffect, useRef } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  imagePreview: string | null;
  selectedImage: File | null;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      inputMessage,
      setInputMessage,
      imagePreview,
      selectedImage,
      onImageSelect,
      onRemoveImage,
      onSendMessage,
      isLoading,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [inputMessage]);

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSendMessage();
      }
    };

    return (
      <div className="px-4 sm:px-8 py-4 sm:py-6 bg-background dark:bg-gray-900 border-t border-border dark:border-gray-800">
        <div className="max-w-[992px] mx-auto">
          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mb-4 relative inline-block group"
              >
                <div className="relative rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={onRemoveImage}
                      className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Box */}
          <div className="flex gap-3 items-end bg-white dark:bg-gray-800 border border-[#CED4DA] dark:border-gray-600 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-2 pl-4 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={onImageSelect}
              className="hidden"
              aria-label="Upload image file"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mb-2 text-text-medium hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full"
              title="Upload image"
              type="button"
              aria-label="Upload image"
            >
              <Plus className="w-5 h-5" />
            </button>

            <textarea
              ref={(node) => {
                textareaRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me for a style tip..."
              rows={1}
              className="flex-1 py-3 font-inter text-[15px] text-text-dark dark:text-white placeholder:text-text-light dark:placeholder-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-transparent bg-transparent resize-none max-h-[200px] overflow-y-auto placeholder-shimmer"
              style={{ minHeight: '44px', outline: 'none', border: 'none', boxShadow: 'none' }}
              aria-label="Message input"
            />

            <motion.button
              onClick={onSendMessage}
              disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: (!inputMessage.trim() && !selectedImage) ? 0.8 : 1,
                opacity: (!inputMessage.trim() && !selectedImage) ? 0.5 : 1
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full w-10 h-10 p-0 flex items-center justify-center mb-1 transition-colors shadow-sm ${(!inputMessage.trim() && !selectedImage) || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary-hover'
                }`}
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </motion.button>
          </div>

          <div className="text-center mt-2">
            <p className="text-[11px] text-text-light">
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
