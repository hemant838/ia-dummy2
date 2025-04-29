import { getJWTToken } from '@workspace/auth/jwtAccessToken';

export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const { jwtToken } = await getJWTToken();

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `API call failed with status ${response.status}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while making the API call'
    );
  }
}
