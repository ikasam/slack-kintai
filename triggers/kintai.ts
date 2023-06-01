import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData } from "deno-slack-api/mod.ts";
import RecordAttendanceWorkflow from "../workflows/record_attendance.ts";

const kintaiTrigger: Trigger<typeof RecordAttendanceWorkflow.definition> = {
  type: "shortcut",
  name: "kintai",
  shortcut: {
    button_text: "kintai",
  },
  description: "Kintai trigger",
  workflow: "#/workflows/kintai",
  inputs: {
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
    interactivity_context: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default kintaiTrigger;
