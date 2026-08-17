const ChannelVariants = {
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
  TELEGRAM: "telegram",
} as const;

//не впевнений що це потрібно але для практики зробив, через as const замість енама через оптимізацію

type Email = {
  channel: typeof ChannelVariants.EMAIL;
  to: string;
  subject: string;
  body: string;
  attachments?: Array<string>;
  priority: Priority;
};

type SMS = {
  channel: typeof ChannelVariants.SMS;
  to: string;
  text: string;
  priority: Priority;
};

type Push = {
  channel: typeof ChannelVariants.PUSH;
  deviceToken: string;
  title: string;
  body: string;
  badge?: number;
  priority: Priority;
};

type Priority = "low" | "normal" | "high";

type NotificationPayload = Email | SMS | Push | Telegram;

function describe(payload: NotificationPayload): string {
  switch (payload.channel) {
    case "email": {
      const message = `${payload.to} ${payload.subject}: ${payload.body}`;
      return message;
    }

    case "sms": {
      const message = `${payload.to}: ${payload.text}`;

      //   payload.subject
      //  error TS2339: Property 'subject' does not exist on type 'SMS'
      return message;
    }

    case "push": {
      const message = `${payload.badge} ${payload.deviceToken}: ${payload.body}`;
      return message;
    }

    case "telegram": {
      const message = `${payload.chatId} : ${payload.text}`;
      return message;
    }

    default: {
      const exhaustive: never = payload;
      //без гілки для типу Telegram
      //Error TS2322: Type 'Telegram' is not assignable to type 'never'
      //пейлоад з типом телеграм буде завжди викликати помилку
      throw new Error(`Невідомий канал: ${JSON.stringify(exhaustive)}`);
    }
  }
}

type Telegram = {
  channel: typeof ChannelVariants.TELEGRAM;
  chatId: string;
  text: string;
  priority: Priority;
};

type Channel = (typeof ChannelVariants)[keyof typeof ChannelVariants];

export { describe };
export type { NotificationPayload, Channel, Priority };
