import type { NotificationPayload, Channel } from "./payload.ts";

type SendResult =
  | { ok: true; messageId: string; sentAt: Date }
  | { ok: false; error: string; retryable: boolean };

interface Sender<T extends Channel> {
  (payload: NotificationPayload): Promise<SendResult>;
  channel: T;
  isAvailable(): boolean;
}

const emailSender: Sender<"email"> = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    console.log("emailSender", payload.channel);
    return { ok: true, messageId: "1", sentAt: new Date() };
  },
  { channel: "email" as const, isAvailable: () => true },
);

const smsSender: Sender<"sms"> = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    console.log("smsSender", payload.channel);
    return { ok: true, messageId: "2", sentAt: new Date() };
  },
  { channel: "sms" as const, isAvailable: () => true },
);

const pushSender: Sender<"push"> = Object.assign(
  async (payload: NotificationPayload): Promise<SendResult> => {
    console.log("pushSender", payload.channel);
    return { ok: true, messageId: "3", sentAt: new Date() };
  },
  { channel: "push" as const, isAvailable: () => true },
);

interface SendLogger {
  (result: SendResult): void;
}

async function sendWithLogging<T extends Channel>(
  payload: NotificationPayload,
  sender: Sender<T>,
  logger: SendLogger,
) {
  const senderResult = await sender(payload);
  logger(senderResult);
}

const log: SendLogger = (payload: SendResult) => {
  switch (payload.ok) {
    case true: {
      console.log(`${payload.sentAt} message id:${payload.messageId}`);
      return;
    }
    case false: {
      console.log(`${payload.error} ${payload.retryable}`);
      return;
    }
    default: {
      console.log("somethinh went wrong");
      return;
    }
  }
};
