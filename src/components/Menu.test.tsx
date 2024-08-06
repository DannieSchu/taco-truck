import Menu from "./Menu";
import menuFixture from "../fixtures/menu.json";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import OrderProvider from "../stores/OrderProvider";
import OrderSubmitted from "./OrderSubmitted";
import useFetchMenu from "../hooks/useFetchMenu";
import clearAllMocks = jest.clearAllMocks;
import { mapMenuToCategories, mapToMenuItems } from "../models/menu";

jest.mock("../hooks/useFetchMenu")

describe("<Menu />", () => {
  const mockUseFetchMenu = useFetchMenu as jest.Mock;

  beforeEach(() => {
    mockUseFetchMenu.mockReturnValue({
      isLoading: false,
      isError: false,
      fetchMenu: jest.fn(async () => {}),
      menu: mapToMenuItems(menuFixture),
      categorizedMenu: mapMenuToCategories(mapToMenuItems(menuFixture))
    })
  })

  afterEach(() => clearAllMocks())

  const wrapper = ({ children }: { children: ReactNode }) => (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={children}/>
          <Route path="/order" element={<OrderSubmitted />}/>
        </Routes>
      </BrowserRouter>
    </OrderProvider>)

  const renderMenu = () => render(<Menu />, { wrapper })

  it("displays menu content", async () => {
    renderMenu();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Menu");
    const categorySection = await screen.findByTestId(menuFixture[0].category)
    const categoryName = within(categorySection).getByRole("heading", { level: 2, name: menuFixture[0].category })
    expect(categoryName).toBeInTheDocument()
    const menuItemName = within(categorySection).getByRole("heading", { level: 3, name: menuFixture[0].name })
    expect(menuItemName).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(menuFixture.length);
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();

    expect.assertions(5);
  });

  it("adds menu items to order", async () => {
    renderMenu();
    expect(screen.queryByRole("heading", { name: "Order Summary" })).not.toBeInTheDocument()

    // Add first item from menu to order
    expect(await screen.findByRole("heading", { name: menuFixture[0].name })).toBeInTheDocument();
    const firstMenuItem = screen.getByTestId(`menuitem-${menuFixture[0].id}`);
    const firstMenuItemButton = within(firstMenuItem).getByRole("button");
    userEvent.click(firstMenuItemButton);

    expect(await screen.findByRole("heading", { name: "Order Summary" })).toBeInTheDocument()

    // Add second instance of first item from menu to order
    userEvent.click(firstMenuItemButton);
    expect(screen.getByText("Item count: 2")).toBeInTheDocument()

    // Add second item from menu to order
    const secondMenuItem = screen.getByTestId(`menuitem-${menuFixture[1].id}`);
    const secondMenuItemButton = within(secondMenuItem).getByRole("button");
    userEvent.click(secondMenuItemButton);
    expect(screen.getByText("Item count: 3")).toBeInTheDocument()

    expect.assertions(5);
  });

  it("submits order", async () => {
    renderMenu();

    // Add item from menu to order
    const menuItem = await screen.findByTestId(`menuitem-${menuFixture[0].id}`);
    const menuItemButton = within(menuItem).getByRole("button");
    userEvent.click(menuItemButton);
    userEvent.click(menuItemButton);

    // Submit order
    userEvent.click(await screen.findByRole("button", { name: "Submit Order" }));
    const orderSubmitted = await screen.findByRole("heading", { name: "Order Submitted" });
    expect(orderSubmitted).toBeInTheDocument()

    expect.assertions(1);
  });
});
