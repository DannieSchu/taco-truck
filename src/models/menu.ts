import { MenuResponse } from "../services/menuService";

export type MenuItem = {
  id: string;
  name: string;
  priceInCents: number;
  category: string;
};

export type OrderedMenuItem = MenuItem & {
  quantity: number;
};
export type CategoriesMap = Map<string, MenuItem[]>

export const mapMenuToCategories = (menuItems: MenuItem[]): CategoriesMap => {
  const categorized: CategoriesMap = new Map()
  const categories = menuItems.map(item => item.category);
  const deduped = categories.filter((value, index) => categories.indexOf(value) === index);
  deduped.forEach(category => categorized.set(category, menuItems.filter(item => item.category === category)))
  return categorized
}
export const mapToMenuItems = (menuResponse: MenuResponse): MenuItem[] => {
  return menuResponse.map(item => {
      if (item.price < 0) {
        throw Error("Price must be a positive number")
      }
      return {
        id: item.id,
        name: item.name,
        priceInCents: item.price * 100,
        category: item.category
      }
    }
  )
}
