import {
  FrameActionPayload,
  HubHttpUrlOptions,
  hexStringToUint8Array,
} from ".";
import { FrameActionMessage, Message } from "@farcaster/core";

/**
 * @returns a Promise that resolves with whether the message signature is valid, by querying a Farcaster hub, as well as the message itself
 */
export async function validateFrameMessage(
  body: FrameActionPayload,
  {
    hubHttpUrl = "https://api.neynar.com:2281",
    hubRequestOptions = {
      headers: {
        api_key: "NEYNAR_FRAMES_JS",
      },
    },
  }: HubHttpUrlOptions = {}
): Promise<{
  isValid: boolean;
  message: FrameActionMessage | undefined;
}> {
  const { headers, ...rest } = hubRequestOptions;
  const validateMessageResponse = await fetch(
    `${hubHttpUrl}/v1/validateMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        ...headers,
      },
      body: hexStringToUint8Array(body.trustedData.messageBytes),
      ...rest,
    }
  );

  const validateMessageJson = await validateMessageResponse.json();

  if (!validateMessageJson.valid) {
    return {
      isValid: false,
      message: undefined,
    };
  } else {
    return {
      isValid: true,
      message: Message.fromJSON(
        validateMessageJson.message
      ) as FrameActionMessage,
    };
  }
}
