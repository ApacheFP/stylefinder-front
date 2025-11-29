/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// No module mock, we will spy on the object methods directly

// Test component to consume context
const TestComponent = () => {
    const { user, isAuthenticated, isLoading, login, signUp, logout } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div data-testid="user-name">{user?.name}</div>
            <button onClick={() => login('test@example.com', 'password')}>Login</button>
            <button onClick={() => signUp('New User', 'new@example.com', 'password')}>SignUp</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        // Spy on all methods and provide default mock implementations
        vi.spyOn(authService, 'getCurrentUser').mockImplementation(vi.fn());
        vi.spyOn(authService, 'login').mockImplementation(vi.fn());
        vi.spyOn(authService, 'signUp').mockImplementation(vi.fn());
        vi.spyOn(authService, 'logout').mockImplementation(vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('checks session on mount', async () => {
        const mockUser = { id: '1', name: 'Test User', email: 'test@example.com', preferences: {} };
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser as any);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
            expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
        });
    });

    it('handles no active session', async () => {
        vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('No session'));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
        });
    });

    it('login updates user state', async () => {
        const user = userEvent.setup();
        vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('No session'));
        const mockUser = { id: '1', name: 'Logged In User', email: 'test@example.com', preferences: {} };
        vi.mocked(authService.login).mockResolvedValue({ user: mockUser as any });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
        });

        await user.click(screen.getByText('Login'));

        expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        });
        expect(screen.getByTestId('user-name')).toHaveTextContent('Logged In User');
    });

    it('signUp updates user state', async () => {
        const user = userEvent.setup();
        vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('No session'));
        const mockUser = { id: '2', name: 'New User', email: 'new@example.com', preferences: {} };
        vi.mocked(authService.signUp).mockResolvedValue({ user: mockUser as any });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
        });

        await user.click(screen.getByText('SignUp'));

        expect(authService.signUp).toHaveBeenCalledWith({ name: 'New User', email: 'new@example.com', password: 'password' });

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        });
        expect(screen.getByTestId('user-name')).toHaveTextContent('New User');
    });

    it('logout clears user state', async () => {
        const user = userEvent.setup();
        const mockUser = { id: '1', name: 'Test User', email: 'test@example.com', preferences: {} };
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser as any);
        vi.mocked(authService.logout).mockResolvedValue();

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        });

        await user.click(screen.getByText('Logout'));

        expect(authService.logout).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
        });
        expect(screen.getByTestId('user-name')).toBeEmptyDOMElement();
    });

    it('throws error when used outside provider', () => {
        // Suppress console.error as React logs errors when boundary catches or render fails
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider');

        consoleSpy.mockRestore();
    });
});
