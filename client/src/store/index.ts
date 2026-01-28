import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    exp: number;
}

// Validate tokens aren't expired
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        // Add 5 second buffer for clock skew
        return decoded.exp * 1000 < Date.now() - 5000;
    } catch {
        return true; // Treat invalid tokens as expired
    }
};

// Load auth state from localStorage
const loadAuthState = () => {
    try {
        const state = localStorage.getItem('auth');
        if (!state) return undefined;

        const parsed = JSON.parse(state);

        // Validate that we have tokens and they aren't expired
        if (parsed?.tokens?.refreshToken) {
            if (isTokenExpired(parsed.tokens.refreshToken)) {
                console.warn('🔄 Stored refresh token is expired, clearing auth state');
                localStorage.removeItem('auth');
                return undefined;
            }
        }

        return parsed;
    } catch {
        return undefined;
    }
};

import chatReducer from '@/features/chat/store/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    },
    preloadedState: {
        auth: loadAuthState(),
    },
});

// Save auth state to localStorage on changes
store.subscribe(() => {
    try {
        const authState = store.getState().auth;
        localStorage.setItem('auth', JSON.stringify(authState));
    } catch (error) {
        console.error('Failed to save auth state:', error);
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
