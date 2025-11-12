import { forwardRef } from 'react';
import { Paperclip, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import type { OutfitFilters } from '../../types';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  filters: OutfitFilters;
  setFilters: (filters: OutfitFilters) => void;
  imagePreview: string | null;
  selectedImage: File | null;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSendMessage: () => void;
  isLoading: boolean;
  hasMessages?: boolean; // True if there are messages in the chat
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  (
    {
      inputMessage,
      setInputMessage,
      filters,
      setFilters,
      imagePreview,
      selectedImage,
      onImageSelect,
      onRemoveImage,
      onSendMessage,
      isLoading,
      hasMessages = false,
    },
    ref
  ) => {
  return (
    <div className="px-4 sm:px-8 py-4 sm:py-5 bg-background border-t border-border">
      <div className="max-w-[900px] mx-auto">
        {/* Filters - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 items-stretch sm:items-center justify-center">
          {/* Budget */}
          <div className="flex flex-col items-center gap-1.5 flex-1 sm:flex-initial">
            <label className="text-[13px] font-roboto font-bold text-text-medium">
              Budget Max
            </label>
            <input
              type="text"
              value={filters.budgetMax || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  budgetMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              disabled={hasMessages}
              className={`w-full sm:w-32 px-4 py-3 font-inter text-[13px] text-text-dark placeholder:text-text-muted border border-border-input rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary ${
                hasMessages ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
              }`}
              placeholder="e.g. '150'"
            />
          </div>

          {/* Outfit Type */}
          <div className="flex flex-col items-center gap-1.5 flex-1 sm:flex-initial">
            <label className="text-[13px] font-roboto font-bold text-text-medium">
              Outfit Type
            </label>
            <div className="relative">
              <select
                value={filters.outfitType}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    outfitType: e.target.value as 'full' | 'partial',
                  })
                }
                disabled={hasMessages}
                className={`w-full sm:w-28 px-4 py-3 pr-10 font-inter text-[14px] text-text-dark border border-border-input rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white ${
                  hasMessages ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
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
          <div className="mb-3 bg-[#F8F9FA] border border-border rounded-2xl px-4 sm:px-8 py-2.5">
            <p className="text-center text-[13px] sm:text-[14px] font-roboto font-medium text-text-dark mb-2.5">
              Select the items of interest:
            </p>
            <div className="flex gap-3 sm:gap-5 items-center justify-center flex-wrap">
              {/* Jacket / Blazer */}
              <label className={`flex items-center gap-2 ${hasMessages ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={
                    filters.selectedItems.includes('jacket') ||
                    filters.selectedItems.includes('blazer')
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFilters({
                      ...filters,
                      selectedItems: checked
                        ? [
                            ...filters.selectedItems.filter(
                              (item) => item !== 'jacket' && item !== 'blazer'
                            ),
                            'jacket',
                            'blazer',
                          ]
                        : filters.selectedItems.filter(
                            (item) => item !== 'jacket' && item !== 'blazer'
                          ),
                    });
                  }}
                  disabled={hasMessages}
                  className={`w-[16px] h-[16px] rounded-[2px] border-2 border-gray-400 checked:border-primary checked:bg-primary appearance-none ${hasMessages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <span className="text-[15px] font-inter text-text-dark">
                  Jacket / Blazer
                </span>
              </label>

              {/* Shirt */}
              <label className={`flex items-center gap-2 ${hasMessages ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={filters.selectedItems.includes('shirt')}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFilters({
                      ...filters,
                      selectedItems: checked
                        ? [...filters.selectedItems, 'shirt']
                        : filters.selectedItems.filter((item) => item !== 'shirt'),
                    });
                  }}
                  disabled={hasMessages}
                  className={`w-[16px] h-[16px] rounded-[2px] border-2 border-gray-400 checked:border-primary checked:bg-primary appearance-none ${hasMessages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <span className="text-[15px] font-inter text-text-dark">Shirt</span>
              </label>

              {/* Pants */}
              <label className={`flex items-center gap-2 ${hasMessages ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={filters.selectedItems.includes('pants')}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFilters({
                      ...filters,
                      selectedItems: checked
                        ? [...filters.selectedItems, 'pants']
                        : filters.selectedItems.filter((item) => item !== 'pants'),
                    });
                  }}
                  disabled={hasMessages}
                  className={`w-[16px] h-[16px] rounded-[2px] border-2 border-gray-400 checked:border-primary checked:bg-primary appearance-none ${hasMessages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <span className="text-[15px] font-inter text-text-dark">Pants</span>
              </label>

              {/* Shoes */}
              <label className={`flex items-center gap-2 ${hasMessages ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={filters.selectedItems.includes('shoes')}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFilters({
                      ...filters,
                      selectedItems: checked
                        ? [...filters.selectedItems, 'shoes']
                        : filters.selectedItems.filter((item) => item !== 'shoes'),
                    });
                  }}
                  disabled={hasMessages}
                  className={`w-[16px] h-[16px] rounded-[2px] border-2 border-gray-400 checked:border-primary checked:bg-primary appearance-none ${hasMessages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
            placeholder="Ask me for a style tip..."
            className="flex-1 py-3 font-inter text-[15px] text-text-dark placeholder:text-text-light focus:outline-none bg-transparent"
          />

          <Button
            onClick={onSendMessage}
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
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
