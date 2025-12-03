import { render, screen, fireEvent } from '@testing-library/react';
import ChatPage from './ChatPage';

test('sends message and clears input', () => {
    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText('Type a message');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(input.value).toBe('');
});