import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import ReceiptsNavbar from './ReceiptsNavbar';
import { Search } from "lucide-react";

import ReceiptService from "./receipt.service";

export default function Receipts() {

    const filter = useParams();
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        ReceiptService.findByCriteria(searchCustomer, searchPO, searchDS)
            .then((response) => {
                let d = response.data.sort((a,b) => b.id - a.id);
                let cr, pr;
                let r = [];

                for (let i = 0; i < d.length; i++) {

                    cr = d[i];

                    if (i == 0) {
                        r.push({
                            id: cr.id,
                            _timestamp: cr._timestamp,
                            notes: cr.notes,
                            customer: cr.customer,
                            process: cr.process,
                            orders: [{
                                po_id: cr.po_id,
                                po_num: cr.po_num
                            }]
                        });
                        pr = cr;
                        continue;
                    }

                    if (cr.id != pr.id) {
                        r.push({
                            id: cr.id,
                            _timestamp: cr._timestamp,
                            notes: cr.notes,
                            customer: cr.customer,
                            process: cr.process,
                            orders: [{
                                po_id: cr.po_id,
                                po_num: cr.po_num
                            }]
                        });
                    }

                    else {
                        r[r.length - 1].orders.push({
                            po_id: cr.po_id,
                            po_num: cr.po_num
                        })
                    }

                    pr = cr;
                }

                r.forEach((rt) => {
                    rt.orders = rt.orders.sort((a, b) => a.po_id - b.po_id);

                    d = [];
                    let cpo, ppo;
                    for (let i = 0; i < rt.orders.length; i++) {

                        cpo = rt.orders[i];

                        if (i == 0) {
                            d.push({
                                po_id: cpo.po_id,
                                po_num: cpo.po_num
                            });
                            ppo = cpo;
                            continue;
                        }

                        if (cpo.po_id != ppo.po_id) {
                            d.push({
                                po_id: cpo.po_id,
                                po_num: cpo.po_num
                            });
                        }

                        ppo = cpo;
                    }

                    rt.orders = d;
                });

                setReceipts(r);
                console.log(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    // ------------------------------------------------------------------------------------ SearchBar 
    const [searchCustomer, setSearchCustomer] = useState("");
    const [searchPO, setSearchPO] = useState("");
    const [searchDS, setSearchDS] = useState("");

    const onChangeSearchCustomer = (e) => { setSearchCustomer(e.target.value); };
    const onChangeSearchPO = (e) => { setSearchPO(e.target.value); };
    const onChangeSearchDS = (e) => { setSearchDS(e.target.value); };

    function findBy(e) {
        e.preventDefault();
        ReceiptService.findByCriteria(searchCustomer, searchPO, searchDS)
            .then((response) => {
                let d = response.data.sort((a, b) => b.id - a.id);
                let cr, pr;
                let r = [];

                for (let i = 0; i < d.length; i++) {

                    cr = d[i];

                    if (i == 0) {
                        r.push({
                            id: cr.id,
                            _timestamp: cr._timestamp,
                            notes: cr.notes,
                            customer: cr.customer,
                            process: cr.process,
                            orders: [{
                                po_id: cr.po_id,
                                po_num: cr.po_num
                            }]
                        });
                        pr = cr;
                        continue;
                    }

                    if (cr.id != pr.id) {
                        r.push({
                            id: cr.id,
                            _timestamp: cr._timestamp,
                            notes: cr.notes,
                            customer: cr.customer,
                            process: cr.process,
                            orders: [{
                                po_id: cr.po_id,
                                po_num: cr.po_num
                            }]
                        });
                    }

                    else {
                        r[r.length - 1].orders.push({
                            po_id: cr.po_id,
                            po_num: cr.po_num
                        })
                    }

                    pr = cr;
                }

                r.forEach((rt) => {
                    rt.orders = rt.orders.sort((a, b) => a.po_id - b.po_id);

                    d = [];
                    let cpo, ppo;
                    for (let i = 0; i < rt.orders.length; i++) {

                        cpo = rt.orders[i];

                        if (i == 0) {
                            d.push({
                                po_id: cpo.po_id,
                                po_num: cpo.po_num
                            });
                            ppo = cpo;
                            continue;
                        }

                        if (cpo.po_id != ppo.po_id) {
                            d.push({
                                po_id: cpo.po_id,
                                po_num: cpo.po_num
                            });
                        }

                        ppo = cpo;
                    }

                    rt.orders = d;
                });

                setReceipts(r);
                console.log(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const input_classname = "block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6";
    const th_classname = "h-12 px-4 align-middle font-medium border-b border-slate-500";
    const td_classname = "p-2 border border-slate-300";
    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    const newDS_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-3 bg-[#eff1fc]";

    return (
        <>
            <div className="mr-6">
                <ReceiptsNavbar />
            </div>
            <div className="grid grid-cols-4">
                <div className="text-md p-4 pt-6 border-b border-slate-500 text-[#544B76]">
                    {(filter.status ? String(filter.status).charAt(0).toUpperCase()+String(filter.status).slice(1) : "All") + " Receipts"}
                </div>
                <div></div><div></div>
                <div className="pt-8 pr-10">
                    <Link
                        className={newDS_classname}
                        to={'/receipts/new'}
                    >
                        Create New DS
                    </Link>
                </div>
            </div>

            <div className="mr-6 mt-2">

                <div className="grid grid-cols-3 gap-4 items-center">
                    <form onSubmit={findBy}>
                        <div className="m-4 p-4">
                            <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-md">
                                <div className="flex items-center pl-2">
                                    <Search size={16} color="#94a3b8" />
                                </div>
                                <input
                                    list="DS"
                                    type="text"
                                    name="DS"
                                    id="DS"
                                    className={input_classname}
                                    placeholder={"Search by DS"}
                                    value={searchDS}
                                    onChange={onChangeSearchDS}
                                />
                            </div>
                        </div>
                    </form>
                    <form onSubmit={findBy}>
                        <div className="m-4 p-4">
                            <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-md">
                                <div className="flex items-center pl-2">
                                    <Search size={16} color="#94a3b8" />
                                </div>
                                <input
                                    list="customer"
                                    type="text"
                                    name="customer"
                                    id="customer"
                                    className={input_classname}
                                    placeholder={"Search by customer"}
                                    value={searchCustomer}
                                    onChange={onChangeSearchCustomer}
                                />
                            </div>
                        </div>
                    </form>
                    <form onSubmit={findBy}>
                        <div className="m-4 p-4">
                            <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-md">
                                <div className="flex items-center pl-2">
                                    <Search size={16} color="#94a3b8" />
                                </div>
                                <input
                                    list="PO"
                                    type="text"
                                    name="PO"
                                    id="PO"
                                    className={input_classname}
                                    placeholder={"Search by PO"}
                                    value={searchPO}
                                    onChange={onChangeSearchPO}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                { /*-------------------------------------------------------- Receipts Table />*/}
                <div className="border border-slate-500 rounded-md overflow-hidden mb-4">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="">
                                <th className={th_classname}>
                                    DS #
                                </th>
                                <th className={th_classname}>
                                    Date
                                </th>
                                <th className={th_classname}>
                                    Customer
                                </th>
                                <th className={th_classname}>
                                    PO #
                                </th>
                                <th className={th_classname}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt, index) => (
                                <>
                                    <tr className="even:bg-white odd:bg-[#eff1fc]">
                                        <td className={td_classname+" text-center"}
                                            key={[index, receipt.id]}
                                        >
                                            {receipt.id}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, receipt.id, receipt._timestamp]}
                                        >
                                            {new Date(receipt._timestamp).toDateString()}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, receipt.id, receipt.customer]}
                                        >
                                            {receipt.customer}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, receipt.id, receipt.po_num]}
                                        >
                                            
                                            <div className="grid grid-cols-1 gap-4">
                                                {receipts[index].orders.map((po, po_index) => (
                                                    <>
                                                        <div>{`${po.po_num}`}</div>
                                                    </>
                                                ))}
                                            </div>

                                        </td>
                                        <td className={td_classname}
                                            key={index, receipt.id}
                                        >
                                            <div className="grid grid-cols-1 gap-1">
                                                {receipt.orders.map((po, po_index) => (
                                                    <>
                                                        <Link className={button_classname} to={`/orders/${po.po_id}`}>
                                                            View Order
                                                        </Link>
                                                    </>
                                                ))}
                                            </div>
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