// Practice
export type User = NonNullable<{
  readonly id: string;
  name: string;
  age: number;
}>;

export type Option<T> =
  | {
      type: 'hoge';
      data: T;
    }
  | {
      type: 'fuga';
    };

export type SomeProps<T, K extends keyof T> = {
  [key in K]: T[K];
};

const user: User = {
  id: '001',
  name: 'sugiyama',
  age: 33,
};

export const getUserPickItem = <T extends keyof User>(key: T, userData: User) => {
  return userData[key];
};

getUserPickItem('age', user);

type Exact<T, R> = T extends R ? (R extends T ? T : never) : never;

type Base = {
  b: number;
};

type Dirived = Base & {
  d: number;
};

function baseFunc(base: Base) {
  return console.info(base);
}

function exactBaseFunc<T = Base>(b: Exact<T, Base>) {
  return console.info(b);
}

const base: Base = { b: 1 };
const derived: Dirived = { b: 1, d: 2 };

baseFunc(base);
baseFunc(derived);

exactBaseFunc(base);
// exactBaseFunc(derived);
