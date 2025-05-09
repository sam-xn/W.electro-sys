import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { Outlet } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

import Orders from './components/services/orders/Orders.jsx'
import Order from './components/services/orders/Order.jsx'
import NewOrder from './components/services/orders/NewOrder.jsx'
import Jobs from './components/services/jobs/Jobs.jsx'
import Job from './components/services/jobs/Job.jsx'
import Receipts from './components/services/receipts/Receipts.jsx'
import Receipt from './components/services/receipts/Receipt.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, 
        children: [
            {
                path: "/orders",
                element: <Orders />
            },
            {
                path: "/orders/status/:status",
                element: <Orders />
            },
            {
                path: "/orders/:id",
                element: <Order />
            },
            {
                path: "/orders/new",
                element: <NewOrder />
            },
            {
                path: "/jobs",
                element: <Jobs />
            },
            {
                path: "/jobs/status/:status",
                element: <Jobs />
            },
            {
                path: "/jobs/:id",
                element: <Job />
            },
            {
                path: "/receipts",
                element: <Receipts />
            },
            {
                path: "/receipts/:id",
                element: <Receipt />
            },
            {
                path: "/receipts/new",
                element: <Outlet />
            },
            {
                path: "/contacts",
                element: <Outlet />
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)