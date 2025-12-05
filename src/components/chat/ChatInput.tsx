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

    const MAX_HEIGHT = 200;

    // Auto-resize textarea with max height limit
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Calculate new height, capped at MAX_HEIGHT
        const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
        textarea.style.height = `${newHeight}px`;
        
        // Enable/disable scroll based on content
        textarea.style.overflowY = textarea.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
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
      <div className="px-4 sm:px-8 py-4 sm:py-6 bg-background dark:bg-surface-dark border-t border-border dark:border-surface-muted">
        <div className="max-w-[992px] mx-auto">
          {/* Image Preview */}
          <AnimatePresence mode="wait">
            {imagePreview && selectedImage && (
              <motion.div
                key="image-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-3 overflow-hidden"
              >
                <div className="inline-flex items-center gap-2 px-2 py-1.5 bg-stone-100 dark:bg-surface-darker rounded-lg max-w-[200px]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-10 w-10 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <div className="overflow-hidden">
                      <span className="text-sm font-medium text-text-dark dark:text-white whitespace-nowrap inline-block animate-marquee hover:animation-paused">
                        {selectedImage.name}
                      </span>
                    </div>
                    <span className="text-xs text-text-light dark:text-stone-400">
                      {(selectedImage.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    onClick={onRemoveImage}
                    className="p-1.5 hover:bg-stone-200 dark:hover:bg-surface-muted rounded-full transition-colors flex-shrink-0"
                    type="button"
                  >
                    <X className="w-4 h-4 text-text-medium dark:text-stone-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Box */}
          <div className="flex gap-3 items-end bg-cream-100 dark:bg-surface-darker border border-cream-400 dark:border-surface-border rounded-2xl shadow-sm hover:shadow-md transition-shadow p-2 pl-4 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary">
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
              className="mb-2 text-primary/70 hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-full border border-primary/20 hover:border-primary/40"
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
              onChange={(e) => {
                // Limit to 1000 characters
                if (e.target.value.length <= 1000) {
                  setInputMessage(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe your ideal outfit or upload a photo..."
              rows={1}
              className="flex-1 py-3 font-inter text-[15px] text-text-dark dark:text-white placeholder:text-text-light dark:placeholder-stone-500 bg-transparent resize-none scrollbar-hide placeholder-shimmer"
              style={{ 
                minHeight: '44px', 
                maxHeight: `${MAX_HEIGHT}px`,
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                WebkitAppearance: 'none',
              }}
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

          <div className="text-center mt-2 flex items-center justify-center gap-2">
            <p className="text-[11px] text-text-light dark:text-stone-500">
              AI can make mistakes. Check important info.
            </p>
            {inputMessage.length > 0 && (
              <span className={`text-[10px] font-medium ${inputMessage.length > 500 ? 'text-amber-500' : 'text-text-light dark:text-stone-500'}`}>
                {inputMessage.length}/1000
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
