export type MenuItem = {
  id: string;
  name: string;
  priceInCents: number;
  category: string;
};

export type OrderedMenuItem = MenuItem & {
  quantity: number;
};
