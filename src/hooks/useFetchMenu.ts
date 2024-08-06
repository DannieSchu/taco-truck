import { useCallback, useState } from "react";
import { MenuItem } from "../models/menu";
import { getMenu, MenuResponse } from "../services/menuService";

const useFetchMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false)
  const [menu, setMenu] = useState<MenuItem[]>([])

  const fetchMenu = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await getMenu();
      const menuItems = mapToMenuItems(response)
      setMenu(menuItems)
    } catch (e) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    fetchMenu,
    isError,
    isLoading,
    menu
  }
}

const mapToMenuItems = (menuResponse: MenuResponse): MenuItem[] => {
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

export default useFetchMenu;

export {
  mapToMenuItems
}
