import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RecordAttendanceFunction } from "../functions/record_attendance.ts";

const workflow = DefineWorkflow({
  callback_id: "kintai",
  title: "Kintai",
  description: "勤怠打つやつ（開発中）",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user"],
  },
});

const workflowStep = workflow.addStep(RecordAttendanceFunction, {
  user: workflow.inputs.user,
  attendance_type: "clock_in",
});

workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: workflow.inputs.channel,
  message: workflowStep.outputs.status + ` ${workflowStep.outputs.datetime}`,
});

export default workflow;
