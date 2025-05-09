import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import OrdersNavbar from './OrdersNavbar';
import { Search } from "lucide-react";

import OrderService from "./order.service";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const filter = useParams();

    useEffect(() => { 
        OrderService.findByCriteria(filter.status, searchCustomer, searchPO)
            .then((response) => {
                setOrders(response.data.sort((a, b) => b.id - a.id)); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [filter.status]);

    // ------------------------------------------------------------------------------------ SearchBar 

    const [searchCustomer, setSearchCustomer] = useState("");
    const [searchPO, setSearchPO] = useState("");

    const onChangeSearchCustomer = (e) => { setSearchCustomer(e.target.value); };
    const onChangeSearchPO = (e) => { setSearchPO(e.target.value); };

    function findBy(e) {
        e.preventDefault();
        OrderService.findByCriteria(filter.status, searchCustomer, searchPO)
            .then((response) => {
                setOrders(response.data.sort((a,b) => b.id - a.id));
                })
            .catch((e) => {
                console.log(e);
            });
    }

    const input_classname = "block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6";
    const th_classname = "h-12 px-4 align-middle font-medium border-b border-slate-500";
    const td_classname = "p-2 border border-slate-300";
    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    const newPO_classname = "grid text-center text-sm shadow-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-3 bg-[#eff1fc]";

    return (
        <>
            <div className="mr-6">
                <OrdersNavbar />
            </div>
            <div className="grid grid-cols-4">
                <div className="text-md p-4 pt-6 border-b border-slate-500 text-[#544B76]">
                    {(filter.status ? String(filter.status).charAt(0).toUpperCase()+String(filter.status).slice(1) : "All") + " Orders"}
                </div>
                <div></div><div></div>
                <div className="pt-8 pr-10">
                    <Link
                        className={newPO_classname}
                        to={'/orders/new'}
                    >
                        Create New PO
                    </Link>
                </div>
            </div>

            <div className="mr-6 mt-2">

                <div className="grid grid-cols-2 gap-4 items-center">
                    <form onSubmit={ findBy }>
                        <div className="m-4 p-4">
                            <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-sm">
                                <div className="flex items-center pl-2">
                                    <Search size={ 16 } color="#94a3b8" />
                                </div>
                                <input
                                    list="customer"
                                    type="text"
                                    name="customer"
                                    id="customer"
                                    className={ input_classname }
                                    placeholder={ "Search by customer" }
                                    value={ searchCustomer }
                                    onChange={ onChangeSearchCustomer }
                                />
                            </div>
                        </div>
                    </form>
                    <form onSubmit={ findBy }>
                        <div className="m-4 p-4">
                            <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-sm">
                                <div className="flex items-center pl-2">
                                    <Search size={ 16 } color="#94a3b8" />
                                </div>
                                <input
                                    list="PO"
                                    type="text"
                                    name="PO"
                                    id="PO"
                                    className={ input_classname }
                                    placeholder={ "Search by PO" }
                                    value={ searchPO}
                                    onChange={ onChangeSearchPO }
                                />
                            </div>
                        </div>
                    </form>
                </div>

                { /*-------------------------------------------------------- Orders Table />*/ }
                <div className="border border-slate-500 rounded-md overflow-hidden mb-4">
                    <table className="w-full caption-bottom text-sm">
                        <thead> 
                            <tr className="text-[#544B76]">
                                <th className={ th_classname }>
                                    Date
                                </th>
                                <th className={ th_classname }>
                                    Customer
                                </th>
                                <th className={ th_classname }>
                                    PO #
                                </th>
                                <th className={ th_classname }></th>
                            </tr>
                        </thead>
                        <tbody>
                            { orders.map((order, index) => (
                                <>
                                    <tr className="even:bg-white odd:bg-[#eff1fc]">
                                        <td className={ td_classname }
                                            key={ [index, order.id, order._timestamp] }
                                        >
                                            { new Date(order._timestamp).toDateString() }
                                        </td>
                                        <td className={ td_classname }
                                            key={ [index, order.id, order.customer] }
                                        >
                                            { order.customer }
                                        </td>
                                        <td className={ td_classname }
                                            key={ [index, order.id, order.po_num] }
                                        >
                                            { order.po_num }
                                        </td>
                                        <td className={ td_classname }
                                            key={ index, order.id }
                                        >
                                        <Link
                                            className={ button_classname }
                                            to={ `/orders/${order.id}` }
                                        >
                                            View Order
                                        </Link>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}  