import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RetrieveUserInfoFunction } from "../functions/retrieve_user_info.ts";
import { SaveUserSettingsFunction } from "../functions/save_user_settings.ts";

const workflow = DefineWorkflow({
  callback_id: "setting",
  title: "Setting",
  description: "勤怠打つやつ（開発中）のユーザーセッティング",
  input_parameters: {
    properties: {
      interactivity_context: {
        type: Schema.slack.types.interactivity,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity_context", "user"],
  },
});

const retrieveUserInfoStep = workflow.addStep(RetrieveUserInfoFunction, {
  interactivity_context: workflow.inputs.interactivity_context,
  user: workflow.inputs.user,
});

const formStep = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Kintai Setting",
    interactivity: retrieveUserInfoStep.outputs.interactivity_context,
    submit_label: "Save",
    fields: {
      elements: [{
        name: "channel",
        title: "勤怠報告チャネル",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        default: retrieveUserInfoStep.outputs.channels,
      }],
      required: [],
    },
  },
);

workflow.addStep(SaveUserSettingsFunction, {
  user: workflow.inputs.user,
  channels: formStep.outputs.fields.channel,
});

export default workflow;
