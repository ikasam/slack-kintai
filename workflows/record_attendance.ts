import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RecordAttendanceFunction } from "../functions/record_attendance.ts";
import { SendMessageFunction } from "../functions/send_message.ts";

const workflow = DefineWorkflow({
  callback_id: "kintai",
  title: "Kintai",
  description: "勤怠打つやつ（開発中）",
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

const formStep = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "kintai",
    interactivity: workflow.inputs.interactivity_context,
    fields: {
      elements: [{
        name: "type",
        title: "種別",
        type: Schema.types.string,
        enum: ["clock_in", "break", "resume", "clock_out"],
        choices: [
          { title: "出勤", value: "clock_in" },
          { title: "休憩", value: "break" },
          { title: "再開", value: "resume" },
          { title: "退勤", value: "clock_out" },
        ],
        default: "clock_in",
      }, {
        name: "message",
        title: "メッセージ",
        type: Schema.types.string,
        long: true,
      }],
      required: ["type"],
    },
  },
);

workflow.addStep(RecordAttendanceFunction, {
  user: workflow.inputs.user,
  attendance_type: formStep.outputs.fields.type,
});

workflow.addStep(SendMessageFunction, {
  user: workflow.inputs.user,
  attendance_type: formStep.outputs.fields.type,
});

export default workflow;
