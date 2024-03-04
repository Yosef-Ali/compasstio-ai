const API_BASE_URL = "https://api.videosdk.live";
const VIDEOSDK_TOKEN = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
//export const authToken: string | undefined = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;
//export const getToken: string | undefined = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;

export const getToken = async () => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    console.error(
      "Error: Provide only ONE PARAMETER - either Token or Auth API"
    );
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  } else if (API_AUTH_URL) {
    const res = await fetch(`${API_AUTH_URL}/get-token`, {
      method: "GET",
    });
    const { token } = await res.json();
    return token;
  } else {
    console.error("Error: ", Error("Please add a token or Auth Server URL"));
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
  const url = `${API_BASE_URL}/v2/rooms`;

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error("error", error));

  return roomId;
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