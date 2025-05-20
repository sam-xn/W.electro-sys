import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import ReceiptsNavbar from './ReceiptsNavbar';
import { Search } from "lucide-react";

import ReceiptService from "./receipt.service";

export default function Receipts() {

    const filter = useParams();
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        ReceiptService.search(searchDS, searchCustomer, searchPO)
            .then((response) => {
                let r = response.data;

                const po = [];
                let cd; let pd;
                r.forEach(receipt => {
                    receipt.deliverables.sort((a, b) => a.job.po_id - b.job.po_id)
                    receipt.customer = receipt.deliverables[0].job.order.customer;

                    po.length = 0;
                    for (let i = 0; i < receipt.deliverables.length; i++) {

                        cd = receipt.deliverables[i];

                        if (i == 0) {
                            po.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num,
                                customer: cd.job.order.customer
                            });
                            pd = cd;
                            continue;
                        }
                        if (pd.job.po_id != cd.job.po_id) {
                            po.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num,
                                customer: cd.job.order.customer
                            });
                        }

                        pd = cd;
                    }
                    receipt.orders = po;
                    delete receipt.deliverables;
                });
                
                setReceipts(r);

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
        ReceiptService.search(searchDS, searchCustomer, searchPO)
            .then((response) => {
                let r = response.data;

                const po = [];
                let cd; let pd;
                r.forEach(receipt => {
                    receipt.deliverables.sort((a, b) => a.job.po_id - b.job.po_id)
                    receipt.customer = receipt.deliverables[0].job.order.customer;

                    po.length = 0;
                    for (let i = 0; i < receipt.deliverables.length; i++) {

                        cd = receipt.deliverables[i];

                        if (i == 0) {
                            po.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num
                            });
                            pd = cd;
                            continue;
                        }
                        if (pd.job.po_id != cd.job.po_id) {
                            po.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num
                            });
                        }

                        pd = cd;
                    }
                    receipt.orders = po;
                    delete receipt.deliverables;
                });

                setReceipts(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const input_classname = "block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6";
    const th_classname = "h-12 px-4 align-middle font-medium border-b border-slate-500";
    const td_classname = "p-2 border border-slate-300";
    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    //const newDS_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-3 bg-[#eff1fc]";
    const newDS_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm font-bold shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] text-white hover:bg-[#DEE1F4] rounded-md";

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
                        <p className="text-white">New Receipt</p>
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
                            <tr className="text-[#544B76]">
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
                                            key={[index, receipt._timestamp]}
                                        >
                                            {new Date(receipt._timestamp).toDateString()}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, receipt.customer]}
                                        >
                                            {receipt.customer}
                                        </td>
                                        <td className={td_classname}
                                            key={[index]}
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

                    <div>{
                        receipts.length == 0 ?
                            <div className="text-sm px-8 py-2 bg-[#eff1fc]">
                                {`No receipts to display.`}
                            </div>
                            : <div></div>
                    }</div>

                </div>
            </div>
        </>
    )
}  