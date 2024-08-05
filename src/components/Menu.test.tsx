import { render, screen, within } from "@testing-library/react";
import Menu from "./Menu";
import menuFixture from "../fixtures/menu.json";
import orderFixture from "../fixtures/order.json";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";

describe("<Menu />", () => {
  const renderWithRouter = (element: ReactNode) => render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={element}>
        </Route>
      </Routes>
    </BrowserRouter>)

  it("displays menu content", async () => {
    // @ts-ignore
    const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => menuFixture
    });
    renderWithRouter(<Menu />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Menu");
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: menuFixture[0].name })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(menuFixture.length);
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();

    expect.assertions(5);

    spy.mockRestore();
  });

  it("adds menu items to order", async () => {
    // @ts-ignore
    const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => menuFixture
    });
    renderWithRouter(<Menu />);
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

    spy.mockRestore();
  });

  it("submits order", async () => {
    // @ts-ignore
    const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => menuFixture
    });

    renderWithRouter(<Menu />);
    spy.mockRestore();
    // @ts-ignore
    spy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => orderFixture
    })

    // Add item from menu to order
    const menuItem = await screen.findByTestId(`menuitem-${menuFixture[0].id}`);
    const menuItemButton = within(menuItem).getByRole("button");
    userEvent.click(menuItemButton);
    userEvent.click(menuItemButton);

    // Submit order
    userEvent.click(await screen.findByRole("button", { name: "Submit Order" }));
    expect(spy).toHaveBeenCalledWith("https://virtserver.swaggerhub.com/Detroit_Labs/Taco_Truck/1.0.0/order", {
      "body": "{\"orderItems\":[{\"id\":\"d290f1ee-6c54-4b01-90e6-d701748f0851\",\"name\":\"Veggie Taco\",\"price\":1,\"category\":\"Tacos\",\"quantity\":2}]}",
      "method": "POST"
    })

    expect.assertions(1);

    spy.mockRestore();
  });
});
