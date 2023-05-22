import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import UserSetting from "../datastores/user_setting.ts";

export const SendMessage = DefineFunction({
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
      channels: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "Channels to send messages",
      },
      attendance_type: {
        type: Schema.types.string,
        description: "Attendance type",
      },
    },
    required: ["user", "channels", "attendance_type"],
  },
});

export default SlackFunction(
  SendMessage,
  async ({ inputs, client }) => {
    const userSetting = {
      user_id: inputs.user,
      channels: inputs.channels,
    };

    const putUserSetting = await client.apps.datastore.put<typeof UserSetting.definition>(
      {
        datastore: "UserSetting",
        item: userSetting,
      },
    );

    if (!putUserSetting.ok) {
      const message = `Failed to put user setting to datastore: ${putUserSetting.error}`;
      console.warn(message);
    }

    const sendMessages = inputs.channels.map((channel) => {
      return client.chat.postMessage({
        channel: channel,
        text: ":cheke-start:",
      });
    });
    Promise.all(sendMessages).catch((error) => {
      const message = `Failed to send message: ${error}`;
      console.warn(message);
    });

    return { outputs: {} };
  },
);
