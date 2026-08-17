import {
  describe,
  type NotificationPayload,
  type Priority,
} from "./payload.js";

const PRIORITIES = ["low", "normal", "high"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isStringArray(value: unknown): value is Array<string> {
  return Array.isArray(value) && value.every((item: unknown) => isString(item));
}

function isPriority(value: unknown): boolean {
  return isString(value) && PRIORITIES.some((priority) => priority === value);
}

function isNotificationPayload(value: unknown): value is NotificationPayload {
  if (!isRecord(value)) return false;
  if (!isPriority(value.priority)) return false;

  const channel = value.channel;
  if (!isString(channel)) return false;

  switch (channel) {
    case "email":
      return (
        isString(value.to) && isString(value.subject) && isString(value.body)
      );

    case "sms":
      return isString(value.to) && isString(value.text);

    case "push":
      return (
        isString(value.deviceToken) &&
        isString(value.title) &&
        isString(value.body)
      );

    case "telegram":
      return isString(value.chatId) && isString(value.text);

    default:
      return false;
  }
}

function handleIncoming(raw: unknown): void {
  if (!isNotificationPayload(raw)) {
    console.log("Невалідний payload:", JSON.stringify(raw));
    return;
  }

  console.log(describe(raw));
}

handleIncoming({ channel: "sms", to: "+380...", text: "hi", priority: "low" });
handleIncoming({ channel: "sms", to: "+380...", priority: "low" });
handleIncoming({ channel: "carrier-pigeon", text: "hi" });
handleIncoming(null);
handleIncoming("просто рядок");
