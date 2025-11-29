import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import Input from './Input';
import userEvent from '@testing-library/user-event';

describe('Input Component', () => {
    it('renders correctly with label', () => {
        render(<Input label="Email Address" placeholder="Enter email" />);
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('handles user input', async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Type here" />);
        const input = screen.getByPlaceholderText('Type here');

        await user.type(input, 'Hello World');
        expect(input).toHaveValue('Hello World');
    });

    it('displays error message', () => {
        render(<Input error="Invalid email" />);
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    it('toggles password visibility', async () => {
        const user = userEvent.setup();
        render(<Input type="password" placeholder="Password" />);

        const input = screen.getByPlaceholderText('Password');
        expect(input).toHaveAttribute('type', 'password');

        const toggleButton = screen.getByRole('button', { name: /show password/i });
        await user.click(toggleButton);

        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

        await user.click(toggleButton);
        expect(input).toHaveAttribute('type', 'password');
    });
});
