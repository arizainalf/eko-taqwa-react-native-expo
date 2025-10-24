const API_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/api';

export const STORAGE_BASE_URL = 'https://ekotaqwa.bangkoding.my.id/storage/';

const getHeaders = async (extraHeaders: Record<string, string> = {}): Promise<HeadersInit> => {
    const apiKey = 'VOAahG62bOO71MOj1QsM6klVHaCwM';
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': apiKey,
        ...extraHeaders,
    };
};

export const apiGet = async<T>(endpoint: string): Promise<T> => {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
    }

    return data.data ?? data;
};

export const apiPost = async <T>(endpoint: string, body: any): Promise<T> => {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
    }

    return data.data ?? data;
};

export const apiPut = async <T>(endpoint: string, body: any): Promise<T> => {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
    }

    return data.data ?? data;
};

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
    }

    return data.data ?? data;
};