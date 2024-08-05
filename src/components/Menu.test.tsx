import { render, screen } from "@testing-library/react";
import Menu from "./Menu";
import menuFixture from "../fixtures/menu.json";

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
});
