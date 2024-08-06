import { useCallback, useState } from "react";
import { CategoriesMap, mapMenuToCategories, mapToMenuItems, MenuItem } from "../models/menu";
import { getMenu } from "../services/menuService";

const useFetchMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [categorizedMenu, setCategorizedMenu] = useState<CategoriesMap>(new Map())

  const fetchMenu = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await getMenu();
      const menuItems = mapToMenuItems(response)
      setMenu(menuItems)
      setCategorizedMenu(mapMenuToCategories(menuItems))
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
    menu,
    categorizedMenu
  }
}

export default useFetchMenu;

