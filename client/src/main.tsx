import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { Outlet } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

import Home from './components/Home.jsx'

import Orders from './components/SidebarLinks/Orders.jsx'
import Order from './components/orders/Order.jsx'
import NewOrder from './components/orders/NewOrder.jsx'

import Jobs from './components/SidebarLinks/Jobs.jsx'
import Job from './components/jobs/Job.jsx'
import NewJob from './components/jobs/NewJob.jsx'
import FinishJob from './components/jobs/FinishJob.jsx'
import PrintTag from './components/jobs/PrintTag.jsx'

import Receipts from './components/SidebarLinks/Receipts.jsx'
import NewReceipt from './components/receipts/NewReceipt.jsx'
import PrintReceipt from './components/receipts/PrintReceipt.jsx'
import PrintReceiptPgN from './components/receipts/PrintReceiptPgN.jsx'

import Customers from './components/SidebarLinks/Customers.jsx'
import NewContact from './components/contacts/NewContact.jsx'


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, 
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/orders",
                element: <Orders />,
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
            //{
            //    path: "/orders/:poId/job/:id/update",
            //    element: <FinishJob />
            //},
            {
                path: "/jobs",
                element: <Jobs />
            },
            {
                path: "/jobs/:id",
                element: <Job />
            },
            {
                path: "/jobs/:id/update",
                element: <FinishJob />
            },
            {
                path: "/jobs/status/:status",
                element: <Jobs />
            },
            {
                path: "/jobs/:id/print",
                element: <PrintTag />
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
                path: "/receipts/:id/pg/:pg",
                element: <PrintReceiptPgN />
            },
            {
                path: "/receipts/new",
                element: <NewReceipt />
            },
            {
                path: "/customers",
                element: <Customers />
            },
            {
                path: "/customers/type/:type",
                element: <Customers />
            },
            {
                path: "/contacts/new",
                element: <NewContact />
            },
            {
                path: "/settings",
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