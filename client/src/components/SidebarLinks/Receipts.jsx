import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Search } from 'lucide-react';

import Sidebar from '/src/components/Sidebar';
import ReceiptsNavbar from '/src/components/Navbars/ReceiptsNavbar';

import ReceiptService from '/src/components/http/receipt.service';

export default function Receipts() {

    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        ReceiptService.search(searchDS, searchCustomer, searchPO)
            .then((response) => {
                let r = response.data; 

                const new_r = [];
                let cd; let pd;
                let cr; let pr;
                r.forEach((receipt, index) => {
                    receipt.deliverables.sort((a, b) => a.job.po_id - b.job.po_id)
                    receipt.customer = receipt.deliverables[0].job.order.customer;

                    if (index == 0) new_r.push({
                        id: receipt.id,
                        _timestamp: receipt._timestamp,
                        customer: receipt.deliverables[0].job.order.customer,
                        orders: []
                    });
                    else if (r[index].id != r[index - 1].id) new_r.push({
                        id: receipt.id,
                       _timestamp: receipt._timestamp,
                        customer: receipt.deliverables[0].job.order.customer,
                        orders: []
                    });

                    for (let i = 0; i < receipt.deliverables.length; i++) {

                        cd = receipt.deliverables[i];

                        if (i == 0) {
                            new_r[new_r.length - 1].orders.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num
                            });
                            pd = cd;
                            continue;
                        }
                        if (pd.job.po_id != cd.job.po_id) {
                            new_r[new_r.length - 1].orders.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num
                            });
                        }

                        pd = cd;
                    }
                });

                setReceipts(new_r.sort((a, b) => b.id - a.id));
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

                const new_r = [];
                let cd; let pd;
                let cr; let pr;
                r.forEach((receipt, index) => {
                    receipt.deliverables.sort((a, b) => a.job.po_id - b.job.po_id)
                    receipt.customer = receipt.deliverables[0].job.order.customer;

                    if (index == 0) new_r.push({
                        id: receipt.id,
                        _timestamp: receipt._timestamp,
                        customer: receipt.deliverables[0].job.order.customer,
                        orders: []
                    });
                    else if (r[index].id != r[index - 1].id) new_r.push({
                        id: receipt.id,
                        _timestamp: receipt._timestamp,
                        customer: receipt.deliverables[0].job.order.customer,
                        orders: []
                    });

                    for (let i = 0; i < receipt.deliverables.length; i++) {

                        cd = receipt.deliverables[i];

                        if (i == 0) {
                            new_r[new_r.length - 1].orders.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num
                            });
                            pd = cd;
                            continue;
                        }
                        if (pd.job.po_id != cd.job.po_id) {
                            new_r[new_r.length - 1].orders.push({
                                po_id: cd.job.po_id,
                                po_num: cd.job.order.po_num
                            });
                        }

                        pd = cd;
                    }
                });

                setReceipts(new_r.sort((a, b) => b.id - a.id));
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
    const newDS_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm text-white hover:text-[#544B76] shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] text-white hover:bg-[#DEE1F4] rounded-md";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className=""><Sidebar /></div>
                <div className="col-span-5"> <ReceiptsNavbar />

                    <div className="grid grid-cols-4">
                        <div className="text-md p-4 pt-6 border-b border-slate-500 text-[#544B76]">
                            All Receipts
                        </div>
                        <div></div><div></div>
                        <div className="pt-8 pr-10">
                            <Link
                                className={newDS_classname}
                                to={'/receipts/new'}
                            >
                                New Receipt
                            </Link>
                        </div>
                    </div>

                    <div className="mt-2">

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
                                            <tr className="even:bg-white odd:bg-[#eff1fc]" key={receipt.id}>
                                                <td className={td_classname+" text-center"}
                                                >
                                                    {receipt.id}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {new Date(receipt._timestamp).toDateString()}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {receipt.customer}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {receipts[index].orders.map((po, po_index) => (
                                                            <>
                                                                <div>{po.po_num}</div>
                                                            </>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {receipt.orders.map((po, po_index) => (
                                                            <>
                                                                <Link className={button_classname} to={`/orders/${po.po_id}`} key={po.po_id}>
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
                </div>
            </div>
        </>
    )
}  