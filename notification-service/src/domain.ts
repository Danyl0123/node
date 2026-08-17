//1
interface User {
  readonly id: number;
  readonly createdAt: Date;
  email: string;
  phone?: string;
  role: Role;
  preferences: userPreferences;
}

type Role = "admin" | "user" | "guest";

interface userPreferences {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
}

const firstAdmin: User = {
  id: 1,
  createdAt: new Date(),
  email: "25032002ur@gmail.com",
  phone: "0635665601",
  role: "admin",
  preferences: {
    emailEnabled: true,
    smsEnabled: true,
  },
};

const secondAdmin: User = {
  id: 2,
  createdAt: new Date(),
  email: "25032002ur@gmail.com",
  phone: "0635665601",
  role: "admin",
  preferences: {
    emailEnabled: false,
    smsEnabled: false,
  },
};

const guest: User = {
  id: 3,
  createdAt: new Date(),
  email: "25032002ur@gmail.com",
  role: "guest",
  preferences: {},
};

// --- Три рядки, які не компілюються ---

// 1) readonly: id не можна змінити після створення
// firstAdmin.id = 99;
// error TS2540: Cannot assign to 'id' because it is a read-only property.

// 2) union: role — не будь-який рядок, а лише "admin" | "user" | "guest"
// const bad: User = { id: 4, createdAt: new Date(), email: "a@b.com", role: "superadmin", preferences: {} };
// error TS2322: Type '"superadmin"' is not assignable to type 'Role'.

// 3) обов'язкове поле: email не можна пропустити
// const noEmail: User = { id: 5, createdAt: new Date(), role: "user", preferences: {} };
// error TS2741: Property 'email' is missing in type '{ id: number; createdAt: Date; role: "user"; preferences: {}; }' but required in type 'User'.

//2
interface Admin extends User {
  role: "admin";
  readonly permissions: ReadonlyArray<string>;
}

//3
type WithStringId = { id: string; label: string };
type WithNumberId = { id: number; count: number };

type Broken = WithStringId & WithNumberId;

// const broken: Broken = {
//   id: 3,
//   label: "some label",
//   count: 3,
// };
// error TS2322: Type 'number' is not assignable to type 'never'.

// id у Broken має тип string & number, тобто never — не існує значення,
// яке одночасно є і рядком, і числом. Тому рядок теж не підходить:
// const broken2: Broken = { id: "3", label: "some label", count: 3 };
// error TS2322: Type 'string' is not assignable to type 'never'.
// Тип Broken неможливо створити взагалі.

type SafeMerge<A, B> = Omit<A, keyof B> & B;

type Merged = SafeMerge<WithStringId, WithNumberId>;

const merged: Merged = {
  id: 7,
  label: "some label",
  count: 3,
};

export type { User, SafeMerge };
