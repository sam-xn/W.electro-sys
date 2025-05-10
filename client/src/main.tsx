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
import NewJob from './components/services/jobs/NewJob.jsx'
import UpdateJob from './components/services/jobs/UpdateJob.jsx'
import PrintJob from './components/services/jobs/PrintJob.jsx'
import Receipts from './components/services/receipts/Receipts.jsx'
import PrintReceipt from './components/services/receipts/PrintReceipt.jsx'
import NewReceipt from './components/services/receipts/NewReceipt.jsx'

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
                path: "/orders/:id/new",
                element: <NewJob />
            },
            {
                path: "/orders/:id/contacts",
                element: <Outlet />
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
                path: "/jobs/:id/update",
                element: <UpdateJob />
            },
            {
                path: "/jobs/:id/print",
                element: <PrintJob />
            },
            {
                path: "/receipts",
                element: <Receipts />
            },
            {
                path: "/receipts/:id",
                element: <PrintReceipt />
            },
            {
                path: "/receipts/new",
                element: <NewReceipt />
            },
            {
                path: "/customers",
                element: <Outlet />
            },
            {
                path: "/orders/:id/contacts",
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