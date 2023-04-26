import { Trigger } from "deno-slack-sdk/types.ts";
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
    channel: {
      value: "{{data.channel_id}}",
    },
    user: {
      value: "{{data.user_id}}",
    },
  },
};

export default kintaiTrigger;
