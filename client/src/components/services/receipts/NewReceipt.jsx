import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import CustomerService from "../customers/customer.service";
import JobService from "../jobs/job.service";
import ReceiptService from "./receipt.service";
import DeliverableService from "./deliverable.service";

export default function NewReceipt() {

    const navigate = useNavigate();

    const [customer, setCustomer] = useState("select");
    const [customerList, setCustomerList] = useState([]);

    const [processedJobs, setProcessedJobs] = useState([]);
    const [receivedJobs, setReceivedJobs] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [jobIds, setJobIds] = useState([]);
    const [deliverables, setDeliverables] = useState([]);

    const [currentDel, setCurrentDel] = useState("");
    const [inputPartial, setInputPartial] = useState([]);

    const [qty, setQty] = useState("");
    const [delQty, setDelQty] = useState([]);

    //setProcessedJobs, setReceivedJobs
    useEffect(() => {
        CustomerService.getAll()
            .then((response) => {
                setCustomerList(response.data.map((customer) => customer.company));
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    //setJobs
    useEffect(() => {
        const d = [];
        processedJobs.forEach((job) => d.push(job));
        receivedJobs.forEach((job) => d.push(job));

        d.sort((a, b) => a.orderId - b.orderId);

        let cj, pj;
        let j = [];

        for (let i = 0; i < d.length; i++) {

            cj = d[i];

            if (i == 0) {
                j.push({
                    orderId: cj.orderId,
                    po_num: cj.po_num,
                    orderStatus: cj.orderStatus,
                    jobs: []
                });
                cj.jobs.forEach((cjj) =>
                    j[i].jobs.push(cjj));
                pj = cj;
                continue;
            }

            if (cj.orderId != pj.orderId) {
                j.push({
                    orderId: cj.orderId,
                    po_num: cj.po_num,
                    orderStatus: cj.orderStatus,
                    jobs: []
                });
                cj.jobs.forEach((cjj) =>
                    j[j.length - 1].jobs.push(cjj));
            }

            else {
                cj.jobs.forEach((cjj) =>
                    j[j.length - 1].jobs.push(cjj));
            }

            pj = cj;
        }

        setJobs(j);
        //console.log(j)

    }, [processedJobs.length, receivedJobs.length]);

    //setJobIds
    useEffect(() => {

        JobService.getExact('processed', customer)
            .then((response) => {

                let d = response.data.sort((a, b) => a.orderId - b.orderId);
                let cj, pj;
                let j = [];

                for (let i = 0; i < d.length; i++) {

                    cj = d[i];

                    if (i == 0) {
                        j.push({
                            orderId: cj.orderId,
                            po_num: cj.po_num,
                            orderStatus: cj.orderStatus,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                num_pcs: cj.num_pcs,
                                status: cj.status
                            }]
                        });
                        pj = cj;
                        continue;
                    }

                    if (cj.orderId != pj.orderId) {
                        j.push({
                            orderId: cj.orderId,
                            po_num: cj.po_num,
                            orderStatus: cj.orderStatus,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                num_pcs: cj.num_pcs,
                                status: cj.status
                            }]
                        });
                    }

                    else {
                        j[j.length - 1].jobs.push({
                            id: cj.id,
                            _timestamp: cj._timestamp,
                            process: cj.process,
                            num_pcs: cj.num_pcs,
                            status: cj.status
                        })
                    }

                    pj = cj;
                }

                setProcessedJobs(j);
            })
            .catch((e) => {
                console.log(e);
            });

        JobService.getExact('received', customer)
            .then((response) => {

                let d = response.data.sort((a, b) => a.orderId - b.orderId);
                let cj, pj;
                let j = [];

                for (let i = 0; i < d.length; i++) {

                    cj = d[i];

                    if (i == 0) {
                        j.push({
                            orderId: cj.orderId,
                            po_num: cj.po_num,
                            orderStatus: cj.orderStatus,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                num_pcs: cj.num_pcs,
                                status: cj.status
                            }]
                        });
                        pj = cj;
                        continue;
                    }

                    if (cj.orderId != pj.orderId) {
                        j.push({
                            orderId: cj.orderId,
                            po_num: cj.po_num,
                            orderStatus: cj.orderStatus,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                num_pcs: cj.num_pcs,
                                status: cj.status
                            }]
                        });
                    }

                    else {
                        j[j.length - 1].jobs.push({
                            id: cj.id,
                            _timestamp: cj._timestamp,
                            process: cj.process,
                            num_pcs: cj.num_pcs,
                            status: cj.status
                        })
                    }

                    pj = cj;
                }

                setReceivedJobs(j);
                //console.log(j);

            })
            .catch((e) => {
                console.log(e);
            });

        setJobIds([]);

    }, [customer]);

    //setDeliverables
    useEffect(() => {
        if (jobIds.length == 0) {
            setDeliverables([]);
            return;
        }
        JobService.getList(jobIds)
            .then((response) => {
                let d = response.data.sort((a, b) => a.orderId - b.orderId);
                let cj, pj;
                let j = [];

                for (let i = 0; i < d.length; i++) {

                    cj = d[i];

                    if (i == 0) {
                        j.push({
                            orderId: cj.orderId,
                            po_num: cj.po_num,
                            orderStatus: cj.orderStatus,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                jobStatus: cj.jobStatus,
                                process: cj.process,
                                qtyReceived: cj.qtyReceived
                            }]
                        });
                        pj = cj;
                        continue;
                    }

                    if (cj.orderId != pj.orderId) {
                        j.push({
                            orderId: cj.orderId,
                            po_num: cj.po_num,
                            orderStatus: cj.orderStatus,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                jobStatus: cj.jobStatus,
                                process: cj.process,
                                qtyReceived: cj.qtyReceived
                            }]
                        });
                    }

                    else {
                        j[j.length - 1].jobs.push({
                            id: cj.id,
                            _timestamp: cj._timestamp,
                            jobStatus: cj.jobStatus,
                            process: cj.process,
                            qtyReceived: cj.qtyReceived
                        })
                    }

                    pj = cj;
                }

                setDeliverables(j);
                //console.log(j);

            })
            .catch((e) => {
                console.log(e);
            });
    }, [jobIds.length, customer, currentDel]);

    function addToReceipt(e) {
        if (e.target.checked) {
            setJobIds([
                ...jobIds,
                e.target.id
            ]);
            setInputPartial([
                ...inputPartial,
                { id: e.target.id, partial: false }
            ]);
        }
        else {
            setJobIds(
                jobIds.filter(a => a !== e.target.id)
            );
            setInputPartial(
                inputPartial.filter(a => a.id !== e.target.id)
            );
        }
    }
 
    function togglePartial(target) {
        //console.log(target)

        let t = inputPartial;
        if (target.value === "partial") {
            t.forEach((del) => { if (del.id === target.name) del.partial = true; });

        }
        else {
            t.forEach((del) => { if (del.id === target.name) del.partial = false; });
            setDelQty(delQty.filter(a => a.id !== +target.name));
        }
        setInputPartial(t);
        setCurrentDel(target.name + target.value);
    }
    console.log(delQty);
    function submitDel(jobId) {
        let t = delQty.filter(a => a.id !== jobId);
        setDelQty([
            ...t,
            { id: jobId, qty: qty}
        ]);
        setQty("");
    }
    function saveReceipt() {
        if (jobIds.length == 0) return;

        let d = [];
        let jobId, receiptId, newQty, partial, newDel;
        deliverables.forEach(del => {
            del.jobs.forEach(job => {
                //console.log(job.id);

                jobId = job.id;
                if (delQty.find(a => +a.id === +job.id) === undefined) {
                    //console.log("found a no-match");
                    newQty = job.qtyReceived;
                    partial = 0;
                }
                delQty.forEach(a => {
                    if (+a.id === +job.id) {
                        newQty = a.qty;
                        partial = 1;
                    }
                });

                newDel = { partial, newQty, jobId, receiptId };
                d.push(newDel);
                //jobId = job.id;

                //if (delQty.find(a => +a.id === +job.id) === undefined) {
                //    partial = 0;
                //    newQty = job.qtyReceived;
                //}
                //else {
                //    partial = 1;
                //    newQty = delQty.find(a => a.id === +job.id).qty;
                //}
                    
                //newDel = { partial, qty, jobId, receiptId };

                //d.push(newDel);
            });
        });


        console.log(d);

        //let jobs = jobIds;
        //let d = DeliverableService;
        //ReceiptService.create()
        //    .then((response) => {
        //        const receiptId = response.data.id;
        //        const partial = false;
        //        const qty = 0;
        //        jobs.forEach((jobId) => {
        //            d.create({ partial, qty, jobId, receiptId })
        //                .then((response) => {
        //                    //console.log(response);
        //                })
        //                .catch((e) => {
        //                    console.log(e);
        //                });
        //        });
        //        navigate(`${receiptId}`)
        //    })
        //    .catch((e) => {
        //        console.log(e);
        //    });
    }

    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2";
    const input_classname = "focus:outline-none border-b pl-16 pb-1 pt-2";

    const div_classname = "max-w-full mr-4 p-6 rounded shadow border border-slate-500";
    const test = [{id:2}, {id:1}, {id:3}]
    return (
        <>
            <div className="max-w-full mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    New Receipt
                </div>

                <div className="bg-white grid grid-cols-4 m-4 pl-8 py-4 max-w-full border border-slate-500">
                    <div className={label_classname}> Customer: </div>
                    <select
                        className="col-span-3 mr-8 border-b border-slate-500"
                        defaultValue="select"
                        onChange={(e) => setCustomer(e.target.value)}
                    >
                        <option value="select"> {"< select customer >"} </option>
                        {customerList.map((company, index) =>
                            <option value={company}> {company} </option>
                        )}
                    </select>
                </div>
                
                {customer == "select"
                    ? <></>
                    : <>
                        {jobs.length == 0 ? <div className="p-1 mx-8 mt-8 text-[#544B76]">No jobs to display.</div> :
                            <>
                                <div className="p-1 mx-4 mt-8 mb-4 text-[#544B76] font-bold text-lg border-b border-slate-500"> Select Jobs: </div>

                                <form>
                                    {jobs.map((po, index) =>
                                        <>
                                            <div className="p-1 mx-4 text-[#544B76] font-bold text-md"> {`PO # ${po.po_num}`} </div>

                                            <div className="grid grid-cols-4 justify-between gap-4 mx-4 my-4 pb-8">
                                                {po.jobs.map((job, i) =>
                                                    <>
                                                        <div className={"bg-white " + div_classname} key={[index, job.id]}>
                                                            <div className="flex place-content-between border-b border-slate-500">
                                                                <div className="text-sm">{`job # WE-${job.id}`}</div>
                                                            </div>
                                                            <div className="text-sm pt-1">{`status: ${job.status}`}</div>

                                                            <div className="grid grid-cols-1">
                                                                <div className="pt-4">{`Qty: ${job.num_pcs}`}</div>
                                                                <div className="">{`Process: ${job.process}`}</div>
                                                                <div className="pt-4">{`${new Date(job._timestamp).toDateString()}`}</div>
                                                                {/*<div className="py-4">{`Remarks: ${job.remarks}`}</div>*/}
                                                            </div>

                                                            <div className="mt-4 pt-4 px-4 flex gap-2 items-center border-t border-slate-500">
                                                                <input
                                                                    className="outline"
                                                                    type="checkbox"
                                                                    id={job.id}
                                                                    onChange={addToReceipt}
                                                                />
                                                                <div className="text-sm">Add To Receipt</div>
                                                            </div>
                                                        </div>

                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </form>
                            </>
                        }</>
                    }

                    {jobIds.length == 0
                        ? <></>
                        : <>
                            <div className="p-1 mx-4 my-8 text-[#544B76] font-bold text-lg border-b border-slate-500"> Create Deliverables: </div>

                            {deliverables.map((po, po_index) =>
                                <>
                                    <div className="p-1 mx-4 text-[#544B76] font-bold text-md"> {`PO # ${po.po_num}`} </div>

                                    <div className="grid grid-cols-1 justify-between gap-4 mx-8 my-4 pb-8">
                                        {po.jobs.map((job, job_index) =>
                                            <>
                                                <div className={"ml-16 bg-white " + div_classname} key={[job_index, job.id]}>
                                                    <div className="grid grid-cols-3">
                                                        <div>
                                                            <div className="border-b border-slate-500">
                                                                <div className=" text-sm">{`job # WE-${job.id}`}</div>
                                                            </div>
                                                            <div className="pt-4">{`Qty: ${job.qtyReceived}`}</div>
                                                            <div className="">{`Process: ${job.process}`}</div>
                                                            <div className="pt-4">{`${new Date(job._timestamp).toDateString()}`}</div>
                                                        </div>
                                                        <div className="col-span-2 content-center border-l border-slate-500">
                                                            <form className="flex justify-center gap-6">
                                                                <input
                                                                    type="radio"
                                                                    value="partial"
                                                                    name={job.id}
                                                                    checked={inputPartial.find((a) => a.id == job.id) === undefined
                                                                        ? "" : (inputPartial.find((a) => a.id == job.id).partial
                                                                            ? "checked" : "")}
                                                                    onChange={(e) => togglePartial(e.target)}
                                                                /> Partial pickup
                                                                <input
                                                                    type="radio"
                                                                    value="full"
                                                                    name={job.id}
                                                                    checked={inputPartial.find((a) => a.id == job.id) === undefined
                                                                        ? "checked" : (inputPartial.find((a) => a.id == job.id).partial
                                                                            ? "" : "checked")}
                                                                    onChange={(e) => togglePartial(e.target)}
                                                                /> Full pickup
                                                            </form>

                                                            {inputPartial.find((a) => a.id == job.id) === undefined
                                                                ? <></>
                                                                : <> {inputPartial.find((a) => a.id == job.id).partial
                                                                    ? <>
                                                                        <div className="flex justify-center gap-4 mt-6">
                                                                            <div className="font-bold text-md text-[#544B76] border-b pb-1 pt-2">
                                                                                Qty:
                                                                            </div>
                                                                            <input className="focus:outline-none text-center border-b max-w-xs pb-1 pt-2"
                                                                                type="text"
                                                                                placeholder="input required"
                                                                                onChange={(e) => setQty(e.target.value)}
                                                                            />
                                                                            <button
                                                                                className={`outline ${delQty.find((a) => a.id == job.id) === undefined ? "bg-[#544B76]" : "bg-blue-800"} text-white hover:bg-blue-700`}
                                                                                
                                                                                onClick={() => submitDel(job.id)}
                                                                            > {delQty.find((a) => a.id == job.id) === undefined
                                                                                ? "Submit" : "Submitted"}
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                    : <></>}
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="pt-8 mx-8 grid grid-cols-2 place-items-center border-t border-slate-500">
                                <button
                                    className="text-white mb-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-red-800"
                                    onClick={() => navigate(`/receipts`)}
                                >
                                    Discard Receipt
                                </button>
                                <button
                                    className="text-white mb-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-blue-800"
                                    onClick={saveReceipt}
                                >
                                    Create Delivery Slip
                                </button>
                            </div>
                        </>
                    }
            </div>
        </>
    );
}
