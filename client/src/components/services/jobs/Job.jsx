import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';

import JobService from "./job.service";
export default function Job() {

    const navigate = useNavigate();
    const params = useParams();

    const [job, setJob] = useState([]);
    useEffect(() => {
        JobService.getJob(params.id)
            .then(response => {
                setJob(response.data[0]);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [params]);

    console.log(job)
    const button_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm font-bold shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] hover:bg-[#DEE1F4] rounded-md";

    return (
        <>
            <div className="max-w-3/4">
                <div className={"bg-[#eff1fc] mr-4 p-8 mb-8 rounded shadow border border-slate-500"}>
                    <div className={"bg-white max-w-full mr-4 p-8 rounded shadow border border-slate-500"}>
                        <div className="flex place-content-between">
                            <div className="text-sm pt-1 font-bold">{`WE-${job.id}`}</div>
                            <div className="text-sm pt-1 font-bold">{`${job.status}`}</div>
                        </div>

                        <div className="grid grid-cols-1 mt-4">
                            <div className="py-4">{`Date: ${new Date(job._timestamp).toDateString()}`}</div>
                            <div className="">{`Qty: ${job.qty}`}</div>
                            <div className="">{`Process: ${job.process}`}</div>
                            <div className="pt-4 text-sm text-red-700">{job.remarks ? `${job.remarks}` : ""}</div>
                            <div className="flex justify-self-end font-semibold">{`${job.order?.customer}`}</div>
                            <div className="flex justify-self-end font-semibold">{`PO # ${job.order?.po_num}`}</div>
                        </div>


                    </div>
                </div>

                <div className="my-4 ml-30 mr-60">
                    <Link className={button_classname} to={`print`}>
                        <p className="text-white">Print Tag</p>
                    </Link>
                </div>   
                <div className="my-4 ml-30 mr-60">
                    <Link className={button_classname} to={`update`}>
                        <p className="text-white">Finish Job</p>
                    </Link>
                </div>
                <div className="my-4 ml-30 mr-60">
                    <Link className={button_classname} to={`/orders/${job.po_id}`}>
                        <p className="text-white">Go To Order</p>
                    </Link>
                </div>
            </div>
        </>
    );
}
