import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData } from "deno-slack-api/mod.ts";
import SettingsWorkflow from "../workflows/settings.ts";

const settingTrigger: Trigger<typeof SettingsWorkflow.definition> = {
  type: "shortcut",
  name: "kintai-setting",
  shortcut: {
    button_text: "kintai-setting",
  },
  description: "Slack Kintai の設定",
  workflow: "#/workflows/setting",
  inputs: {
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
    interactivity_context: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default settingTrigger;
