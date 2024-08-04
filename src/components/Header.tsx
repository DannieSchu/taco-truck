import { Outlet } from "react-router-dom";

const Header = () => {
    return (
        <>
            <header>
                <h2>Header</h2>
            </header>
            <Outlet/>
        </>
    )
}

export default Header;
