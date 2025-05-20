import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";

import OrderService from "./order.service";
import JobService from "../jobs/job.service";
import ReceiptService from "../receipts/receipt.service";
import ContactService from "../customers/contact.service";

import Contacts from './Contacts'

import Modal from './Modal';

export default function Order() {
    const params = useParams();

    const [po, setPo] = useState([]);

    const [addNote, setAddNote] = useState(false);
    const [newNote, setNewNote] = useState(po.notes);

    const [receipts, setReceipts] = useState([]);

    const [addReceiptNote, setAddReceiptNote] = useState(false);
    const [newReceiptNote, setNewReceiptNote] = useState(po.receipt_notes);

    // ------------------------------------------------------------------------------------ PO

    useEffect(() => {
        OrderService.get(params.id)
            .then((response) => {
                setPo(response.data); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [addNote, addReceiptNote]);


    // ------------------------------------------------------------------------------------ Jobs 
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        JobService.getOrder(params.id) 
            .then((response) => {
                setJobs(response.data); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [jobs.length]);

    // ------------------------------------------------------------------------------------ Modal 

    const [open, setOpen] = useState(false);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        //const customer = po?.customer ? po.customer : "";
        ContactService.getCompany(po.customer)
            .then((response) => {

                const d = response.data;
                const c = { primary: null, accounting: null, other: [] };
                d.forEach(r => {
                    switch (r.type) {
                        case "primary":
                            c.primary = {
                                name: r.fname + (r.lname ? " " + r.lname : ""),
                                email: r.email
                            }; break;
                        case "accounting":
                            c.accounting = {
                                name: r.fname + (r.lname ? " " + r.lname : ""),
                                email: r.email
                            }; break;
                        default:
                            c.other.push({
                                name: r.fname + (r.lname ? " " + r.lname : ""),
                                email: r.email
                            });
                    }
                });

                setContacts(c);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [contacts.length]);

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

    function fnAddNote() {
        setNewNote(po.notes);
        if (!addNote) setAddNote(true);
        else setAddNote(false);
    }

    function fnAddReceiptNote() {
         setNewReceiptNote(po.receipt_notes);
        if (!addReceiptNote) setAddReceiptNote(true);
        else setAddReceiptNote(false);
    }
    function saveNote() {
        OrderService.updateNote(params.id, { newNote })
            .then((response) => {
                setAddNote(false);
                setNewNote
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function saveReceiptNote() {
        //OrderService.updateReceiptNote(params.id, { newReceiptNote })
        //    .then((response) => {
        //        setAddReceiptNote(false);
        //    })
        //    .catch((e) => {
        //        console.log(e);
        //    });
    }
    function discardNote() {
        setNewNote(po.notes);
        setAddNote(false);
    }

    function discardReceiptNote() {
        setNewReceiptNote(po.receipt_notes);
        setAddReceiptNote(false);
    }

    const div_classname = "max-w-full mr-4 p-8 rounded shadow border border-slate-500";
    const button_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm font-bold shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] hover:bg-[#DEE1F4] rounded-md";
    const addnote_classname = "bg-[#544B76] text-sm outline outline-slate-500 shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 hover:outline-none hover:bg-[#DEE1F4]";
    return (
        <>
            <div className={"bg-[#eff1fc] " + div_classname}>
                <div className="text-[#544B76]">
                    <div className="border-b border-slate-500 p-1 font-bold">
                        <div className="text-xl flex gap-12 py-2 px-8">
                            <div>{`${new Date(po._timestamp).toDateString()}`}</div>
                            <div>{`${String(po.customer).toUpperCase()}`}</div>
                            <div >{`PO # ${po.po_num}`}</div>
                        </div>
                    </div>
                    <div className="grid place-content-end items-center pt-2 font-bold">
                        {`Status: ${po.status}`}
                        <button className="outline bg-[#544B76] text-white mx-2 px-4 py-0.5">Update</button>
                    </div>


                    {po.notes ? 
                        <div className="px-8 pt-4 flex gap-4">
                            <div className="text-lg font-bold underline"> Notes: </div>
                            <div className="text-xl"> {`${po.notes}`} </div>
                        </div>
                    : ""}
                </div>
                <div className="grid grid-cols-4 justify-between gap-4 mx-4 my-8 pb-8 border-b border-slate-500 items-center">
                    {jobs.map((job, index) => 
                        <>
                            <div>
                                <div className={"bg-white "+div_classname} key={ [index,job.id] }>
                                    <div className="flex place-content-between border-b border-slate-500">
                                    <div className="text-sm pt-1 font-bold">{`WE-${job.id}`}</div>
                                    <div className="text-sm pt-1 font-bold">{`${job.status}`}</div>
                                    </div>


                                    <div className="grid grid-cols-1 mt-4">
                                        <div className="py-4">{`Date: ${new Date(job._timestamp).toDateString()}`}</div>
                                        <div className="">{`Qty: ${job.qty}`}</div>
                                        <div className="">{`Process: ${job.process}`}</div>
                                        <div className="pt-4 text-sm text-red-700">{job.remarks ? `${job.remarks}` : ""}</div>
                                    </div>

                                
                                </div>
                                <div className="mt-2">
                                    <Link className="grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-white hover:bg-[#DEE1F4] rounded-md py-2 my-1 mr-4"
                                        to={`/jobs/${job.id}`}>
                                        <p className="text-[#544B76] hover">View Job</p>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="pb-2 gap-4 grid grid-cols-4">
                    <Link className={button_classname} to={`new`}>
                        <p className="text-white hover:text-[#544B76]">Add Jobs</p>
                    </Link>
                    <div></div>
                    {/*<Link className={button_classname} to={`contacts`}>*/}
                    {/*    <p className="text-white hover:text-[#544B76]">View Contacts</p>*/}
                    {/*</Link>*/}
                    <div className="flex place-content-stretch">
                        <button className={button_classname + "max-w-200%"} type="button" onClick={() => setOpen(true)}>
                            <p className="text-white hover:text-[#544B76]">View Contacts</p>
                        </button>
                        <Modal isOpen={open} onClose={() => setOpen(false)}>
                            <Contacts company={po.customer} contacts={contacts} />
                        </Modal>
                    </div>
                    <button
                        className={addnote_classname}
                        onClick={fnAddNote}
                    >
                        <p className="text-white hover:text-[#544B76]">Update Notes</p>
                    </button>
                </div>

                {addNote ?
                    <>
                        <div className="grid grid-cols-4">

                            <div></div>
                            <div></div>

                            <div className="col-span-2 flex gap-2 self-end py-4">
                                <input
                                    className="w-3/4 px-4 bg-white focus:outline-none max-w-full border border-slate-500"
                                    onChange={(e) => setNewNote(e.target.value)}
                                    value={newNote}
                                ></input>
                                <button
                                    className="w-1/8 outline outline-slate-500 rounded-xs text-xxs text-[#544B76] bg-white hover:bg-[#DEE1F4] my-2"
                                    onClick={saveNote}
                                >
                                    Save
                                </button>
                                <button
                                    className="w-1/8 outline outline-slate-500 rounded-xs text-xxs text-[#544B76] bg-white hover:bg-[#DEE1F4] my-2"
                                    onClick={discardNote}
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </>
                    : <></>
                }

            </div>

            <div className={"bg-[#eff1fc] my-8 " + div_classname}>
                <div className="text-[#544B76] font-bold text-xl border-b border-slate-500 p-1">
                    <div> Receipts </div>
                </div>

                 {/*------------------------------------------------------------------------------------ Receipts */}

                <div className="grid grid-cols-2 justify-between mx-4 mt-4">
                    {receipts.map((receipt, index) =>
                        <>
                            <div className={div_classname+" bg-white mb-8 grid grid-cols-1 place-content-between  text-black"} key={[index, receipt.id]}>

                                <div>
                                   <div className="font-bold border-b border-slate-500">
                                       {`Date: ${new Date(receipt._timestamp).toDateString()}`}
                                    </div>

                                    <div className="pb-8">{`Delivery Slip # ${receipt.id}`}</div>

                                    <div className="pb-8 px-4">
                                        {receipts[index].orders.map((po, po_index) =>
                                            <>
                                                <div className="font-bold pt-4">
                                                    {`PO # ${po.po_num}`}
                                                </div>
                                                    
                                                {po.deliverables.map((d, d_index) =>
                                                    <>
                                                        <div className="flex gap-4">
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
                                    <div className="my-4 bg-">
                                        <Link className={button_classname} to={`/receipts/${receipt.id}`}>
                                            <p className="text-white">Print Receipt</p>
                                        </Link>
                                    </div>
                                    {/*<div className="my-4">*/}
                                    {/*    <Link className={button_classname} to={`/receipts/${receipt.id}`}>*/}
                                    {/*        Update Receipt*/}
                                    {/*    </Link>*/}
                                    {/*</div>*/}
                                </div>

                            </div>

                        </>
                    )}
                </div>

                <div className="pt-8 pb-2 gap-4 grid grid-cols-4 border-t border-slate-500">
                    <div></div>
                    <div></div>
                    <div></div>
                    <button
                        className={addnote_classname}
                        onClick={fnAddReceiptNote}
                    >
                        <p className="text-white">Update Notes</p>
                    </button>
                </div>
                {addReceiptNote ?
                    <>
                        <div className="grid grid-cols-4">

                            <div></div>
                            <div></div>

                            <div className="col-span-2 flex gap-2 self-end py-4">
                                <input
                                    className="w-3/4 px-4 bg-white focus:outline-none max-w-full border border-slate-500"
                                    onChange={(e) => setNewReceiptNote(e.target.value)}
                                    value={newReceiptNote}
                                ></input>
                                <button
                                    className="w-1/8 outline outline-slate-500 rounded-xs text-xxs text-[#544B76] bg-white hover:bg-[#DEE1F4] my-2"
                                    onClick={saveReceiptNote}
                                >
                                    Save
                                </button>
                                <button
                                    className="w-1/8 outline outline-slate-500 rounded-xs text-xxs text-[#544B76] bg-white hover:bg-[#DEE1F4] my-2"
                                    onClick={discardReceiptNote}
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </>
                    : <></>
                }

            </div>
        </>
    )
}