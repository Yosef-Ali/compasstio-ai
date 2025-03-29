const API_BASE_URL = "https://api.videosdk.live";

/**
 * Fetches a VideoSDK token from the server
 * 
 * @param roomId Optional room ID when joining an existing meeting
 * @returns Promise resolving to the VideoSDK token
 */
export const getToken = async (roomId?: string): Promise<string> => {
  try {
    const endpoint = roomId ? `/api/video-token?roomId=${roomId}` : '/api/video-token';
    console.log(`Requesting video token from: ${endpoint}`);

    const response = await fetch(endpoint);
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse token response:", responseText);
      throw new Error("Invalid JSON response from token endpoint");
    }

    if (!data.token) {
      if (data.error) {
        throw new Error(`Token error: ${data.error}${data.details ? `\nDetails: ${JSON.stringify(data.details)}` : ''}`);
      }
      throw new Error('No token returned from server');
    }

    return data.token;
  } catch (error: any) {
    console.error("Error getting token:", {
      message: error.message,
      stack: error.stack,
    });
    throw error; // Preserve the original error for better debugging
  }
};

/**
 * Creates a new meeting using the VideoSDK API
 * 
 * @param options Object containing token for authorization
 * @returns Promise resolving to the created meeting ID
 */
export const createMeeting = async ({ token }: { token: string }): Promise<string> => {
  try {
    console.log("Creating meeting with VideoSDK API");

    const response = await fetch(`${API_BASE_URL}/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorData = JSON.parse(responseText);
        errorDetails = errorData.error || errorData.message || responseText;
      } catch {
        errorDetails = responseText;
      }
      throw new Error(`Failed to create meeting: ${response.status} - ${errorDetails}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse VideoSDK room creation response:", responseText);
      throw new Error("Invalid JSON response from VideoSDK API");
    }

    if (!data.roomId) {
      console.error("VideoSDK Room creation response data:", data);
      throw new Error("No room ID in VideoSDK response");
    }

    console.log("Successfully created VideoSDK room:", data.roomId);
    return data.roomId;
  } catch (error: any) {
    console.error("Error creating VideoSDK meeting:", error);
    throw error;
  }
};

/**
 * Validates whether a meeting ID is valid and available to join
 * 
 * @param options Object containing roomId and token for validation
 * @returns Promise resolving to boolean indicating if meeting is valid
 */
export const validateMeeting = async ({ roomId, token }: { roomId: string, token: string }): Promise<boolean> => {
  try {
    console.log(`Validating meeting ID: ${roomId}`);

    const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.warn(`Meeting validation failed with status ${response.status}`);
      return false;
    }

    const result = await response.json();
    return result && result.roomId === roomId;
  } catch (error) {
    console.error("Error validating meeting:", error);
    return false;
  }
};
