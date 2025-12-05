import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { preferencesService } from './preferencesService';
import api from './api';

// Mock api module
vi.mock('./api', () => {
    return {
        default: {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            interceptors: {
                response: { use: vi.fn() }
            },
            defaults: { headers: { common: {} } }
        },
    };
});

describe('preferencesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('getPreferences returns preferences object', async () => {
        const mockPrefs = { theme: 'dark', notifications: 'true' };
        const getSpy = vi.spyOn(api, 'get').mockResolvedValue({
            data: { success: true, user: { preferences: mockPrefs } }
        });

        const result = await preferencesService.getPreferences();

        expect(getSpy).toHaveBeenCalledWith('/user/session');
        expect(result).toEqual(mockPrefs);
    });

    it('getPreferences returns null on error', async () => {
        vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'));

        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const result = await preferencesService.getPreferences();

        expect(result).toBeNull();
        consoleSpy.mockRestore();
    });

    it('updatePreferences calls api put', async () => {
        const mockPrefs = { theme: 'light' };
        const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ data: { success: true } });

        const result = await preferencesService.updatePreferences(mockPrefs);

        expect(putSpy).toHaveBeenCalledWith('/preferences', mockPrefs);
        expect(result).toBe(true);
    });

    it('getAllPreferences handles array format', async () => {
        const mockPrefs = [
            { id: 1, name: 'Style' },
            { id: 2, name: 'Color' },
            { id: 4, name: 'Genere', values: ['male', 'female'] } // Include Genere to prevent auto-add
        ];
        vi.spyOn(api, 'get').mockResolvedValue({
            data: { success: true, preferences: mockPrefs }
        });

        const result = await preferencesService.getAllPreferences();

        // Result is converted to Record
        expect(Object.keys(result)).toHaveLength(3);
        expect(result['1']).toEqual({ id: 1, name: 'Style' });
    });

    it('getAllPreferences handles object format (dictionary)', async () => {
        const mockPrefs = {
            "1": "Style",
            "2": "Color",
            "success": true // Should be filtered out
        };
        vi.spyOn(api, 'get').mockResolvedValue({ data: mockPrefs });

        const result = await preferencesService.getAllPreferences();

        // Should return the object as is (minus success if filtered, but service currently returns data as is if not array)
        // Wait, the service returns response.data if not array.
        // So it returns { "1": "Style", "2": "Color", "success": true }

        expect(Array.isArray(result)).toBe(false);
        expect(result['1']).toBe('Style');
        expect(result['2']).toBe('Color');
    });
});
