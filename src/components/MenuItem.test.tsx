import { render, screen } from "@testing-library/react";
import MenuItem from "./MenuItem";
import { MenuItem as MenuItemDetails } from "../models/menu";
import userEvent from "@testing-library/user-event";

describe("<MenuItem />", () => {
  it("displays menu item content", () => {
    const menuItemDetails: MenuItemDetails = {
      id: "1f939cac-391f-438a-aeb5-b47299e625da",
      name: "Beef Taco",
      category: "Tacos",
      price: 1.0
    };
    const handleAdd = jest.fn();
    render(<MenuItem menuItem={menuItemDetails} handleAdd={handleAdd}/>);
    const formattedPrice = "1.00";

    expect(screen.getByRole("heading", { name: menuItemDetails.name })).toBeInTheDocument();
    expect(screen.getByText(formattedPrice)).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "Add to Order" }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(menuItemDetails.id);

    expect.assertions(4);
  });
});
