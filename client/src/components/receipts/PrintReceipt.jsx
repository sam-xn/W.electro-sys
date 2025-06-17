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
                            received: order.deliverables[i].job.process
                        });
                        if (order.deliverables[i].partial) rRows.push({
                            packages: "",
                            received: " --- partial pickup out of - " + order.deliverables[i].job.qtyRcvd + " - recv'd"
                        });

                        if (i == order.deliverables.length - 1) rRows.push({
                            packages: "",
                            received: ""
                        });
                    }
                });
                rRows.pop(); // remove last blank line

                if (rRows.length < 21) {
                    for (let i = rRows.length; i < 21; i++)
                        rRows.push({ packages: "", received: "" });
                }


                if (rRows.length > 21) {
                    //rRows.splice(19, 0, { packages: "", received: "" });
                    rRows.splice(20, 0, { packages: "", received: "-- continued on next page --", next_pg: true });

                    const rRowsPgN = [];
                    let pgNRows = rRows.splice(21, rRows.length - 21);

                    let nextReceipts = [];
                    while (pgNRows.length > 21) {
                        //pgNRows.splice(19, 0, {/*receipt_not_rendered_here*/});
                        pgNRows.splice(20, 0, {/*receipt_not_rendered_here*/});

                        nextReceipts = pgNRows.splice(21, pgNRows.length - 21); 
                        rRowsPgN.push(pgNRows);

                        pgNRows = nextReceipts;
                    }

                    rRowsPgN.push(pgNRows);

                    for (let i = 0; i < rRowsPgN.length; i++) {
                        window.open(`/receipts/${params.id}/pg/${i + 2}`);
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
            <div className="translate-x-30 translate-y-10 w-[520px] aspect-[calc(5.5/8.5)] text-sm text-slate-500">

                {/*<div className="grow self-center border-t-3 my-2 mx-3 border-slate-500"> <hr className="mt-0.25 border-slate-500" /> </div>*/}

                <div className="flex gap-4 justify-between mx-3 mb-2">
                    <p className="font-bold text-center text-md"> Delivery Slip # {receipt.id} </p>
                    <p className="font-bold text-center text-md"> {new Date(receipt._timestamp).toDateString()} </p>
                </div>

                {/*<div className="pr-4 translate-x-10 -translate-y-5 w-[780px]"> */}
                <div className="mx-3">

                    <div className="border-double border-4 p-1 flex mb-1"> TO:
                        {receipt ? <p className="grow text-center font-semibold"> {String(receipt.customer).toUpperCase()} </p> : <></>}
                    </div>
                    <div className="border-double border-4 p-1 flex"> FROM:
                        <div className="grow text-center">
                            <p className="font-semibold"> WATERLOO ELECTROPLATING</p>
                            <p className="leading-4"> 3-105 Randall Drive Waterloo ON  N2V 1C5 <br />
                                Tel (519) 884 0797
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 border border-2 h-[calc(100%-50px)]">
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
                            <div className="w-full flex px-1 border-t border-r-2">
                                <p>RECEIVED BY:</p>
                                <p className="grow text-center font-semibold">{receipt.rcvd_by}</p>
                            </div>
                            <div className="w-full flex gap-6 px-1 border-t">
                                <p>SHIP TO:</p>
                                <p className="grow text-center font-semibold">{receipt.ship_to ? receipt.ship_to : "Purchaser"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grow self-center border-t-3 mt-2 border-slate-500"> <hr className="mt-0.25 border-slate-500" /> </div>
                </div>
            </div>
        </>
    );
}
