export interface User {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
}

export function userFromDBO(userDbo: User): User {
  return {
    id: userDbo.id,
    name: userDbo.name,
    email: userDbo.email,
    bankAccount: userDbo.bankAccount,
  };
}