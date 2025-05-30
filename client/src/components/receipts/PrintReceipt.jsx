import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import ReceiptService from '/src/components/http/receipt.service';

export default function PrintReceipt() {

    const params = useParams();

    const [receipt, setReceipt] = useState([]);
    const [receiptRows, setReceiptRows] = useState([]);

    useEffect(() => {
        ReceiptService.getPrint(params.id)
            .then(response => {

                let receipt = response.data[0];
                receipt.deliverables.sort((a, b) => a.job.po_id - b.job.po_id);

                const r = {};
                const orders = [];
                let cd;
                let pd;

                r.id = receipt.id;
                r._timestamp = receipt._timestamp;
                r.rcvd_by = receipt.rcvd_by,
                r.ship_to = receipt.ship_to,
                r.customer = receipt.deliverables[0].job.order.customer;

                for (let i = 0; i < receipt.deliverables.length; i++) {

                    cd = receipt.deliverables[i];

                    if (i == 0) {
                        orders.push({
                            id: cd.job.order.id,
                            po_num: cd.job.order.po_num,
                            deliverables: [{
                                id: cd.id,
                                qty: cd.qty,
                                partial: cd.partial,
                                job: {
                                    id: cd.job.id,
                                    process: cd.job.process,
                                    qtyRcvd: cd.job.qtyRcvd
                                }
                            }]
                        });
                        pd = cd;
                        continue;
                    }

                    if (pd.job.order.id != cd.job.order.id) {
                        orders.push({
                            id: cd.job.order.id,
                            po_num: cd.job.order.po_num,
                            deliverables: [{
                                id: cd.id,
                                qty: cd.qty,
                                partial: cd.partial,
                                job: {
                                    id: cd.job.id,
                                    process: cd.job.process,
                                    qtyRcvd: cd.job.qtyRcvd
                                }
                            }]
                        });
                    }

                    else {
                        orders[orders.length - 1].deliverables.push({
                            id: cd.id,
                            qty: cd.qty,
                            partial: cd.partial,
                            job: {
                                id: cd.job.id,
                                process: cd.job.process,
                                qtyRcvd: cd.job.qtyRcvd
                            }
                        });
                    }
                    pd = cd;
                }

                const rRows = [];
                orders.forEach(order => {
                    for (let i = 0; i < order.deliverables.length; i++) {

                        if (i == 0) rRows.push({
                            packages: "",
                            received: "PO # " + order.po_num,
                            bold: true
                        });

                        rRows.push({
                            packages: order.deliverables[i].qty,
                            received: order.deliverables[i].job.process + (order.deliverables[i].partial ? " -- partial pickup" : "")
                        });

                        if (i == order.deliverables.length - 1) rRows.push({
                            packages: "",
                            received: ""
                        });
                    }
                });
                rRows.pop(); // remove last blank line

                if (rRows.length < 12) {
                    for (let i = rRows.length; i < 12; i++)
                        rRows.push({ packages: "", received: "" });
                }

                if (rRows.length > 12) {
                    rRows.splice(11, 0, { packages: "", received: "-- continued on next page --", next_pg: true });

                    const rRowsPgN = [];
                    let pgNRows = rRows.splice(12, rRows.length - 12);

                    let nextReceipts = [];
                    while (pgNRows.length > 12) {
                        pgNRows.splice(11, 0, {/*receipt_not_rendered_here*/});

                        nextReceipts = pgNRows.splice(12, pgNRows.length - 12); 
                        rRowsPgN.push(pgNRows);

                        pgNRows = nextReceipts;
                    }

                    rRowsPgN.push(pgNRows);

                    for (let i = 0; i < rRowsPgN.length; i++) {
                        window.open(`/receipts/${params.id}/pg/${i+2}`);
                    }
                } 

                setReceipt(r);
                setReceiptRows(rRows);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <>
            {/*<div className="rotate-270 -translate-x-45 translate-y-30 h-[528px] aspect-[calc(8.5/5.5)] text-md text-slate-500 items-start">*/}
            <div className="h-[528px] border aspect-[calc(8.5/5.5)] text-md text-slate-500 items-start">

                <div className="flex -translate-x-58 translate-y-62">

                    <div className="-rotate-90 flex gap-4 w-[500px]">
                        <div className="grow self-center border-t-3 border-slate-500 mt-2"> <hr className="mt-0.25 border-slate-500" /> </div>
                        <p className="font-bold text-center text-lg">DELIVERY RECEIPT</p>
                        <div className="grow self-center border-t-3 border-slate-500 mt-2"> <hr className="mt-0.25 border-slate-500" /> </div>
                    </div>


                </div>
                <div className="pr-4 translate-x-10 -translate-y-5 w-[780px]"> 
                    <div className="flex justify-between pb-1 px-1">
                        <div className="flex gap-2"> <p className="font-bold">DATE</p> <p className="underline">{new Date(receipt._timestamp).toDateString()}</p></div>
                        <p className="font-bold">DS # {receipt.id}</p>
                    </div>

                    <div className="border-double border-4 pb-1 mb-1 p-1 flex"> <p>FROM:</p>
                        <div className="grow text-center">
                            <p className="text-center font-semibold"> WATERLOO ELECTROPLATING & METAL FINISHING INC.</p>
                            <p className="text-center"> 105 RANDALL DR. WATERLOO, ON</p>
                            <p className="text-center"> 519 - 884 - 1576</p>
                            <p className="text-center"> GST # ...</p>
                        </div>
                    </div>
                    <div className="border-double border-4 pb-1 p-1 flex"> <p>TO:</p>
                        {receipt ? <p className="grow text-center font-semibold"> {String(receipt.customer).toUpperCase()} </p> : <></>}
                    </div>

                    <div className="border border-2 h-[302px] mt-2">
                        <div className="grid grid-cols-6 bg-slate-500 text-white text-sm text-center">
                            <p className="px-1">PACKAGES</p>
                            <p className="px-1 border-x-2 border-white col-span-4">RECEIVED IN GOOD ORDER</p>
                            <p className="px-1">WEIGHT</p>
                        </div>


                        <div className="grid grid-cols-6 text-sm">
                            {receiptRows.map(order =>
                                <>
                                    <p className="px-1 border-b text-center"> {order?.packages ? order.packages : <br />} </p>
                                    <p className={"px-1 border-x-2 border-b col-span-4" + (order?.bold ? " font-semibold" : " px-4") + (order?.next_pg ? " text-center italic" : "")}> {order?.received ? order?.received : <br />} </p >
                                    <p className="px-1 border-b"></p>
                                </>
                            )}
                        </div>
                        <div className="grid grid-cols-5 text-sm">
                            <div className="flex gap-6 px-1 border-t border-b-4 border-r-2 col-span-2">
                                <p className="pb-3">RECEIVED BY:</p>
                                <p className="grow pt-1 font-semibold">{receipt.rcvd_by}</p>
                            </div>
                            <div className="flex gap-6 px-1 border-t border-b-4 col-span-3">
                                <p className="pb-3">SHIP TO:</p>
                                <p className="grow pt-1 font-semibold">{receipt.ship_to ? receipt.ship_to : "Purchaser"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
