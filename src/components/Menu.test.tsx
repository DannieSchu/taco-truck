import { render, screen, within } from "@testing-library/react";
import Menu from "./Menu";
import menuFixture from "../fixtures/menu.json";
import userEvent from "@testing-library/user-event";

describe("<Menu />", () => {

    it("displays menu content", async () => {
        // @ts-ignore
        const spy = jest.spyOn(window, "fetch").mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => menuFixture,
        });
        render(<Menu/>);

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
            json: async () => menuFixture,
        });
        render(<Menu/>);
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

        spy.mockRestore();
    });
});
