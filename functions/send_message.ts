import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import UserSetting from "../datastores/user_setting.ts";
import { buildMessageText } from "./domain/build_message_text.ts";

export const SendMessageFunction = DefineFunction({
  callback_id: "send_message",
  title: "Send Message",
  description: "Send message of attendance",
  source_file: "functions/send_message.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      attendance_type: {
        type: Schema.types.string,
        description: "Attendance type",
      },
      message: {
        type: Schema.types.string,
        description: "Additional message",
      },
    },
    required: ["user", "attendance_type"],
  },
});

export default SlackFunction(
  SendMessageFunction,
  async ({ inputs, client }) => {
    const user = await client.users.profile.get({ user: inputs.user }).then(
      (response) => {
        if (!response.ok) {
          const message = `Failed to get user profile: ${response.error}`;
          console.warn(message);
        }

        return response;
      },
    );

    const channels = await client.apps.datastore.get<
      typeof UserSetting.definition
    >(
      {
        datastore: "UserSetting",
        id: inputs.user,
      },
    ).then((response): string[] => {
      if (!response.ok) {
        const message =
          `Failed to get user setting from datastore: ${response.error}`;
        console.warn(message);
      }

      if (!response.item) {
        const message = `No setting for the user: ${inputs.user}`;
        console.info(message);
      }

      return response.item.channels ?? [];
    });

    const sendMessages = channels.map((channel) => {
      return client.chat.postMessage({
        channel: channel,
        text:buildMessageText(inputs.attendance_type, inputs.message),
        username: user.profile.real_name,
        icon_url: user.profile.image_1024,
      }).then((res) => {
        if (!res.ok) {
          console.warn(
            `Failed to send message: ${res.error}, inputs: {channel: ${channel}, user: ${inputs.user}, username: ${user.profile.real_name}}`,
          );
        }
      });
    });

    Promise.all(sendMessages).catch((error) => {
      const message = `Failed to send message: ${error}`;
      console.warn(message);
    });

    return { outputs: {} };
  },
);
