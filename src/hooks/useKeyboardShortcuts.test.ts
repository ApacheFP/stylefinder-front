import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, useEnterSubmit } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
    it('triggers action when shortcut is pressed', () => {
        const action = vi.fn();
        renderHook(() =>
            useKeyboardShortcuts([{ key: 'k', metaKey: true, action }])
        );

        const event = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            bubbles: true,
        });
        window.dispatchEvent(event);

        expect(action).toHaveBeenCalled();
    });

    it('does not trigger action when disabled', () => {
        const action = vi.fn();
        renderHook(() =>
            useKeyboardShortcuts([{ key: 'k', metaKey: true, action }], false)
        );

        const event = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            bubbles: true,
        });
        window.dispatchEvent(event);

        expect(action).not.toHaveBeenCalled();
    });

    it('handles multiple modifiers', () => {
        const action = vi.fn();
        renderHook(() =>
            useKeyboardShortcuts([
                { key: 's', metaKey: true, shiftKey: true, action },
            ])
        );

        const event = new KeyboardEvent('keydown', {
            key: 's',
            metaKey: true,
            shiftKey: true,
            bubbles: true,
        });
        window.dispatchEvent(event);

        expect(action).toHaveBeenCalled();
    });

    it('does not trigger if modifiers do not match', () => {
        const action = vi.fn();
        renderHook(() =>
            useKeyboardShortcuts([{ key: 'k', metaKey: true, action }])
        );

        const event = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: false, // Missing metaKey
            bubbles: true,
        });
        window.dispatchEvent(event);

        expect(action).not.toHaveBeenCalled();
    });
});

describe('useEnterSubmit', () => {
    it('calls onSubmit on Enter press without modifiers', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() => useEnterSubmit(onSubmit));

        const event = {
            key: 'Enter',
            preventDefault: vi.fn(),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
        } as unknown as React.KeyboardEvent<HTMLInputElement>;

        result.current.handleKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(onSubmit).toHaveBeenCalled();
    });

    it('does not call onSubmit on Shift+Enter', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() => useEnterSubmit(onSubmit));

        const event = {
            key: 'Enter',
            preventDefault: vi.fn(),
            metaKey: false,
            ctrlKey: false,
            shiftKey: true, // Shift pressed
        } as unknown as React.KeyboardEvent<HTMLInputElement>;

        result.current.handleKeyDown(event);

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('allows new line on Cmd+Enter when multiline is true', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() => useEnterSubmit(onSubmit, true));

        const event = {
            key: 'Enter',
            preventDefault: vi.fn(),
            metaKey: true, // Cmd pressed
            ctrlKey: false,
            shiftKey: false,
        } as unknown as React.KeyboardEvent<HTMLInputElement>;

        result.current.handleKeyDown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
