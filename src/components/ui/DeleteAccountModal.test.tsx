/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import DeleteAccountModal from './DeleteAccountModal';

describe('DeleteAccountModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn().mockResolvedValue(undefined),
        isDeleting: false,
    };

    it('renders when open', () => {
        render(<DeleteAccountModal {...defaultProps} />);

        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type DELETE to confirm')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<DeleteAccountModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    });

    it('has disabled confirm button until DELETE is typed', () => {
        render(<DeleteAccountModal {...defaultProps} />);

        const confirmButton = screen.getByRole('button', { name: /Delete Account/i });
        expect(confirmButton).toBeDisabled();
    });

    it('enables confirm button when DELETE is typed', () => {
        render(<DeleteAccountModal {...defaultProps} />);

        const input = screen.getByPlaceholderText('Type DELETE to confirm');
        fireEvent.change(input, { target: { value: 'DELETE' } });

        const confirmButton = screen.getByRole('button', { name: /Delete Account/i });
        expect(confirmButton).not.toBeDisabled();
    });

    it('calls onClose when cancel is clicked', () => {
        const onClose = vi.fn();
        render(<DeleteAccountModal {...defaultProps} onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('shows deleting state', () => {
        render(<DeleteAccountModal {...defaultProps} isDeleting={true} />);

        expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });
});
