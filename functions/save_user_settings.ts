import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import UserSetting from "../datastores/user_setting.ts";

export const SaveUserSettingsFunction = DefineFunction({
  callback_id: "save_user_settings",
  title: "Save User Settings",
  description: "Save user settings",
  source_file: "functions/save_user_settings.ts",
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
    },
    required: ["user", "channels"],
  },
});

export default SlackFunction(
  SaveUserSettingsFunction,
  async ({ inputs, client }) => {
    const userSetting = {
      user_id: inputs.user,
      channels: inputs.channels,
    };

    const response = await client.apps.datastore.put<
      typeof UserSetting.definition
    >(
      {
        datastore: "UserSetting",
        item: userSetting,
      },
    );

    if (!response.ok && response.error != null) {
      const error = response.error;
      const message = `Failed to put user setting to datastore: ${error}`;
      console.error(message);
      return { error };
    }

    return { outputs: {} };
  },
);
