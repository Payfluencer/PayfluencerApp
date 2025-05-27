import axios from "axios";
import { Logger } from "borgen";
import { Config } from "./config";

// Get user info with authorization code (using access token and 'postmessage' redirect)
export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return { status: "success", data: res.data };
  } catch (err: any) {
    Logger.error({
      message: `Error getting Google user info: ${err}`,
    });
    return { status: "error", message: err.message };
  }
};
