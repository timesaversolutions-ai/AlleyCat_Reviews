import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { googleclient_id, googleclient_secret } from '@env';

const CLIENT_ID = googleclient_id;
const CLIENT_SECRET = googleclient_secret;

// Configuration for Google Auth
const config = {
  expoClientId: CLIENT_ID,
  iosClientId: CLIENT_ID,
  androidClientId: CLIENT_ID,
  webClientId: CLIENT_ID,
  scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly']
};

export const googleAuth = Google.useAuthRequest(config);

// Function to get a fresh access token
export async function getAccessToken() {
  let token = await SecureStore.getItemAsync('google_access_token');
  let expirationDate = await SecureStore.getItemAsync('token_expiration');

  if (!token || !expirationDate || new Date() >= new Date(expirationDate)) {
    // Token is missing or expired, get a new one
    const result = await refreshAccessToken();
    if (result) {
      token = result.access_token;
    } else {
      // Handle error or redirect to login
      return null;
    }
  }

  return token;
}

// Function to refresh the access token
async function refreshAccessToken() {
  const refreshToken = await SecureStore.getItemAsync('google_refresh_token');
  if (!refreshToken) {
    // No refresh token, user needs to log in again
    return null;
  }

  const tokenResult = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const tokenData = await tokenResult.json();

  if (tokenData.access_token) {
    await SecureStore.setItemAsync('google_access_token', tokenData.access_token);
    const expirationDate = new Date(new Date().getTime() + tokenData.expires_in * 1000);
    await SecureStore.setItemAsync('token_expiration', expirationDate.toISOString());
    return tokenData;
  } else {
    // Handle error
    return null;
  }
}

// Function to handle the initial authentication
export async function handleAuthentication(response) {
  if (response?.type === 'success') {
    const { authentication } = response;
    await SecureStore.setItemAsync('google_access_token', authentication.accessToken);
    await SecureStore.setItemAsync('google_refresh_token', authentication.refreshToken);
    const expirationDate = new Date(new Date().getTime() + authentication.expiresIn * 1000);
    await SecureStore.setItemAsync('token_expiration', expirationDate.toISOString());
    return true;
  }
  return false;
}