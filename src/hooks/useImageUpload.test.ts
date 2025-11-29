/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from './useImageUpload';
import { showToast } from '../utils/toast';

vi.mock('../utils/toast', () => ({
    showToast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

describe('useImageUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('initializes with empty state', () => {
        const { result } = renderHook(() => useImageUpload());
        expect(result.current.selectedImage).toBeNull();
        expect(result.current.imagePreview).toBeNull();
    });

    it('handles valid image selection', async () => {
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });

        // Mock FileReader
        const mockFileReader = {
            readAsDataURL: vi.fn(),
            result: 'data:image/png;base64,dummy',
            onloadend: null as any,
        };

        const mockFactory = () => mockFileReader as any;

        const { result } = renderHook(() => useImageUpload(mockFactory));

        act(() => {
            const event = {
                target: { files: [file] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleImageSelect(event);
        });

        // Trigger onloadend manually
        act(() => {
            if (mockFileReader.onloadend) {
                mockFileReader.onloadend({} as any);
            }
        });

        expect(result.current.selectedImage).toBe(file);
        expect(result.current.imagePreview).toBe('data:image/png;base64,dummy');
        expect(showToast.success).toHaveBeenCalledWith('Image attached successfully');
    });

    it('validates file type', () => {
        const { result } = renderHook(() => useImageUpload());
        const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });

        act(() => {
            const event = {
                target: { files: [file] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleImageSelect(event);
        });

        expect(showToast.error).toHaveBeenCalledWith('Please select an image file (JPEG, PNG, WebP)');
        expect(result.current.selectedImage).toBeNull();
    });

    it('validates file size', () => {
        const { result } = renderHook(() => useImageUpload());
        // Create a large file (6MB)
        const largeFile = {
            name: 'large.png',
            type: 'image/png',
            size: 6 * 1024 * 1024,
            startsWith: () => true // Mock startsWith for type check
        } as unknown as File;
        // Ensure type check passes so we hit size check
        Object.defineProperty(largeFile, 'type', { value: 'image/png' });

        act(() => {
            const event = {
                target: { files: [largeFile] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleImageSelect(event);
        });

        expect(showToast.error).toHaveBeenCalledWith('Image size must be less than 5MB');
        expect(result.current.selectedImage).toBeNull();
    });

    it('clears image', () => {
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });

        // Mock FileReader for setup
        const mockFileReader = {
            readAsDataURL: vi.fn(),
            result: 'data:image/png;base64,dummy',
            onloadend: null as any,
        };

        const mockFactory = () => mockFileReader as any;

        const { result } = renderHook(() => useImageUpload(mockFactory));

        act(() => {
            const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
            result.current.handleImageSelect(event);
        });

        // Trigger onloadend manually
        act(() => {
            if (mockFileReader.onloadend) {
                mockFileReader.onloadend({} as any);
            }
        });
        expect(result.current.selectedImage).toBe(file);

        act(() => {
            result.current.clearImage();
        });

        expect(result.current.selectedImage).toBeNull();
        expect(result.current.imagePreview).toBeNull();
    });
});
