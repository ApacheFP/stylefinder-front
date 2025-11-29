/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';

// Mock hooks
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../utils/toast', () => ({
    showToast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock components
vi.mock('../components/ui/Input', () => ({
    default: ({ label, value, onChange, placeholder, type, required }: any) => (
        <div>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                data-testid={`input-${label.toLowerCase()}`}
            />
        </div>
    ),
}));

vi.mock('../components/ui/Button', () => ({
    default: ({ children, type, isLoading, onClick }: any) => (
        <button type={type} onClick={onClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : children}
        </button>
    ),
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ login: mockLogin });
    });

    it('renders login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Log In to StyleFinder AI')).toBeInTheDocument();
        expect(screen.getByTestId('input-email')).toBeInTheDocument();
        expect(screen.getByTestId('input-password')).toBeInTheDocument();
        expect(screen.getByText('Log In', { selector: 'button' })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByTestId('input-email');
        const passwordInput = screen.getByTestId('input-password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('submits form successfully', async () => {
        mockLogin.mockResolvedValue(undefined);

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Log In', { selector: 'button' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(showToast.success).toHaveBeenCalledWith('Welcome back!');
            expect(mockNavigate).toHaveBeenCalledWith('/chat');
        });
    });

    it('handles login failure', async () => {
        mockLogin.mockRejectedValue(new Error('Login failed'));

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'wrong' } });

        fireEvent.click(screen.getByText('Log In', { selector: 'button' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
            expect(showToast.error).toHaveBeenCalledWith('Invalid email or password');
        });
    });
});
