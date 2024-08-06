export type MenuResponse = MenuItemResponse[];

type MenuItemResponse = {
  id: string;
  name: string;
  category: string;
  price: number;
  discount_percent?: number;
  discount_threshold?: number;
};

export const getMenu = async (): Promise<MenuResponse> => {
  const response = await fetch(
    "https://virtserver.swaggerhub.com/Detroit_Labs/Taco_Truck/1.0.0/menu",
  );
  return await response.json();
};
