const API_BASE_URL = "https://api.videosdk.live";
const VIDEOSDK_TOKEN = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
//export const authToken: string | undefined = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;
//export const getToken: string | undefined = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;

export const getToken = async () => {
  try {
    console.log("Requesting video token...");
    const response = await fetch('/api/video-token');

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

// API call to create meeting
// export const createMeeting = async ({ token }: { token: string }) => {
//   const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
//     method: "POST",
//     headers: {
//       authorization: `${authToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}),
//   });
//   //Destructuring the roomId from the response
//   const { roomId }: { roomId: string } = await res.json();
//   return roomId;
// };

export const createMeeting = async ({ token }: { token: string }) => {
  try {
    console.log("Creating meeting with token:", token.substring(0, 20) + "...");
    const response = await fetch(`${API_BASE_URL}/v2/rooms`, {
      method: "POST",
      headers: {
        Authorization: token, // Remove "Bearer " prefix to match VideoSDK's expectations
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        region: "sg001",
        template: "group-call",
      }),
    });

    const responseText = await response.text();
    console.log("Room creation response:", {
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
      throw new Error(`VideoSDK API Error ${response.status}: ${errorDetails}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse room creation response:", responseText);
      throw new Error("Invalid JSON response from VideoSDK");
    }

    if (!data.roomId) {
      console.error("Room creation response data:", data);
      throw new Error("No room ID in response");
    }

    console.log("Successfully created room:", data.roomId);
    return data.roomId;

  } catch (error: any) {
    console.error("Error creating meeting:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      token: token ? "present" : "missing"
    });
    throw error; // Preserve the original error
  }
};

export const validateMeeting = async ({ roomId, token }: { roomId: string, token: string }) => {
  const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const result = await fetch(url, options)
    .then((response) => response.json()) //result will have meeting id
    .catch((error) => console.error("error", error));

  return result ? result.roomId === roomId : false;
};
