import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import ReceiptService from '/src/components/http/receipt.service';

export default function PrintReceiptPgN() {

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
                //rRows.splice(19, 0, {/*receipt_not_rendered_here*/});
                rRows.splice(20, 0, {/*receipt_not_rendered_here*/});

                const rRowsPgN = [];
                let pgNRows = rRows.splice(21, rRows.length - 21);

                let nextReceipts = [];
                while (pgNRows.length > 21) {
                    //pgNRows.splice(19, 0, { packages: "", received: "" });
                    pgNRows.splice(20, 0, { packages: "", received: "-- continued on next page --", next_pg: true });

                    nextReceipts = pgNRows.splice(21, pgNRows.length - 21);
                    rRowsPgN.push(pgNRows);

                    pgNRows = nextReceipts;
                }

                rRowsPgN.push(pgNRows);

                for (let i = rRowsPgN[rRowsPgN.length - 1].length; i < 21; i++) {
                    rRowsPgN[rRowsPgN.length - 1].push({ packages: "", received: "" });
                }
                setReceiptRows(rRowsPgN[(params?.pg)-2]);

                setReceipt(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <>
            {/*<div className="rotate-270 -translate-x-45 translate-y-30 h-[528px] aspect-[calc(8.5/5.5)] text-md text-slate-500 items-start">*/}
            <div className="translate-x-52 -translate-y-8 w-[528px] aspect-[calc(5.5/8.5)] text-md text-slate-500">

                <div className="flex gap-4 align-content-center mx-3 mb-2">
                    <div className="grow self-center border-t-3 border-slate-500 mt-2"> <hr className="mt-0.25 border-slate-500" /> </div>
                    <p className="font-bold text-center text-md"> {new Date(receipt._timestamp).toDateString()} </p>
                    <div className="grow self-center border-t-3 border-slate-500 mt-2"> <hr className="mt-0.25 border-slate-500" /> </div>
                </div>

                {/*<div className="pr-4 translate-x-10 -translate-y-5 w-[780px]"> */}
                <div className="mx-3">

                    <div className="mx-1 border-double border-4 mb-1 p-1 flex"> FROM:
                        <div className="grow text-center">
                            <p className="font-semibold"> WATERLOO ELECTROPLATING & METAL FINISHING INC.</p>
                            <p className="leading-4"> 3-105 Randall Drive Waterloo ON  N2V 1C5 <br />
                                Tel (519) 884 0797  Fax (519) 884 ???? <br />
                                GST # R13.. <br />
                            </p>
                        </div>
                    </div>
                    <div className="mx-1 border-double border-4 mt-1 p-1 flex"> TO:
                        {receipt ? <p className="grow text-center font-semibold"> {String(receipt.customer).toUpperCase()} </p> : <></>}
                    </div>

                    <div className="flex gap-4 align-content-center my-1">
                        <div className="grow self-center border-t-3 border-slate-500 mt-2"> <hr className="mt-0.25 border-slate-500" /> </div>
                        <p className="font-bold text-center text-md"> DELIVERY SLIP # {receipt.id} </p>
                        <div className="grow self-center border-t-3 border-slate-500 mt-2"> <hr className="mt-0.25 border-slate-500" /> </div>
                    </div>

                    <div className="border border-2">
                        <div className="grid grid-cols-5 text-sm text-center leading-6 border-b-2">
                            <p className="px-1">QTY</p>
                            <p className="px-1 border-l-2 col-span-4">DESCRIPTION</p>
                        </div>


                        <div className="grid grid-cols-5 text-sm leading-6">
                            {receiptRows.map(order =>
                                <>
                                    <p className="px-2 border-b text-center"> {order?.packages ? order.packages : <br />} </p>
                                    <p className={"px-2 border-l-2 border-b col-span-4" + (order?.bold ? " font-semibold" : " px-4") + (order?.next_pg ? " text-center italic" : "")}> {order?.received ? order?.received : <br />} </p >
                                </>
                            )}
                        </div>
                        <div className="flex text-sm leading-8">
                            <div className="w-full flex gap-6 px-1 border-t border-b-4 border-r-2">
                                <p>RECEIVED BY:</p>
                                <p className="grow text-center font-semibold">{receipt.rcvd_by}</p>
                            </div>
                            <div className="w-full flex gap-6 px-1 border-t border-b-4">
                                <p>SHIP TO:</p>
                                <p className="grow text-center font-semibold">{receipt.ship_to ? receipt.ship_to : "Purchaser"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
