import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import ReceiptService from '/src/components/http/receipt.service';
//import ContactService from '/src/components/http/contact.service';

export default function PrintReceipt() {

    const params = useParams();

    const [receipt, setReceipt] = useState([]);
    const [receiptRows, setReceiptRows] = useState([]);
    console.log(receiptRows);

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
                rRows.pop();

                for (let i = rRows.length; i < 12; i++) {
                    rRows.push({packages: "", received: ""})
                }


                setReceiptRows(rRows);
                setReceipt(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    //useEffect(() => {
    //    ContactService.searchCompany(job.order?.customer, "primary")
    //        .then(response => {
    //            setContact(response.data[0]);
    //        })
    //        .catch((e) => {
    //            console.log(e);
    //        });
    //}, [job]);

    return (
        <>
            <div className="rotate-270 -translate-x-45 translate-y-30 h-[528px] aspect-[calc(8.5/5.5)] text-md text-slate-500 items-start">

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
                        <p className="font-bold">WE-{receipt.id}</p>
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

                    <div className="border border-2 h-[306px] mt-2">
                        <div className="grid grid-cols-6 bg-slate-500 text-white text-sm text-center">
                            <p className="px-1">PACKAGES</p>
                            <p className="px-1 border-x-2 border-white col-span-4">RECEIVED IN GOOD ORDER</p>
                            <p className="px-1">WEIGHT</p>
                        </div>

                        <div className="grid grid-cols-6 text-sm">
                            <p className="px-1 border-b text-center"> {receiptRows[0]?.packages ? receiptRows[0].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4"+(receiptRows[0]?.bold ? " font-semibold" : " px-4")}> {receiptRows[0]?.received ? receiptRows[0]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[1]?.packages ? receiptRows[1].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[1]?.bold ? " font-semibold" : " px-4")}> {receiptRows[1]?.received ? receiptRows[1]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[2]?.packages ? receiptRows[2].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[2]?.bold ? " font-semibold" : " px-4")}> {receiptRows[2]?.received ? receiptRows[2]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[3]?.packages ? receiptRows[3].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[3]?.bold ? " font-semibold" : " px-4")}> {receiptRows[3]?.received ? receiptRows[3]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[4]?.packages ? receiptRows[4].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[4]?.bold ? " font-semibold" : " px-4")}> {receiptRows[4]?.received ? receiptRows[4]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[5]?.packages ? receiptRows[5].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[5]?.bold ? " font-semibold" : " px-4")}> {receiptRows[5]?.received ? receiptRows[5]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[6]?.packages ? receiptRows[6].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[6]?.bold ? " font-semibold" : " px-4")}> {receiptRows[6]?.received ? receiptRows[6]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[7]?.packages ? receiptRows[7].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[7]?.bold ? " font-semibold" : " px-4")}> {receiptRows[7]?.received ? receiptRows[7]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[8]?.packages ? receiptRows[8].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[8]?.bold ? " font-semibold" : " px-4")}> {receiptRows[8]?.received ? receiptRows[8]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[9]?.packages ? receiptRows[9].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[9]?.bold ? " font-semibold" : " px-4")}> {receiptRows[9]?.received ? receiptRows[9]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[10]?.packages ? receiptRows[10].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[10]?.bold ? " font-semibold" : " px-4")}> {receiptRows[10]?.received ? receiptRows[10]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                            <p className="px-1 border-b text-center"> {receiptRows[11]?.packages ? receiptRows[11].packages : <br />} </p>
                            <p className={"px-1 border-x-2 border-b col-span-4" + (receiptRows[11]?.bold ? " font-semibold" : " px-4")}> {receiptRows[11]?.received ? receiptRows[11]?.received : <br />} </p>
                            <p className="px-1 border-b"></p>

                        </div>
                        <div className="grid grid-cols-6 text-sm">

                            <p className="px-1 border-t border-b-4 border-r-2 pb-2 col-span-3">RECEIVED BY</p>
                            <p className="px-1 border-t border-b-4 pb-3 col-span-3">TOTAL</p>
                        </div>


                        {/*<div className="col-span-1">*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*</div>*/}
                        {/*<div className="col-span-4">*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">PO # sdkjshhdh999-09 - strip + clear anodize + teflon (rework)</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*    <p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*</div>*/}
                        {/*<div className="col-span-1">*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*    <p className="px-1 border-b">?</p>*/}
                        {/*</div>*/}




                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        {/*<p className="px-1 border-b"></p>*/}
                        {/*<p className="px-1 border-x-2 border-b col-span-4">?</p>*/}
                        {/*<p className="px-1 border-b"></p>*/}

                        
                    </div>
                    
                </div>

            </div>
        </>
    );
}
