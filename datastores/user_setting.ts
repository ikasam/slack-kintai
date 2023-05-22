import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const UserSetting = DefineDatastore({
  name: "UserSetting",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    channels: {
      type: Schema.types.array,
      items: {
        type: Schema.slack.types.channel_id,
      },
    },
  },
});

export default UserSetting;
