export type Order = {
  id: number;
  status: string;
  customer: Customer;
};

export type Customer = {
  id: number;
  name: string;
};
