import { forwardRef } from 'react';
import { Paperclip } from 'lucide-react';
import Button from '../ui/Button';
import { Send } from "lucide-react";

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

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
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
  return (
    <div className="px-4 sm:px-8 py-4 sm:py-5 bg-background border-t border-border">
      <div className="max-w-[900px] mx-auto">
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
                  onClick={onRemoveImage}
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
            onChange={onImageSelect}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="text-text-medium hover:text-text-dark transition-colors cursor-pointer"
          >
            <Paperclip className="w-5 h-5" />
          </label>

          <input
            ref={ref}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
            placeholder="Ask me for a style tip or upload an outfit photo..."
            className="flex-1 py-3 font-inter text-[15px] text-text-dark placeholder:text-text-light focus:outline-none bg-transparent"
          />

          <Button
            onClick={onSendMessage}
            disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
            variant="primary"
            size="md"
            className="rounded-full"
            aria-label="Invia messaggio"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
