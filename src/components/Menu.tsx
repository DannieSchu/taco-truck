import { useCallback, useEffect, useState } from "react";
import { getMenu } from "../services/menuService";
import { MenuItem as MenuItemDetails } from "../models/menu";
import MenuItem from "./MenuItem";

const Menu = () => {
  const [menu, setMenu] = useState<MenuItemDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMenu = useCallback(async () => {
    const menuResponse = await getMenu();
    return menuResponse.map((menuItem) => ({
      id: menuItem.id,
      name: menuItem.name,
      // todo validate and convert price
      price: menuItem.price,
      // todo category enum?
      category: menuItem.category,
    }));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // todo handle errors
    fetchMenu()
      .then((menu) => setMenu(menu))
      .finally(() => setIsLoading(false));
  }, [fetchMenu]);

  const handleAdd = useCallback(() => {
    console.log("adding item to order");
  }, []);

  return (
    <>
      <h1>Menu</h1>
      {isLoading ? (
        <p data-testid="loading">loading</p>
      ) : (
          <ul>
            {menu.map((item) => <li key={item.id}><MenuItem menuItem={item} onClick={handleAdd}/></li>)}
          </ul>
      )}
    </>
  );
};

export default Menu;
