/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

// Mock useAuth
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock Button component
vi.mock('../ui/Button', () => ({
    default: ({ children, onClick, className, ...props }: any) => (
        <button onClick={onClick} className={className} {...props}>
            {children}
        </button>
    ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Sidebar', () => {
    const mockOnSelectChat = vi.fn();
    const mockOnNewChat = vi.fn();
    const mockOnClose = vi.fn();
    const mockOnRenameChat = vi.fn();
    const mockOnDeleteChat = vi.fn();

    const mockChatHistory = [
        { id: '1', title: 'Chat 1', lastMessage: new Date() },
        { id: '2', title: 'Chat 2', lastMessage: new Date(Date.now() - 86400000) },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when not authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

        render(
            <BrowserRouter>
                <Sidebar
                    chatHistory={[]}
                    onSelectChat={mockOnSelectChat}
                    onNewChat={mockOnNewChat}
                    onRenameChat={mockOnRenameChat}
                    onDeleteChat={mockOnDeleteChat}
                    onClose={mockOnClose}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Chat History')).toBeInTheDocument();
        expect(screen.getByText('Log in or sign up to save your conversations.')).toBeInTheDocument();
        expect(screen.getByText('New Chat')).toBeInTheDocument();
    });

    it('renders correctly when authenticated with history', () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

        render(
            <BrowserRouter>
                <Sidebar
                    chatHistory={mockChatHistory}
                    onSelectChat={mockOnSelectChat}
                    onNewChat={mockOnNewChat}
                    onRenameChat={mockOnRenameChat}
                    onDeleteChat={mockOnDeleteChat}
                    onClose={mockOnClose}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('HISTORY')).toBeInTheDocument();
        expect(screen.getByText('Chat 1')).toBeInTheDocument();
        expect(screen.getByText('Chat 2')).toBeInTheDocument();
    });

    it('renders correctly when authenticated with empty history', () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

        render(
            <BrowserRouter>
                <Sidebar
                    chatHistory={[]}
                    onSelectChat={mockOnSelectChat}
                    onNewChat={mockOnNewChat}
                    onRenameChat={mockOnRenameChat}
                    onDeleteChat={mockOnDeleteChat}
                    onClose={mockOnClose}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    });

    it('calls onNewChat when New Chat button is clicked', () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

        render(
            <BrowserRouter>
                <Sidebar
                    chatHistory={[]}
                    onSelectChat={mockOnSelectChat}
                    onNewChat={mockOnNewChat}
                    onRenameChat={mockOnRenameChat}
                    onDeleteChat={mockOnDeleteChat}
                    onClose={mockOnClose}
                />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('New Chat'));
        expect(mockOnNewChat).toHaveBeenCalled();
    });

    it('calls onSelectChat when a chat is clicked', () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

        render(
            <BrowserRouter>
                <Sidebar
                    chatHistory={mockChatHistory}
                    onSelectChat={mockOnSelectChat}
                    onNewChat={mockOnNewChat}
                    onRenameChat={mockOnRenameChat}
                    onDeleteChat={mockOnDeleteChat}
                    onClose={mockOnClose}
                />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Chat 1'));
        expect(mockOnSelectChat).toHaveBeenCalledWith('1');
    });

    it('highlights current chat', () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

        render(
            <BrowserRouter>
                <Sidebar
                    chatHistory={mockChatHistory}
                    currentChatId="1"
                    onSelectChat={mockOnSelectChat}
                    onNewChat={mockOnNewChat}
                    onRenameChat={mockOnRenameChat}
                    onDeleteChat={mockOnDeleteChat}
                    onClose={mockOnClose}
                />
            </BrowserRouter>
        );

        const chat1Button = screen.getByText('Chat 1').closest('button');
        expect(chat1Button).toHaveClass('bg-primary/5');
    });
});
