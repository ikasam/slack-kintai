import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RecordAttendanceFunction } from "../functions/record_attendance.ts";

const workflow = DefineWorkflow({
  callback_id: "kintai",
  title: "Kintai",
  description: "勤怠打つやつ（開発中）",
  input_parameters: {
    properties: {
      interactivity_context: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity_context", "user"],
  },
});

const form = workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "kintai",
    interactivity: workflow.inputs.interactivity_context,
    submit_label: "Send",
    fields: {
      elements: [{
        name: "channel",
        title: "勤怠報告チャネル",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        default: ["CMX8MC5Q8", "C034EU3A76X"],
      }, {
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

const workflowStep = workflow.addStep(RecordAttendanceFunction, {
  user: workflow.inputs.user,
  attendance_type: form.outputs.fields.type,
});

workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: workflow.inputs.channel,
  message: `${workflowStep.outputs.status}, ${workflowStep.outputs.datetime}, ${form.outputs.fields.channel}`,
});

export default workflow;
