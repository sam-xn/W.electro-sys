import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";

import OrderService from "./order.service";
import JobService from "../jobs/job.service";
import ReceiptService from "../receipts/receipt.service";

export default function Order() {
    const params = useParams();
    const [po, setPo] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        OrderService.get(params.id)
            .then((response) => {
                setPo(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        JobService.getPO(params.id)
            .then((response) => {
                setJobs(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        ReceiptService.getPO(params.id)
            .then((response) => {
                ReceiptService.getPOList(response.data.map((rId) => rId.id))
                    .then((response) => {
                        let d = response.data; 
                        let cr, pr;
                        let r = [];

                        for (let i = 0; i < d.length; i++) {

                            cr = d[i];

                            if (i == 0) {
                                r.push({
                                    id: cr.id,
                                    _timestamp: cr._timestamp,
                                    notes: cr.notes,
                                    deliverables: [{
                                        dId: cr.dId,
                                        jobId: cr.jobId,
                                        partial: cr.partial,
                                        num_pcs: cr.num_pcs,
                                        process: cr.process,
                                        po_id: cr.po_id,
                                        po_num: cr.po_num
                                    }]
                                });
                                pr = cr;
                                continue;
                            }

                            if (cr.id != pr.id) {
                                r.push({
                                    id: cr.id,
                                    _timestamp: cr._timestamp,
                                    notes: cr.notes,
                                    deliverables: [{
                                        dId: cr.dId,
                                        jobId: cr.jobId,
                                        partial: cr.partial,
                                        num_pcs: cr.num_pcs,
                                        process: cr.process,
                                        po_id: cr.po_id,
                                        po_num: cr.po_num
                                    }]
                                });
                            }

                            else {
                                r[r.length-1].deliverables.push({
                                    dId: cr.dId,
                                    jobId: cr.jobId,
                                    partial: cr.partial,
                                    num_pcs: cr.num_pcs,
                                    process: cr.process,
                                    po_id: cr.po_id,
                                    po_num: cr.po_num
                                })
                            }

                            pr = cr;
                        }

                        r.forEach((rt) => {
                            rt.deliverables = rt.deliverables.sort((a,b) => a.po_id - b.po_id); 

                            d = [];
                            let cd, pd;
                            for (let i = 0; i < rt.deliverables.length; i++) {

                                cd = rt.deliverables[i];

                                if (i == 0) {
                                    d.push({
                                        po_id: cd.po_id,
                                        po_num: cd.po_num,
                                        deliverables: [{
                                            dId: cd.dId,
                                            jobId: cd.jobId,
                                            partial: cd.partial,
                                            num_pcs: cd.num_pcs,
                                            process: cd.process
                                    }]});

                                    pd = cd; 
                                    continue;
                                }

                                if (cd.po_id != pd.po_id) {
                                    d.push({
                                        po_id: cd.po_id,
                                        po_num: cd.po_num,
                                        deliverables: [{
                                            dId: cd.dId,
                                            jobId: cd.jobId,
                                            partial: cd.partial,
                                            num_pcs: cd.num_pcs,
                                            process: cd.process
                                    }]});
                                }

                                else {
                                    d[d.length-1].deliverables.push({
                                        dId: cd.dId,
                                        jobId: cd.jobId,
                                        partial: cd.partial,
                                        num_pcs: cd.num_pcs,
                                        process: cd.process
                                    });
                                }

                                pd = cd;
                            }
                            rt.deliverables = d;
                        });

                        setReceipts(r);
                        //console.log(r);
                    })
                    .catch ((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const div_classname = "max-w-full mx-4 p-8 rounded shadow border border-slate-500 text-slate-500";
    const button_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm font-bold shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-white hover:bg-[#DEE1F4] rounded-md";

    return (
        <>
            <div className={"bg-[#eff1fc] " + div_classname}>
                <div className="font-bold text-xl grid grid-cols-2 border-b border-slate-500 p-1">
                    <div> Purchase Order </div>
                    <div className="grid place-items-end px-12">{`| status: ${po.status}`}</div>
                </div>
                <div className="text-xl font-bold underline grid grid-cols-3 justify-between gap-2 py-2 px-8">
                    <div>{`PO # ${po.po_num}`}</div>
                    <div>{`${String(po.customer).toUpperCase()}`}</div>
                    <div>{`${new Date(po._timestamp).toDateString()}`}</div>
                </div>

                {po.notes ? 
                    <div className="px-8 pt-4 flex gap-4">
                        <div className="text-lg font-bold underline"> Notes: </div>
                        <div className="text-xl"> {`${po.notes}`} </div>
                    </div>
                : ""}

                <div className="grid grid-cols-4 justify-between gap-4 mx-4 my-8 pb-8 border-b border-slate-500">
                    {jobs.map((job, index) => 
                        <>
                            <div className={"bg-white "+div_classname} key={ [index,job.id] }>
                                <div className="flex place-content-between border-b border-slate-500">
                                    <div className="font-bold">{index + 1}</div>
                                    <div className="text-sm pt-1">{`status: ${job.status}`}</div>
                                </div>

                                <div className="grid grid-cols-1 my-4">
                                    <div className="py-4">{`Date: ${new Date(job._timestamp).toDateString()}`}</div>
                                    <div className="">{`Process: ${job.process}`}</div>
                                    <div className="">{`Qty: ${job.num_pcs}`}</div>
                                    <div className="py-4">{`Remarks: ${job.remarks}`}</div>
                                </div>
                                <div className="text-sm flex place-content-end">{`job # WE-${job.id}`}</div>

                                <div className="border-t border-slate-500">
                                    <div className="my-4">
                                        <Link className={button_classname} to={`/jobs/${job.id}`}>
                                            Update Job
                                        </Link>
                                    </div>   
                                    <div className="my-4">
                                        <Link className={button_classname} to={`/jobs/${job.id}`}>
                                            Print Tag
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="pt-2 pb-2 gap-4 grid grid-cols-4">
                    <Link className={button_classname} to={`/jobs/new`}>
                        Add Jobs
                    </Link>
                    <div></div>
                    <Link className={button_classname} to={`/`}>
                        View Contacts
                    </Link>

                    <Link className={button_classname} to={`/jobs/new`}>
                        Update Notes
                    </Link>
                </div>

            </div>

            <div className={"bg-[#eff1fc] my-8 " + div_classname}>
                <div className="font-bold text-xl border-b border-slate-500 p-1">
                    <div> Receipts </div>
                </div>

                <div className="grid grid-cols-2 justify-between mx-4 mt-4">
                    {receipts.map((receipt, index) =>
                        <>
                            <div className={"bg-white mb-8 grid grid-cols-1 place-content-between " + div_classname} key={[index, receipt.id]}>

                                <div>
                                   <div className="font-bold border-b border-slate-500">
                                       {`Date: ${new Date(receipt._timestamp).toDateString()}`}
                                    </div>

                                    <div className="pb-4">{`Delivery Slip # ${receipt.id}`}</div>

                                    <div className="pb-8 px-4">
                                        {receipts[index].deliverables.map((d, d_index) =>
                                            <>
                                                <div className="font-bold pt-4">
                                                    {`PO # ${d.po_num}`}
                                                </div>
                                                    
                                                {d.deliverables.map((deliverable, deliverable_index) =>
                                                    <>
                                                        <div className="flex gap-4">
                                                            <div>{`${d_index + 1}`}</div><div>|</div>
                                                            <div>{`Qty: ${deliverable.num_pcs}`}</div>
                                                            <div>{`${deliverable.process}`}</div>
                                                            <div className="">
                                                                <i>{deliverable.partial ? ' --- partial pickup - job # WE-'+deliverable.jobId : ''}</i>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-500 mt-4">
                                    <div className="my-4">
                                        <Link className={button_classname} to={`/receipts/${receipt.id}`}>
                                            Print Receipt
                                        </Link>
                                    </div>
                                    <div className="my-4">
                                        <Link className={button_classname} to={`/receipts/${receipt.id}`}>
                                            Update Receipt
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}