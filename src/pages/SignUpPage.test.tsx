/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from './SignUpPage';
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

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock ParticleBackground to avoid ThemeProvider dependency
vi.mock('../components/ui/ParticleBackground', () => ({
    default: () => <div data-testid="particle-background" />,
}));

// Mock GoogleLoginButton
vi.mock('../components/ui/GoogleLoginButton', () => ({
    default: () => <div data-testid="google-login-button" />,
}));

describe('SignUpPage', () => {
    const mockSignUp = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ signUp: mockSignUp });
    });

    it('renders signup form', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Create Your Account')).toBeInTheDocument();
        expect(screen.getByTestId('input-name')).toBeInTheDocument();
        expect(screen.getByTestId('input-email')).toBeInTheDocument();
        expect(screen.getByTestId('input-password')).toBeInTheDocument();
        expect(screen.getByText('Sign Up', { selector: 'button' })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        const nameInput = screen.getByTestId('input-name');
        const emailInput = screen.getByTestId('input-email');
        const passwordInput = screen.getByTestId('input-password');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('submits form successfully', async () => {
        mockSignUp.mockResolvedValue(undefined);

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Sign Up', { selector: 'button' }));

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('John Doe', 'test@example.com', 'password123');
            expect(showToast.success).toHaveBeenCalledWith('Account created successfully!');
            expect(mockNavigate).toHaveBeenCalledWith('/preferences');
        });
    });

    it('handles signup failure', async () => {
        mockSignUp.mockRejectedValue(new Error('Signup failed'));

        render(
            <BrowserRouter>
                <SignUpPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Sign Up', { selector: 'button' }));

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalled();
            expect(screen.getByText('Failed to create account. Please try again.')).toBeInTheDocument();
            expect(showToast.error).toHaveBeenCalledWith('Failed to create account. Please try again.');
        });
    });
});
