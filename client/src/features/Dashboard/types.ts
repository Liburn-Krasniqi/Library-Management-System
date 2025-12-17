export interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
}

export const userFormat: User = {
  id: "",
  name: "",
  email: "",
  role: "USER", // default role
  createdAt: "",
};
