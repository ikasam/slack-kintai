import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import format from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
// import localeJa from "https://deno.land/x/date_fns@v2.22.1/locale/ja/index.js";
import AttendanceRecord from "../datastores/attendance_record.ts";

export const RecordAttendanceFunction = DefineFunction({
  callback_id: "record_attendance",
  title: "Record Attendance",
  description: "Record attendance",
  source_file: "functions/record_attendance.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      attendance_type: {
        type: Schema.types.string,
        description: "Attendance type",
      },
    },
    required: ["user", "attendance_type"],
  },
  output_parameters: {
    properties: {
      status: {
        type: Schema.types.string,
        description: "Updated working status of user",
      },
      datetime: {
        type: Schema.types.string,
        description: "Recorded DateTime string",
      },
    },
    required: ["status"],
  },
});

export default SlackFunction(
  RecordAttendanceFunction,
  async ({ inputs, client }) => {
    const uuid = crypto.randomUUID();
    const now = Date.now();

    const record = {
      id: uuid,
      user_id: inputs.user,
      timestamp: now,
      attendance_type: inputs.attendance_type,
    };

    await client.apps.datastore.put<typeof AttendanceRecord.definition>(
      {
        datastore: "AttendanceRecord",
        item: record,
      },
    );

    const response = await client.apps.datastore.get<
      typeof AttendanceRecord.definition
    >({
      datastore: "AttendanceRecord",
      id: uuid,
    });

    if (!response.ok) {
      const error = `Failed to get a row from datastore: ${response.error}`;
      console.error(error);
      return { error };
    }

    const retrieved_data = JSON.stringify(response.item);
    console.debug(`retrieved data: ${retrieved_data}`);

    const status = inputs.attendance_type;
    const datetime = format(response.item.timestamp, "HH:mm:ss", {});

    return { outputs: { status: status, datetime: datetime } };
  },
);
