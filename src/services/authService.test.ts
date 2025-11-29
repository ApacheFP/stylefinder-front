import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './authService';
import api from './api';

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('login calls api and transforms user', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', preferences: {} };
        const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { success: true, user: mockUser } });

        const result = await authService.login({ email: 'test@example.com', password: 'password' });

        expect(postSpy).toHaveBeenCalledWith('/user/login', { email: 'test@example.com', password: 'password' });
        expect(result.user).toEqual({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            preferences: {},
        });
    });

    it('signUp calls api to create user and then login', async () => {
        const mockUser = { id: 1, name: 'New User', email: 'new@example.com', preferences: {} };
        const postSpy = vi.spyOn(api, 'post')
            .mockResolvedValueOnce({ data: { success: true } }) // First call for signup
            .mockResolvedValueOnce({ data: { success: true, user: mockUser } }); // Second call for login

        const result = await authService.signUp({ name: 'New User', email: 'new@example.com', password: 'password' });

        expect(postSpy).toHaveBeenNthCalledWith(1, '/user/', { name: 'New User', email: 'new@example.com', password: 'password' });
        expect(postSpy).toHaveBeenNthCalledWith(2, '/user/login', { email: 'new@example.com', password: 'password' });
        expect(result.user).toEqual({
            id: '1',
            name: 'New User',
            email: 'new@example.com',
            preferences: {},
        });
    });

    it('updateProfile calls api put', async () => {
        const mockUser = { id: 1, name: 'Updated Name', email: 'test@example.com', preferences: {} };
        const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ data: { success: true, user: mockUser } });

        const result = await authService.updateProfile({ name: 'Updated Name' });

        expect(putSpy).toHaveBeenCalledWith('/user/profile', { name: 'Updated Name' });
        expect(result.name).toBe('Updated Name');
    });

    it('deleteAccount calls api delete', async () => {
        const deleteSpy = vi.spyOn(api, 'delete').mockResolvedValue({ data: { success: true } });

        const result = await authService.deleteAccount();

        expect(deleteSpy).toHaveBeenCalledWith('/user/delete');
        expect(result).toBe(true);
    });

    it('logout calls api get', async () => {
        const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: { success: true } });

        await authService.logout();

        expect(getSpy).toHaveBeenCalledWith('/user/logout');
    });

    it('logout handles error gracefully', async () => {
        const getSpy = vi.spyOn(api, 'get').mockRejectedValue(new Error('Logout failed'));
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        await authService.logout();

        expect(getSpy).toHaveBeenCalledWith('/user/logout');
        expect(consoleSpy).toHaveBeenCalledWith('Logout request failed:', expect.any(Error));

        consoleSpy.mockRestore();
    });

    it('getCurrentUser calls api get and transforms user', async () => {
        const mockUser = { id: 1, name: 'Session User', email: 'session@example.com', preferences: {} };
        const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: { success: true, user: mockUser } });

        const result = await authService.getCurrentUser();

        expect(getSpy).toHaveBeenCalledWith('/user/session');
        expect(result).toEqual({
            id: '1',
            name: 'Session User',
            email: 'session@example.com',
            preferences: {},
        });
    });

    it('changePassword calls api put', async () => {
        const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ data: { success: true } });

        const result = await authService.changePassword({ current: 'old', new: 'new' });

        expect(putSpy).toHaveBeenCalledWith('/user/password', { current: 'old', new: 'new' });
        expect(result).toBe(true);
    });

    it('transformUser uses email prefix if name is missing', async () => {
        const mockUser = { id: 1, name: '', email: 'fallback@example.com', preferences: {} };
        vi.spyOn(api, 'post').mockResolvedValue({ data: { success: true, user: mockUser } });

        const result = await authService.login({ email: 'fallback@example.com', password: 'password' });

        expect(result.user.name).toBe('fallback');
    });
});
