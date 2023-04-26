import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import RecordAttendanceFunction from "./record_attendance.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester("record_attendance");

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/apps.datastore.put", () => {
  return new Response(
    `{"ok": true, "item": {"id": "d908f8bd-00c6-43f0-9fc3-4da3c2746e14"}}`,
    {
      status: 200,
    },
  );
});

mf.mock("POST@/api/apps.datastore.get", () => {
  return new Response(
    JSON.stringify({
      ok: true,
      status: "success",
      item: {
        id: "d908f8bd-00c6-43f0-9fc3-4da3c2746e14",
        user_id: "U01234567",
        timestamp: Date.now(),
        attendance_type: "clock_in",
      },
    }),
    {
      status: 200,
    },
  );
});

Deno.test("Sample function test", async () => {
  const inputs = {
    user: "U01234567",
    attendance_type: "clock_in",
  };
  const { outputs } = await RecordAttendanceFunction(createContext({ inputs }));
  await assertEquals(
    outputs?.status,
    "working",
  );
});
