const API_BASE_URL = "https://api.videosdk.live";
const VIDEOSDK_TOKEN = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
//export const authToken: string | undefined = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;
//export const getToken: string | undefined = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;

// Modified getToken to accept optional roomId
export const getToken = async (roomId?: string) => {
  try {
    const endpoint = roomId ? `/api/video-token?roomId=${roomId}` : '/api/video-token';
    console.log(`Requesting video token from: ${endpoint}`);
    const response = await fetch(endpoint);

    const responseText = await response.text();
    console.log("Token response:", {
      status: response.status,
      text: responseText
    });

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
      cause: error.cause
    });
    throw error; // Preserve the original error for better debugging
  }
};

// API call to create meeting using the official VideoSDK endpoint
export const createMeeting = async ({ token }: { token: string }) => {
  try {
    console.log("Creating meeting with VideoSDK API using token:", token.substring(0, 20) + "...");

    const response = await fetch(`${API_BASE_URL}/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: token, // Use the provided token for authorization
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Empty body as required by the API
    });

    const responseText = await response.text();
    console.log("VideoSDK Room creation response:", {
      status: response.status,
      text: responseText
    });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorData = JSON.parse(responseText);
        errorDetails = errorData.error || errorData.message || responseText;
      } catch {
        errorDetails = responseText;
      }
      // Include the status code in the error message
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
    // Rethrow the error to be caught by the calling function
    throw error;
  }
};

// API call to validate meeting ID using the official VideoSDK endpoint
export const validateMeeting = async ({ roomId, token }: { roomId: string, token: string }) => {
  try {
    console.log(`Validating meeting ID: ${roomId} using token: ${token.substring(0, 20)}...`);
    const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;

    const options = {
      method: "GET",
      headers: {
        Authorization: token, // Use the token directly without 'Bearer'
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
