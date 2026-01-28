import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { startTokenRefreshMonitoring } from '@/lib/utils/token-refresh';

/**
 * AuthInitializer component
 *
 * Initializes token refresh monitoring when the app starts
 * if there are existing valid tokens in the Redux store.
 *
 * This ensures that users who refresh the page or return to the app
 * will have their tokens automatically refreshed in the background.
 */
export const AuthInitializer = () => {
  const { tokens, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only start monitoring if user is authenticated and has tokens
    if (isAuthenticated && tokens?.accessToken) {
      startTokenRefreshMonitoring();
    }
  }, [isAuthenticated, tokens?.accessToken]);

  // This component doesn't render anything
  return null;
};
