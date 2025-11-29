/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatEmptyState from './ChatEmptyState';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
    },
}));

// Mock ParticleBackground
vi.mock('../ui/ParticleBackground', () => ({
    default: () => <div data-testid="particle-background" />,
}));

describe('ChatEmptyState', () => {
    it('renders correctly for logged in user', () => {
        render(<ChatEmptyState isLoggedIn={true} userName="Test User" />);

        expect(screen.getByText('Hi Test User!')).toBeInTheDocument();
        expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
    });

    it('renders correctly for guest user', () => {
        render(<ChatEmptyState isLoggedIn={false} userName="" />);

        expect(screen.getByText('StyleFinder AI')).toBeInTheDocument();
        expect(screen.getByText('What would you like to find today?')).toBeInTheDocument();
    });

    it('renders suggestions when onSuggestionClick is provided', () => {
        render(
            <ChatEmptyState
                isLoggedIn={true}
                userName="Test User"
                onSuggestionClick={vi.fn()}
            />
        );

        expect(screen.getByText('Professional outfit for job interview')).toBeInTheDocument();
        expect(screen.getByText('Casual outfit for weekend')).toBeInTheDocument();
        expect(screen.getByText('Summer wedding guest look')).toBeInTheDocument();
    });

    it('does not render suggestions when onSuggestionClick is missing', () => {
        render(
            <ChatEmptyState
                isLoggedIn={true}
                userName="Test User"
            />
        );

        expect(screen.queryByText('Professional outfit for job interview')).not.toBeInTheDocument();
    });

    it('calls onSuggestionClick when a suggestion is clicked', () => {
        const handleSuggestionClick = vi.fn();
        render(
            <ChatEmptyState
                isLoggedIn={true}
                userName="Test User"
                onSuggestionClick={handleSuggestionClick}
            />
        );

        fireEvent.click(screen.getByText('Professional outfit for job interview'));

        expect(handleSuggestionClick).toHaveBeenCalledWith(
            expect.stringContaining('I need a professional outfit')
        );
    });
});
