/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from './ChatInput';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, disabled, ...props }: any) => (
            <button onClick={onClick} disabled={disabled} {...props}>
                {children}
            </button>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ChatInput', () => {
    const defaultProps = {
        inputMessage: '',
        setInputMessage: vi.fn(),
        imagePreview: null,
        selectedImage: null,
        onImageSelect: vi.fn(),
        onRemoveImage: vi.fn(),
        onSendMessage: vi.fn(),
        isLoading: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<ChatInput {...defaultProps} />);

        expect(screen.getByPlaceholderText('Ask me for a style tip...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Upload image' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    });

    it('updates input message on change', () => {
        render(<ChatInput {...defaultProps} />);

        const textarea = screen.getByPlaceholderText('Ask me for a style tip...');
        fireEvent.change(textarea, { target: { value: 'Hello' } });

        expect(defaultProps.setInputMessage).toHaveBeenCalledWith('Hello');
    });

    it('calls onSendMessage when send button is clicked', () => {
        render(<ChatInput {...defaultProps} inputMessage="Hello" />);

        const sendButton = screen.getByRole('button', { name: 'Send message' });
        fireEvent.click(sendButton);

        expect(defaultProps.onSendMessage).toHaveBeenCalled();
    });

    it('calls onSendMessage when Enter is pressed', () => {
        render(<ChatInput {...defaultProps} inputMessage="Hello" />);

        const textarea = screen.getByPlaceholderText('Ask me for a style tip...');
        fireEvent.keyDown(textarea, { key: 'Enter' });

        expect(defaultProps.onSendMessage).toHaveBeenCalled();
    });

    it('does not call onSendMessage when Shift+Enter is pressed', () => {
        render(<ChatInput {...defaultProps} inputMessage="Hello" />);

        const textarea = screen.getByPlaceholderText('Ask me for a style tip...');
        fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

        expect(defaultProps.onSendMessage).not.toHaveBeenCalled();
    });

    it('disables send button when input is empty and no image', () => {
        render(<ChatInput {...defaultProps} inputMessage="" selectedImage={null} />);

        const sendButton = screen.getByRole('button', { name: 'Send message' });
        expect(sendButton).toBeDisabled();
    });

    it('enables send button when input has text', () => {
        render(<ChatInput {...defaultProps} inputMessage="Hello" />);

        const sendButton = screen.getByRole('button', { name: 'Send message' });
        expect(sendButton).not.toBeDisabled();
    });

    it('enables send button when image is selected', () => {
        render(<ChatInput {...defaultProps} selectedImage={new File([], 'test.jpg')} />);

        const sendButton = screen.getByRole('button', { name: 'Send message' });
        expect(sendButton).not.toBeDisabled();
    });

    it('shows image preview when imagePreview is provided', () => {
        render(<ChatInput {...defaultProps} imagePreview="preview.jpg" />);

        expect(screen.getByAltText('Preview')).toBeInTheDocument();
        expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'preview.jpg');
    });

    it('calls onRemoveImage when remove button is clicked', () => {
        render(<ChatInput {...defaultProps} imagePreview="preview.jpg" />);

        // Find the remove button (it has an X icon, but no text)
        // We can find it by looking for the button inside the preview container
        // Or by role if we add aria-label, but the component doesn't have it on that button.
        // It's the button inside the motion.div that renders the preview.

        const previewImg = screen.getByAltText('Preview');
        const removeButton = previewImg.parentElement?.querySelector('button');

        fireEvent.click(removeButton!);

        expect(defaultProps.onRemoveImage).toHaveBeenCalled();
    });

    it('triggers file input click when upload button is clicked', () => {
        render(<ChatInput {...defaultProps} />);

        const fileInput = screen.getByLabelText('Upload image file');
        const clickSpy = vi.spyOn(fileInput, 'click');

        const uploadButton = screen.getByRole('button', { name: 'Upload image' });
        fireEvent.click(uploadButton);

        expect(clickSpy).toHaveBeenCalled();
    });

    it('calls onImageSelect when file is selected', () => {
        render(<ChatInput {...defaultProps} />);

        const fileInput = screen.getByLabelText('Upload image file');
        fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } });

        expect(defaultProps.onImageSelect).toHaveBeenCalled();
    });

    it('shows loading spinner when isLoading is true', () => {
        render(<ChatInput {...defaultProps} isLoading={true} inputMessage="Hello" />);

        const sendButton = screen.getByRole('button', { name: 'Send message' });
        expect(sendButton).toBeDisabled();
        // Check for spinner class or element
        expect(sendButton.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('forwards ref to textarea', () => {
        const ref = { current: null };
        render(<ChatInput {...defaultProps} ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('auto-resizes textarea on input change', () => {
        const { rerender } = render(<ChatInput {...defaultProps} />);

        const textarea = screen.getByPlaceholderText('Ask me for a style tip...');

        // Mock scrollHeight
        Object.defineProperty(textarea, 'scrollHeight', { value: 100, configurable: true });

        // Re-render with new inputMessage to trigger useEffect
        rerender(<ChatInput {...defaultProps} inputMessage="New content" />);

        expect(textarea.style.height).toBe('100px');
    });
});
