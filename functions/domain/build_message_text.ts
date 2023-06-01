const emojiMapping: { [key: string]: string; } = {
  "clock_in": ":cheke-start:",
  "lunch_break": ":cheke-lunch:",
  "break": ":cheke-break:",
  "resume": ":cheke-restart:",
  "clock_out": ":cheke-end:",
};

export const buildMessageText = (attendanceType: string, message?: string) => {
  const emoji = emojiMapping[attendanceType];

  if (message && message.length > 0) {
    return emoji.concat(' ', message);
  }

  return emoji;
};
