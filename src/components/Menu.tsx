import { useCallback, useEffect, useState } from "react";
import { getMenu } from "../services/menuService";
import { MenuItem as MenuItemDetails } from "../models/menu";
import MenuItem from "./MenuItem";

const Menu = () => {
  const [menu, setMenu] = useState<MenuItemDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<string[]>([]);

  // TODO decouple presentation from business logic
  const fetchMenu = useCallback(async () => {
    const menuResponse = await getMenu();
    return menuResponse.map((menuItem) => ({
      id: menuItem.id,
      name: menuItem.name,
      // TODO validate and convert price
      price: menuItem.price,
      // TODO category enum?
      category: menuItem.category
    }));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // TODO handle errors
    fetchMenu()
      .then((menu) => setMenu(menu))
      .finally(() => setIsLoading(false));
  }, [fetchMenu]);

  const handleAdd = useCallback((menuItemId: string) => {
    setOrder([...order, menuItemId]);
  }, [order]);

  return (
    <>
      <h1>Menu</h1>
      {isLoading ? (
        <p data-testid="loading">loading</p>
      ) : (
        <>
          <ul>
            {menu.map((item) => <li key={item.id}><MenuItem menuItem={item} handleAdd={handleAdd}/></li>)}
          </ul>
          {
            // TODO confirm desire for order summary and extract as needed
            order.length > 0 ? (
              <section>
                <h2>Order Summary</h2>
                <p>Item count: {order.length}</p>
              </section>
            ) : null}
        </>
      )}
    </>
  );
};

export default Menu;
