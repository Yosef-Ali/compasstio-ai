const API_BASE_URL = process.env.NEXT_PUBLIC_VIDEOSDK_API_ENDPOINT || "https://api.videosdk.live";
const VIDEOSDK_TOKEN = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;

export const getToken = async () => {
  if (!VIDEOSDK_TOKEN) {
    console.error("No VideoSDK token found");
    throw new Error("VideoSDK token is required");
  }
  return VIDEOSDK_TOKEN;
};

export const createMeeting = async () => {
  const token = await getToken();
  const url = `${API_BASE_URL}/v2/rooms`;
  const options = {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.roomId) {
      return data.roomId;
    } else {
      throw new Error("Failed to create meeting");
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};

export const validateMeeting = async (meetingId: string) => {
  const token = await getToken();
  const url = `${API_BASE_URL}/v2/rooms/validate/${meetingId}`;
  const options = {
    method: "GET",
    headers: { Authorization: token },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.roomId === meetingId) {
      return true;
    } else {
      throw new Error("Invalid meeting ID");
    }
  } catch (error) {
    console.error("Error validating meeting:", error);
    return false;
  }
}; 