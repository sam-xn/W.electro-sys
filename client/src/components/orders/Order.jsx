import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import OrderService from '/src/components/http/order.service';
import JobService from '/src/components/http/job.service';
import ReceiptService from '/src/components/http/receipt.service';
import ContactService from '/src/components/http/contact.service';

import Contacts from '/src/components/Contacts'

import Modal from '/src/components/Modal';

export default function Order() {
    const params = useParams();

    const [po, setPo] = useState([]);
    const [receipts, setReceipts] = useState([]);

    const [orderNotes, setOrderNotes] = useState([]);
    const [addNote, setAddNote] = useState(false);
    const [newNote, setNewNote] = useState("");

    const [receiptNotes, setReceiptNotes] = useState([]);
    const [addReceiptNote, setAddReceiptNote] = useState(false);
    const [newReceiptNote, setNewReceiptNote] = useState("");

    const [markFinished, setMarkFinished] = useState(false);
    const [markInvoiced, setMarkInvoiced] = useState(false);
    const [markPriced, setMarkPriced] = useState(false);
    const [autoFinish, setAutoFinish] = useState(false);

    const [addPrice, setAddPrice] = useState("");
    const [newPrice, setNewPrice] = useState("");


    // ------------------------------------------------------------------------------------ PO

    useEffect(() => {
        OrderService.get(params.id)
            .then((response) => {
                setPo(response.data); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [markFinished, autoFinish, markInvoiced, markPriced]);

    useEffect(() => {
        OrderService.getNotes(params.id)
            .then((response) => {
                setOrderNotes(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [addNote]);

    function statusUpdate(newStatus) {
        OrderService.update(params.id, { status: newStatus })
            .then((response) => {
                console.log("found statusUpdate");
                switch (newStatus) {
                    case "finished": { setMarkFinished(false); break }
                    case "invoiced": { setMarkInvoiced(false); break }
                    case "priced": { setMarkPriced(false); break }
                }
                setMarkFinished(false); 
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function saveNote() {
        OrderService.createNote({ order_id: params.id, content: newNote, status: "new" })
            .then((response) => {
                setAddNote(false);
                setNewNote("");
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // ------------------------------------------------------------------------------------ Jobs 
    const [jobs, setJobs] = useState([]); 

    useEffect(() => {
        JobService.getOrder(params.id) 
            .then((response) => {
                setJobs(response.data); 

                const po_status = response.data[0].order.status;
                if (po_status === "open") {
                    let updateStatusFinished = true;
                    let autoUpdateFinished = true;
                    response.data.forEach(job => {
                        if (job.status === "delivered-partial") autoUpdateFinished = false;
                        if (job.status === "incoming" || job.status === "received" || job.status == "processed") {
                            autoUpdateFinished = false;
                            updateStatusFinished = false;
                        }
                    });
                    if (autoUpdateFinished) {
                        OrderService.update(params.id, { status: "finished" })
                            .then(() => { setAutoFinish(true); })
                            .catch((e) => { console.log(e); });
                    }
                    else setMarkFinished(updateStatusFinished);
                }
                else if (po_status === "finished") {
                    let updateStatus = true;
                    response.data.forEach(job => {
                        if (!job.price) updateStatus = false;
                    })
                    if (updateStatus) {
                        setMarkPriced(true);
                        //OrderService.update(params.id, { status: "priced" })
                        //    .then((response) => {
                        //        setMarkInvoiced(true);
                        //    })
                        //    .catch((e) => {
                        //        console.log(e);
                        //    });
                    }
                }
                else if (po_status === "priced") {
                    setMarkInvoiced(true);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function fnAddPrice(jId) {
        if (addPrice === "") setAddPrice(jId);
        else setAddPrice("");
    }
    function savePrice(jId) {
        JobService.update(jId, { price: newPrice })
            .then(() => {
                setAddPrice("");
                setNewPrice("");
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // moved to printTag
    //function jobStatusUpdate(jId, status) {
    //    JobService.update(jId, { status: status })
    //        .catch((e) => {
    //            console.log(e);
    //        });
    //}

    // ------------------------------------------------------------------------------------ Modal 

    const [open, setOpen] = useState(false);

    // ------------------------------------------------------------------------------------ Receipt 

    useEffect(() => {
        ReceiptService.getOrder(params.id)
            .then((response) => { 
                const rIds = response.data.map(rId => rId.id); 
                let rIds_str = "";
                rIds.forEach(rId => rIds_str += String(rId) + ',');

                ReceiptService.getList(rIds_str.slice(0,-1))
                    .then((response) => {
                        let d = response.data;

                        const r = [];
                        let cd;
                        let pd;
                        d.forEach(receipt => {
                            receipt.deliverables.sort((a, b) => a.job.po_id - b.job.po_id);
                            r.push({
                                id: receipt.id,
                                _timestamp: receipt._timestamp,
                                orders: []
                            });
                            for (let i = 0; i < receipt.deliverables.length; i++) {

                                cd = receipt.deliverables[i];

                                if (i == 0) {
                                    r[r.length - 1].orders.push({
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
                                    r[r.length - 1].orders.push({
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
                                    r[r.length - 1].orders[r[r.length - 1].orders.length - 1].deliverables.push({
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
                        });

                        setReceipts(r);
                    })
                    .catch ((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        ReceiptService.getNotes(params.id)
            .then((response) => {
                setReceiptNotes(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [addReceiptNote]);

    function saveReceiptNote() {
        ReceiptService.createNote({ order_id: params.id, content: newReceiptNote, status: "new" })
            .then((response) => {
                setAddReceiptNote(false);
                setNewReceiptNote("");
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const div_classname = "max-w-full mr-4 p-8 rounded shadow border border-slate-500";
    const button_classname = "grid py-2 px-2 text-center text-white hover:text-[#544B76] text-sm shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] hover:bg-[#DEE1F4] rounded-md";
    const addnote_classname = "bg-[#544B76] text-sm rounded outline outline-slate-500 shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 hover:outline-none hover:bg-[#DEE1F4]";
    return (
        <>
            <div className="grid grid-cols-6">
                <div className="mb-8"><Sidebar /></div>
                <div className="col-span-5"> 
                    <div className={"bg-[#eff1fc] " + div_classname}>
                        <div className="text-[#544B76]">
                            <div className="border-b border-slate-500 place-content-between p-1 font-bold flex justify-between">
                                <div className="text-xl flex gap-12 py-2 px-8">
                                    <div>{`${new Date(po._timestamp).toDateString()}`}</div>
                                    <div>{`${String(po.customer).toUpperCase()}`}</div>
                                    <div >{`PO # ${po.po_num}`}</div>
                                </div>
                                <div className="py-2 px-8">
                                    {`status: ${po.status}`}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 mt-2">
                                {orderNotes.length > 0 ? <>
                                    <div className="col-span-3 flex gap-8 border-b mx-4 items-start">
                                        <div className="pl-8 pt-4 text-lg font-bold underline"> Notes: </div>
                                        <div className="grid pt-2">
                                            {orderNotes.map((note) => <div className="text-lg"> {"* "+note.content} </div>)}
                                        </div>
                                    </div>
                                </>
                                : <> <div></div><div></div><div></div> </>
                                }
                                <div>
                                    {po.status === "open"
                                        ?
                                        <Link className={button_classname + " bg-blue-800 mt-1"} to={`new`}>
                                            <p className="">Add Jobs</p>
                                        </Link>
                                        : <></>
                                    }
                                    <div className={button_classname + " bg-blue-800  mt-1"}>
                                        <Link to={`/orders/${params.id}/edit`}>
                                            <p className="text-sm">
                                                Edit PO
                                            </p>
                                        </Link>
                                    </div>
                                    <div className={button_classname + " mt-2"}>
                                        <button onClick={() => setOpen(true)}>
                                            <p className="text-sm">
                                                View Contacts
                                            </p>
                                        </button>
                                    </div>
                                    <div className={button_classname + " mt-1"}>
                                        <button onClick={() => setAddNote(!addNote)}>
                                                <p className="text-sm">
                                                    {addNote? "Discard New Note" : "Add Notes"}
                                                </p>
                                        </button>
                                    </div>
                                   
                                </div>
                            </div>
                            {addNote ? <>
                                <div className="flex place-content-end">
                                    <div className="flex gap-2 self-end py-4">
                                        <input
                                            className="w-md px-4 bg-white text-black focus:outline-none max-w-full border border-slate-500"
                                            onChange={(e) => setNewNote(e.target.value)}
                                            value={newNote}
                                        ></input>
                                        <button
                                            className={ button_classname}
                                                onClick={saveNote}
                                            >
                                            <p className="text-sm"> Save </p>
                                        </button>
                                    </div>
                                </div>
                            </>
                            : <></>
                            }
                            <Modal isOpen={open} onClose={() => setOpen(false)}>
                                <Contacts company={po.customer} />
                            </Modal>

                        </div>

                        <div className="grid grid-cols-4 justify-between gap-4 mx-4 my-8 pb-8 border-b border-slate-500 items-center">
                            {jobs.map((job, index) => 
                                <>
                                    <div>
                                        <div className={"bg-white "+div_classname} key={job.id}>
                                            <div className="flex place-content-between border-b border-slate-500 pb-1">
                                            <div className="text-sm pt-1 font-bold">{`WE-${job.id}`}</div>
                                            <div className="text-sm pt-1 font-bold">{`${job.status}`}</div>
                                            </div>


                                            <div className="grid grid-cols-1 mt-4">
                                                <div className="py-4">{`${new Date(job._timestamp).toDateString()}`}</div>
                                                <div className="flex gap-2 font-semibold"> {`Qty: ${job.qty}`}</div>
                                                <div className="font-semibold">{`${job.process}`}</div>
                                                <div className="pt-4 text-sm text-red-700">{job.remarks ? `${job.remarks}` : ""}</div>

                                                {job.status !== "incoming" && job.status !== "received"
                                                    ? <>
                                                        {job.tag.operator ? <> <div className="pt-4 pb-1 flex gap-4"> Operator: <div className="font-semibold text-blue-700">{job.tag.operator_initial}</div></div> </> : <></>}
                                                        <div className="flex gap-4 items-center">
                                                            {job.tag.rack_type ? <> Rack Type: <div className="font-semibold text-blue-700 pr-6 border-r border-slate-500">{job.tag.rack_type} </div> </> : <></> }
                                                            {job.tag.diff_level ? <> Difficulty: <div className="font-semibold text-blue-700">{job.tag.diff_level} </div> </> : <></> }
                                                        </div>
                                                        {job.tag.operator_notes ? <div className="pt-1 font-semibold text-blue-700">{`-- ${job.tag.operator_notes}`}</div> : <></>}
                                                    </>
                                                    : <></>
                                                }
                                                {job.price
                                                    ? <>
                                                        <div className="pt-8 pb-1 flex gap-4">
                                                            <p className="text-red-700">Price:</p>
                                                            {job.price}
                                                        </div>
                                                    </>
                                                    : <></>
                                                }
                                            </div>
                                            
                                            <div className="flex gap-2 place-content-end mt-4 border-t border-slate-500">
                                                <div className="mt-4">
                                                    <Link className={button_classname+" px-4"} to={`/jobs/${job.id}/edit`} >
                                                        <p className="">Edit</p>
                                                    </Link>
                                                </div>
                                                <div className="mt-4">
                                                    <Link className={button_classname + " px-4"} to={`/jobs/${job.id}/print`} >
                                                        <p className="">Print</p>
                                                    </Link>
                                                </div>
                                                {/*{job.status === "incoming" || job.status === "received"*/}
                                                {/*    ? <></> :*/}
                                                {/*    (po.status === "finished" || po.status === "priced"*/}
                                                {/*        ? <>*/}
                                                {/*            <div className="">*/}
                                                {/*                    <div className={button_classname+ " mt-4 mx-4"} >*/}
                                                {/*                    <button onClick={() => fnAddPrice(job.id)}>*/}
                                                {/*                        {addPrice == job.id ? "Close" : (job.price ? "Edit Price" : "Add Price")}*/}
                                                {/*                    </button>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}

                                                {/*        {addPrice == job.id*/}
                                                {/*            ? <>*/}
                                                {/*                <div className="flex gap-2 py-4 pr-12">*/}
                                                {/*                    <input*/}
                                                {/*                        className="w-md px-4 bg-white text-black focus:outline-none max-w-full border border-slate-500"*/}
                                                {/*                        onChange={(e) => setNewPrice(e.target.value)}*/}
                                                {/*                        placeholder={"$ / unit"}*/}
                                                {/*                        value={newPrice}*/}
                                                {/*                    />*/}
                                                {/*                    <button*/}
                                                {/*                        className={button_classname}*/}
                                                {/*                        onClick={() => savePrice(job.id)}*/}
                                                {/*                    >*/}
                                                {/*                        <p className="text-sm"> Save </p>*/}
                                                {/*                    </button>*/}
                                                {/*                </div>*/}
                                                {/*            </> : <></>*/}
                                                {/*        }*/}
                                                {/*        </> : <><div className="border-t border-slate-500 mt-4"></div></>*/}
                                                {/*    )*/}
                                                {/*}*/}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="grid grid-cols-4">
                            {/*<div className={button_classname + " mt-1"}>*/}
                            {/*    <button to={`edit`}>*/}
                            {/*        <p className="text-sm">*/}
                            {/*            Edit PO*/}
                            {/*        </p>*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            <div></div>
                            <div></div><div></div>
                            {markFinished ? <>
                                <div className={button_classname + " mt-1 bg-blue-800"}>
                                    <button onClick={() => statusUpdate("finished")}>
                                        <p className="text-sm">
                                            Update Status: Mark <b>Finished</b>
                                        </p>
                                    </button>
                                </div>
                            </>
                            : <></>}
                            {markInvoiced ? <>
                                <div className={button_classname + " mt-1 bg-blue-800"}>
                                    <button onClick={() => statusUpdate("invoiced")}>
                                        <p className="text-sm">
                                            Update Status: Mark <b>Invoiced</b>
                                        </p>
                                    </button>
                                </div>
                            </>
                            : <></>}
                            {markPriced ? <>
                                <div className={button_classname + " mt-1 bg-blue-800"}>
                                    <button onClick={() => statusUpdate("priced")}>
                                        <p className="text-sm">
                                            Update Status: Mark <b>Priced</b>
                                        </p>
                                    </button>
                                </div>
                            </>
                            : <></>}
                        </div>
                    </div>

                    <div className={"bg-[#eff1fc] my-8 " + div_classname}>
                        <div className="text-[#544B76] font-bold text-xl border-b border-slate-500 p-1">
                            <div> Receipts </div>
                        </div>

                        <div className="grid grid-cols-4 mt-2">
                            {receiptNotes.length > 0 ? <>
                                <div className="col-span-3 flex gap-8 text-[#544B76] border-b border-slate-500 pb-4 mb-8 mx-4 items-start">
                                    <div className="pl-8 pt-4 text-lg font-bold underline"> Notes: </div>
                                    <div className="grid pt-2">
                                        {receiptNotes.map((note) => <div className="text-lg"> {"* " + note.content} </div>)}
                                    </div>
                                </div>
                            </>
                            : <> <div></div><div></div><div></div> </>
                            }
                            <div>
                                <div className={button_classname + " mt-1"}>
                                    <button onClick={() => setAddReceiptNote(!addReceiptNote)}>
                                        <p className="text-sm">
                                            {addReceiptNote ? "Discard New Note" : "Add Notes"}
                                        </p>
                                    </button>
                                </div>


                            </div>
                        </div>
                        {addReceiptNote ? <>
                            <div className="flex place-content-end">
                                <div className="flex gap-2 self-end py-4">
                                    <input
                                        className="w-md px-4 bg-white text-black focus:outline-none max-w-full border border-slate-500"
                                        onChange={(e) => setNewReceiptNote(e.target.value)}
                                        value={newReceiptNote}
                                    ></input>
                                    <button
                                        className={button_classname}
                                        onClick={saveReceiptNote}
                                    >
                                        <p className="text-sm"> Save </p>
                                    </button>
                                </div>
                            </div>
                        </>
                            : <></>
                        }

                         {/*------------------------------------------------------------------------------------ Receipts */}

                        <div className="grid grid-cols-2 justify-between mx-4 mt-4">
                            {receipts.map((receipt, index) =>
                                <>
                                    <div className={div_classname +" bg-white mb-8 grid grid-cols-1 place-content-between"} key={receipt.id}>

                                        <div>
                                           <div className="font-bold border-b border-slate-500">
                                               {`Date: ${new Date(receipt._timestamp).toDateString()}`}
                                            </div>

                                            <div className="pb-8">{`Delivery Slip # ${receipt.id}`}</div>

                                            <div className="pb-8 px-4">
                                                {receipts[index].orders.map((po, po_index) =>
                                                    <>
                                                        <div className="font-bold pt-4" key={po.id}>
                                                            {`PO # ${po.po_num}`}
                                                        </div>
                                                    
                                                        {po.deliverables.map((d, d_index) =>
                                                            <>
                                                                <div className="flex gap-4" key={d.id}>
                                                                    <div>{`${d_index + 1}`}</div><div>|</div>
                                                                    <div>{`Qty: ${d.qty}`}</div>
                                                                    <div>{`${d.job.process}`}</div>
                                                                    <div className="">
                                                                        <i>{d.partial ? ' --- partial pickup - WE-'+d.job.id : ''}</i>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-500 mt-4">
                                            <div className="mt-4 mx-4">
                                                <Link className={button_classname} to={`/receipts/${receipt.id}`}>
                                                    <p className="">Print Receipt</p>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>

                                </>
                            )}
                        </div>
                        <div className="border-b border-slate-500 mb-4"></div>

                    </div>
                </div>
            </div>
        </>
    )
}