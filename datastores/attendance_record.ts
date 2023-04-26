import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const AttendanceRecord = DefineDatastore({
  name: "AttendanceRecord",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
    timestamp: {
      type: Schema.types.number,
    },
    attendance_type: {
      type: Schema.types.string,
      enum: ["clock_in", "clock_out"],
    },
  },
});

export default AttendanceRecord;
