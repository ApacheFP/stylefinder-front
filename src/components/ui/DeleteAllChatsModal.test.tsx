/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import DeleteAllChatsModal from './DeleteAllChatsModal';

describe('DeleteAllChatsModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn().mockResolvedValue(undefined),
        isDeleting: false,
    };

    it('renders when open', () => {
        render(<DeleteAllChatsModal {...defaultProps} />);

        expect(screen.getByText('Delete All Conversations?')).toBeInTheDocument();
        expect(screen.getByText(/permanently delete all your chat history/)).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<DeleteAllChatsModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Delete All Conversations?')).not.toBeInTheDocument();
    });

    it('calls onClose when cancel is clicked', () => {
        const onClose = vi.fn();
        render(<DeleteAllChatsModal {...defaultProps} onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onConfirm when delete button is clicked', () => {
        const onConfirm = vi.fn().mockResolvedValue(undefined);
        render(<DeleteAllChatsModal {...defaultProps} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByRole('button', { name: /Delete All Chats/i }));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('shows deleting state', () => {
        render(<DeleteAllChatsModal {...defaultProps} isDeleting={true} />);

        expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });

    it('disables buttons during delete', () => {
        render(<DeleteAllChatsModal {...defaultProps} isDeleting={true} />);

        expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Deleting/i })).toBeDisabled();
    });
});
