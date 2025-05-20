import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import CustomerService from "../customers/customer.service";
import JobService from "../jobs/job.service";
import ReceiptService from "./receipt.service";

export default function NewReceipt() {

    const navigate = useNavigate();

    /* default customer <select> returns [] before attempting to send http-get */
    /* jobs populated & rendered after selection of customer -->  */
    const [customer, setCustomer] = useState("select");
    const [customerList, setCustomerList] = useState([]);

    /* processed & received jobs: http-get returns jobsavailable for receipts */
    /* jobs: combine processed & received jobs available for receipts */
    const [processedJobs, setProcessedJobs] = useState([]);
    const [receivedJobs, setReceivedJobs] = useState([]);
    const [jobs, setJobs] = useState([]);

    /* jobIds: a list of ids sent as params in http get request, used to populate jobs displayed for each customer */
    /* deliverables: array of data returned from http request on each jobIds change: display deliverable options only for selected jobs */
    const [jobIds, setJobIds] = useState([]);
    const [deliverables, setDeliverables] = useState([]);

    /* inputPartial: array saves an ordered list used to decide whether the deliverable radio is rendered as <checked> or <empty str> */
    /* currentDel: e.target.name as deliverable-id when rendering inputPartial*/
    const [inputPartial, setInputPartial] = useState([]);
    const [currentDel, setCurrentDel] = useState("");

    /* qty, setQty: input qty for each deliverable set to partial, updates onChange of input */
    /* delQty, setDelQty: array saves deliverables set to partial where newQty will be added to receipt. updates on togglePartial and addToReceipt */
    const [qty, setQty] = useState(""); 
    const [delQty, setDelQty] = useState([]); 

    // setCustomerList
    useEffect(() => {
        CustomerService.getAll()
            .then((response) => {
                setCustomerList(response.data.map((customer) => customer.company));
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function clearCustomer(e) {
        setCustomer(e.target.value);
        setCurrentDel("");
        setInputPartial([]);
        setQty("");
        setDelQty([]);
    }

    //setProcessedJobs, setReceivedJobs
    useEffect(() => {
        if (customer === "select") {
            setJobIds([]);
            return;
        }
        JobService.getCustomer('processed', customer)
            .then((response) => {
                let d = response.data.sort((a, b) => a.orderId - b.orderId);
                let cj, pj;
                let j = [];

                for (let i = 0; i < d.length; i++) {

                    cj = d[i];

                    if (i == 0) {
                        j.push({
                            orderId: cj.order.id,
                            po_num: cj.order.po_num,
                            orderStatus: cj.order.status,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                qtyRcvd: cj.qty,
                                status: cj.status
                            }]
                        });
                        pj = cj;
                        continue;
                    }

                    if (cj.orderId != pj.orderId) {
                        j.push({
                            orderId: cj.order.id,
                            po_num: cj.order.po_num,
                            orderStatus: cj.order.status,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                qtyRcvd: cj.qty,
                                status: cj.status
                            }]
                        });
                    }

                    else {
                        j[j.length - 1].jobs.push({
                            id: cj.id,
                            _timestamp: cj._timestamp,
                            process: cj.process,
                            qtyRcvd: cj.qty,
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

        JobService.getCustomer('received', customer)
            .then((response) => {

                let d = response.data.sort((a, b) => a.orderId - b.orderId);
                let cj, pj;
                let j = [];

                for (let i = 0; i < d.length; i++) {

                    cj = d[i];

                    if (i == 0) {
                        j.push({
                            orderId: cj.order.id,
                            po_num: cj.order.po_num,
                            orderStatus: cj.order.status,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                qtyRcvd: cj.qty,
                                status: cj.status
                            }]
                        });
                        pj = cj;
                        continue;
                    }

                    if (cj.orderId != pj.orderId) {
                        j.push({
                            orderId: cj.order.id,
                            po_num: cj.order.po_num,
                            orderStatus: cj.order.status,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                process: cj.process,
                                qtyRcvd: cj.qty,
                                status: cj.status
                            }]
                        });
                    }

                    else {
                        j[j.length - 1].jobs.push({
                            id: cj.id,
                            _timestamp: cj._timestamp,
                            process: cj.process,
                            qtyRcvd: cj.qty,
                            status: cj.status
                        })
                    }
                    pj = cj;
                }
                setReceivedJobs(j);
            })
            .catch((e) => {
                console.log(e);
            });

        setJobIds([]);

    }, [customer]);
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

    }, [processedJobs.length, receivedJobs.length]);


    //setDeliverables
    useEffect(() => {
        if (jobIds.length == 0) { setDeliverables([]); return; }
        let jIds_str = "";
        jobIds.forEach(jId => jIds_str += String(jId) + ',');
        
        JobService.getList(jIds_str.slice(0, -1))
            .then((response) => {
                let d = response.data.sort((a, b) => a.orderId - b.orderId);
                let cj, pj;
                let j = [];

                for (let i = 0; i < d.length; i++) {

                    cj = d[i];

                    if (i == 0) {
                        j.push({
                            orderId: cj.order.id,
                            po_num: cj.order.po_num,
                            orderStatus: cj.order.status,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                jobStatus: cj.status,
                                process: cj.process,
                                qtyRcvd: cj.qty
                            }]
                        });
                        pj = cj;
                        continue;
                    }

                    if (cj.orderId != pj.orderId) {
                        j.push({
                            orderId: cj.order.id,
                            po_num: cj.order.po_num,
                            orderStatus: cj.order.status,
                            jobs: [{
                                id: cj.id,
                                _timestamp: cj._timestamp,
                                jobStatus: cj.status,
                                process: cj.process,
                                qtyRcvd: cj.qty
                            }]
                        });
                    }

                    else {
                        j[j.length - 1].jobs.push({
                            id: cj.id,
                            _timestamp: cj._timestamp,
                            jobStatus: cj.status,
                            process: cj.process,
                            qtyRcvd: cj.qty
                        })
                    }

                    pj = cj;
                }

                setDeliverables(j);

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
            setDelQty(
                delQty.filter(a => +a.id !== +e.target.id)
            );
        }
    }
 
    function togglePartial(target) {
        let t = inputPartial;
        if (target.value === "partial") {
            t.forEach((del) => { if (del.id === target.name) del.partial = true; });
        }
        else {
            t.forEach((del) => { if (del.id === target.name) del.partial = false; });
            setDelQty(delQty.filter(a => +a.id !== +target.name));
        }
        setCurrentDel(target.name + target.value);
        setInputPartial(t);
    }

    function submitDel(target) {
        setCurrentDel(target.name + target.value);
        let jobId = target.name;
        let t = delQty.filter(a => a.id !== jobId);
        setDelQty([
            ...t,
            { id: jobId, qty: qty}
        ]);
        setQty("");
    }
    
    function saveReceipt() {
        if (jobIds.length == 0) return;

        let deliverables_data = [];
        let jobId, receiptId, newQty, partial, newDel;
        deliverables.forEach(del => {
            console.log(del)
            del.jobs.forEach(job => {

                jobId = job.id;
                if (delQty.find(a => +a.id === +job.id) === undefined) {
                    newQty = job.qtyRcvd;
                    partial = 0;
                }
                delQty.forEach(a => {
                    if (+a.id === +job.id) {
                        newQty = a.qty;
                        partial = 1;
                    }
                });

                newDel = { partial, newQty, jobId, receiptId };
                deliverables_data.push(newDel);
            });
        });

        //console.log(deliverables_data);

        ReceiptService.create({ deliverables_data })
            .then((response) => {
                navigate(`${response.data.id}`);
            })
            .catch((e) => {
                console.log(e);
                navigate(`/receipts`)
            });
    }

    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2";
    const input_classname = "focus:outline-none border-b pl-16 pb-1 pt-2";

    const div_classname = "max-w-full mr-4 p-6 rounded shadow border border-slate-500";
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
                        onChange={clearCustomer}
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
                                                                <div className="pt-4">{`Qty: ${job.qtyRcvd}`}</div>
                                                                <div className="">{`Process: ${job.process}`}</div>
                                                                <div className="pt-4">{`${new Date(job._timestamp).toDateString()}`}</div>
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
                                                            <div className="pt-4">{`Qty: ${job.qtyRcvd}`}</div>
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
                                                                                value={delQty.find((a) => a.id == job.id) === undefined
                                                                                    ? null : delQty.find((a) => a.id == job.id).qty }
                                                                                placeholder="input required"
                                                                                onChange={(e) => setQty(e.target.value)}
                                                                            />
                                                                            <button
                                                                                className={`outline ${delQty.find((a) => a.id == job.id) === undefined ? "bg-[#544B76]" : "bg-blue-800"} text-white hover:bg-blue-700`}
                                                                                name={job.id}
                                                                                onClick={(e) => submitDel(e.target)}
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
