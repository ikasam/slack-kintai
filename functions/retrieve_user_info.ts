import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import UserSetting from "../datastores/user_setting.ts";

export const RetrieveUserInfoFunction = DefineFunction({
  callback_id: "retrieve_user_info",
  title: "Retrieve User Info",
  description: "Retrieve user info for default values of form",
  source_file: "functions/retrieve_user_info.ts",
  input_parameters: {
    properties: {
      interactivity_context: {
        type: Schema.slack.types.interactivity,
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
    },
    required: ["user"],
  },
  output_parameters: {
    properties: {
      interactivity_context: {
        type: Schema.slack.types.interactivity,
      },
      channels: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "channels where to send messages",
      },
    },
    required: ["channels"],
  },
});

export default SlackFunction(
  RetrieveUserInfoFunction,
  async ({ inputs, client }) => {
    const userSetting = await client.apps.datastore.get<
      typeof UserSetting.definition
    >(
      {
        datastore: "UserSetting",
        id: inputs.user,
      },
    );

    if (!userSetting.ok) {
      const message =
        `Failed to get user setting from datastore: ${userSetting.error}`;
      console.warn(message);
    }

    if (!userSetting.item) {
      const message = `No setting for the user: ${inputs.user}`;
      console.info(message);
    }

    return {
      outputs: {
        interactivity_context: inputs.interactivity_context,
        channels: userSetting.item.channels ?? [],
      },
    };
  },
);
