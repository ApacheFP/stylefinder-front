/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { showToast } from '../utils/toast';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock authService
vi.mock('../services/authService', () => ({
    authService: {
        updateProfile: vi.fn(),
        changePassword: vi.fn(),
        deleteAccount: vi.fn(),
        getCurrentUser: vi.fn(),
    },
}));

// Mock toast
vi.mock('../utils/toast', () => ({
    showToast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock Modal
vi.mock('../components/ui/Modal', () => ({
    default: ({ isOpen, children }: any) => (
        isOpen ? <div data-testid="modal">{children}</div> : null
    ),
}));

// Mock Button
vi.mock('../components/ui/Button', () => ({
    default: ({ children, onClick, disabled, type, ...props }: any) => (
        <button onClick={onClick} disabled={disabled} type={type} {...props}>
            {children}
        </button>
    ),
}));

// Mock Input
vi.mock('../components/ui/Input', () => ({
    default: ({ label, value, onChange, placeholder, type, disabled, required }: any) => (
        <div>
            <label>{label}</label>
            <input
                type={type || 'text'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
            />
        </div>
    ),
}));

// Mock Skeleton
vi.mock('../components/ui/Skeleton', () => ({
    default: () => <div data-testid="skeleton" />,
}));

const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
};

// Helper to render with AuthContext
const renderWithAuth = (ui: React.ReactNode) => {
    // We need to mock useAuth hook behavior. 
    // Since AuthProvider uses authService.getCurrentUser, we can mock that.
    // But easier to mock the hook directly if we exported it, or mock the module.
    // Here we will mock the module '../context/AuthContext'
    return render(
        <BrowserRouter>
            {ui}
        </BrowserRouter>
    );
};

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
    AuthProvider: ({ children }: any) => <>{children}</>,
}));

import { useAuth } from '../context/AuthContext';

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: mockUser,
            isLoading: false,
        });
    });

    it('renders loading state', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            isLoading: true,
        });

        renderWithAuth(<ProfilePage />);
        expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });

    it('renders profile not found state', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            isLoading: false,
        });

        renderWithAuth(<ProfilePage />);
        expect(screen.getByText('Profile Not Found')).toBeInTheDocument();
    });

    it('renders user profile', () => {
        renderWithAuth(<ProfilePage />);

        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('updates profile name', async () => {
        renderWithAuth(<ProfilePage />);

        const nameInput = screen.getByDisplayValue('Test User');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });

        const saveButton = screen.getByText('Update Profile').closest('button');
        fireEvent.click(saveButton!);

        await waitFor(() => {
            expect(authService.updateProfile).toHaveBeenCalledWith({ name: 'New Name' });
            expect(showToast.success).toHaveBeenCalledWith('Profile updated successfully');
        });
    });

    it('shows error when updating profile fails', async () => {
        (authService.updateProfile as any).mockRejectedValue(new Error('Failed'));

        renderWithAuth(<ProfilePage />);

        const nameInput = screen.getByDisplayValue('Test User');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });

        const saveButton = screen.getByText('Update Profile').closest('button');
        fireEvent.click(saveButton!);

        await waitFor(() => {
            expect(showToast.error).toHaveBeenCalledWith('Failed to update profile');
        });
    });

    it('validates password change', async () => {
        renderWithAuth(<ProfilePage />);

        const currentPassInput = screen.getByPlaceholderText('Enter current password');
        const newPassInput = screen.getByPlaceholderText('Min. 6 characters');
        const confirmPassInput = screen.getByPlaceholderText('Re-enter new password');

        fireEvent.change(currentPassInput, { target: { value: 'oldpass' } });
        fireEvent.change(newPassInput, { target: { value: 'newpass' } });
        fireEvent.change(confirmPassInput, { target: { value: 'mismatch' } });

        const changePassButton = screen.getByText('Save Changes').closest('button');
        fireEvent.click(changePassButton!);

        expect(showToast.error).toHaveBeenCalledWith('New passwords do not match');
        expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('changes password successfully', async () => {
        renderWithAuth(<ProfilePage />);

        const currentPassInput = screen.getByPlaceholderText('Enter current password');
        const newPassInput = screen.getByPlaceholderText('Min. 6 characters');
        const confirmPassInput = screen.getByPlaceholderText('Re-enter new password');

        fireEvent.change(currentPassInput, { target: { value: 'oldpass' } });
        fireEvent.change(newPassInput, { target: { value: 'newpass' } });
        fireEvent.change(confirmPassInput, { target: { value: 'newpass' } });

        const changePassButton = screen.getByText('Save Changes').closest('button');
        fireEvent.click(changePassButton!);

        await waitFor(() => {
            expect(authService.changePassword).toHaveBeenCalledWith({
                current: 'oldpass',
                new: 'newpass',
            });
            expect(showToast.success).toHaveBeenCalledWith('Password updated successfully');
        });
    });

    it('opens delete account modal', () => {
        renderWithAuth(<ProfilePage />);

        const deleteButton = screen.getByText('Delete Account', { selector: 'button' });
        fireEvent.click(deleteButton);

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('deletes account when confirmed', async () => {
        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });

        renderWithAuth(<ProfilePage />);

        // Open modal
        const deleteButton = screen.getByText('Delete Account', { selector: 'button' });
        fireEvent.click(deleteButton);

        // Type confirmation
        const confirmInput = screen.getByPlaceholderText('Type DELETE to confirm');
        fireEvent.change(confirmInput, { target: { value: 'DELETE' } });

        // Click confirm delete
        // There are two "Delete Account" buttons now (one in main page, one in modal)
        // The modal one is likely the last one or we can find by specific text/class
        const confirmDeleteButton = screen.getAllByText('Delete Account').pop()?.closest('button');
        fireEvent.click(confirmDeleteButton!);

        await waitFor(() => {
            expect(authService.deleteAccount).toHaveBeenCalled();
            expect(showToast.success).toHaveBeenCalledWith(expect.stringContaining('Account deleted'));
        });
    });
});
