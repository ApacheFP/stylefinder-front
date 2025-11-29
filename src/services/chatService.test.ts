/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chatService } from './chatService';
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

describe('chatService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sendMessage sends text message correctly', async () => {
        const mockResponse = {
            content: {
                type: 1,
                message: 'Hello response',
                outfit: [],
                explanation: '',
                status_code: 200
            }
        };
        const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: mockResponse });

        const result = await chatService.sendMessage('Hello', {} as any);

        expect(postSpy).toHaveBeenCalledWith('/messages/send', {
            message: 'Hello',
            conv_id: undefined
        });
        expect(result).toEqual(mockResponse);
    });

    it('sendMessage sends image using FormData', async () => {
        const mockResponse = { content: { message: 'Image analyzed', outfit: [], explanation: '', status_code: 200 } };
        const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: mockResponse });

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        await chatService.sendMessage('Check this', {} as any, '123', file);

        expect(postSpy).toHaveBeenCalledWith('/messages/send', expect.any(FormData), {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Verify FormData content
        const formData = postSpy.mock.calls[0][1] as FormData;
        expect(formData.get('message')).toBe('Check this');
        expect(formData.get('conv_id')).toBe('123');
        expect(formData.get('image')).toBe(file);
    });

    it('getChatHistory transforms conversations correctly', async () => {
        const mockConversations = [
            { id: 1, title: 'Chat 1', updated_at: '2023-01-01T10:00:00Z' },
            { id: 2, title: 'Chat 2', updated_at: '2023-01-02T10:00:00Z' }
        ];
        const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: { success: true, conversations: mockConversations } });

        const result = await chatService.getChatHistory();

        expect(getSpy).toHaveBeenCalledWith('/conversations');
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('1');
        expect(result[0].title).toBe('Chat 1');
        expect(result[0].lastMessage).toBeInstanceOf(Date);
    });

    it('getChatConversation transforms messages and outfits correctly', async () => {
        const mockMessages = [
            {
                message_id: 101,
                role: 'user',
                text: 'I need a jacket',
                created_at: '2023-01-01T10:00:00Z'
            },
            {
                message_id: 102,
                role: 'ai',
                text: 'Here is a jacket',
                type: 0,
                outfits: [
                    {
                        id: 'item1',
                        title: 'Cool Jacket',
                        url: 'http://shop.com/jacket',
                        image_link: 'http://img.com/jacket.jpg',
                        price: 100,
                        brand: 'BrandX'
                    }
                ],
                explanation: 'It fits you well',
                created_at: '2023-01-01T10:00:05Z'
            }
        ];
        const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: mockMessages });

        const result = await chatService.getChatConversation('1');

        expect(postSpy).toHaveBeenCalledWith('/chat', { conv_id: '1' });
        expect(result).toHaveLength(2);

        // User message
        expect(result[0].role).toBe('user');
        expect(result[0].content).toBe('I need a jacket');

        // AI message with outfit
        expect(result[1].role).toBe('assistant');
        expect(result[1].outfit).toBeDefined();
        expect(result[1].outfit?.items[0].name).toBe('Cool Jacket');
        expect(result[1].outfit?.items[0].price).toBe(100);
        expect(result[1].outfit?.explanation).toBe('It fits you well');
    });

    it('renameConversation calls api put', async () => {
        const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ data: { success: true } });

        const result = await chatService.renameConversation('1', 'New Title');

        expect(putSpy).toHaveBeenCalledWith('/conversations/rename', { conv_id: '1', title: 'New Title' });
        expect(result).toBe(true);
    });

    it('deleteConversation calls api delete', async () => {
        const deleteSpy = vi.spyOn(api, 'delete').mockResolvedValue({ data: { success: true } });

        const result = await chatService.deleteConversation('1');

        expect(deleteSpy).toHaveBeenCalledWith('/conversations/delete', { data: { conv_id: 1 } });
        expect(result).toBe(true);
    });

    it('getChatConversation handles duplicate message IDs', async () => {
        const mockMessages = [
            { message_id: 1, role: 'user', text: 'Hello', created_at: '2023-01-01T12:00:00Z' },
            { message_id: 1, role: 'ai', text: 'Hi', created_at: '2023-01-01T12:01:00Z' }, // Duplicate ID
        ];
        (api.post as any).mockResolvedValue({ data: mockMessages });

        const result = await chatService.getChatConversation('123');

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('1');
        expect(result[1].id).toContain('1-dup-'); // Should have suffix
        expect(result[0].id).not.toBe(result[1].id);
    });
});

it('transformOutfitResponse handles type 1 (normal message)', () => {
    const backendResponse = {
        type: 1,
        message: 'Just text',
        outfit: [],
        explanation: '',
        status_code: 200
    };

    const result = chatService.transformOutfitResponse(backendResponse);

    expect(result.type).toBe(1);
    expect(result.message).toBe('Just text');
    expect(result.items).toEqual([]);
});

it('transformOutfitResponse handles type 0 (outfit)', () => {
    const backendResponse = {
        type: 0,
        message: 'Here is an outfit',
        outfit: [
            {
                id: '1',
                title: 'Item',
                url: 'url',
                image_link: 'img',
                price: 50
            }
        ],
        explanation: 'Good choice',
        status_code: 200
    };

    const result = chatService.transformOutfitResponse(backendResponse);

    expect(result.type).toBe(0);
    expect(result.items).toHaveLength(1);
    expect(result.totalPrice).toBe(50);
    expect(result.explanation).toBe('Good choice');
});

it('getChatConversation handles messages without outfits', async () => {
    const mockMessages = [
        {
            message_id: 1,
            role: 'ai',
            text: 'Hello',
            type: 1,
            created_at: '2023-01-01T10:00:00Z'
        }
    ];
    vi.spyOn(api, 'post').mockResolvedValue({ data: mockMessages });

    const result = await chatService.getChatConversation('1');

    expect(result[0].outfit).toBeUndefined();
});

