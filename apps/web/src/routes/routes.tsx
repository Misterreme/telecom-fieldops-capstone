import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import InventoryReservationPage from "../pages/InventoryReservationPage";
import { PlansPage } from "../pages/PlansPage";
import { CatalogPage } from "../pages/CatalogPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LoginPage />
            },
            {
                path: "home",
                element: <HomePage />
            },
            {
                path: "plans",
                element: <PlansPage />
            },
            {
                path: "catalog",
                element: <CatalogPage />
            },
            {
                path: "reserve",
                element: <InventoryReservationPage />
            }
        ]
    }
])
