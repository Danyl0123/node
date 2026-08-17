import type { User } from "./domain.js";

declare global {
  namespace VendorSDK {
    interface Context {
      user?: User;
    }
  }
}

function describeContext(context: VendorSDK.Context): string {
  const user =
    context.user === undefined
      ? "анонім"
      : `${context.user.email} (${context.user.role})`;

  return `${context.requestId}: ${user}`;
}

const admin: User = {
  id: 1,
  createdAt: new Date(),
  email: "25032002ur@gmail.com",
  phone: "0635665601",
  role: "admin",
  preferences: { emailEnabled: true, smsEnabled: true },
};

console.log(describeContext({ requestId: "req-1", user: admin }));
console.log(describeContext({ requestId: "req-2" }));

export { describeContext };

//9

declare const brand: unique symbol;

type Branded<T, B extends string> = T & { readonly [brand]: B };

type UserId = Branded<number, "UserId">;
type OrderId = Branded<number, "OrderId">;

function getUser(id: UserId) {
  /* ... */
}

// getUser(31)
//помилка бо звичайне число теж не пройде так само і з OrderId

//10
const CHANNELS = ["email", "sms", "push", "telegram"] as const;

type Channel = (typeof CHANNELS)[number];

export type { Channel };

//я там використав 'as const' якщо потрібно буде лише через цей варіант,то перероблю
