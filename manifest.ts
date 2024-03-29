import { Manifest } from "deno-slack-sdk/mod.ts";
import RecordAttendanceWorkflow from "./workflows/record_attendance.ts";
import SettingsWorkflow from "./workflows/settings.ts";
import AttendanceRecordDatastore from "./datastores/attendance_record.ts";
import UserSetting from "./datastores/user_setting.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "kintai",
  description: "勤怠打つやつ（開発中）",
  icon: "assets/default_new_app_icon.png",
  workflows: [RecordAttendanceWorkflow, SettingsWorkflow],
  outgoingDomains: [],
  datastores: [AttendanceRecordDatastore, UserSetting],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "chat:write.customize",
    "datastore:read",
    "datastore:write",
    "users.profile:read",
  ],
});
