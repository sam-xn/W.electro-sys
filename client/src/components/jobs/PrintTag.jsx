import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import JobService from '/src/components/http/job.service';
import ContactService from '/src/components/http/contact.service';

export default function PrintTag() {

    const params = useParams();

    const [job, setJob] = useState([]);
    const [psLine2, setPsLine2] = useState(false);
    const [contact, setContact] = useState([]);

    useEffect(() => {
        JobService.getJob(params.id)
            .then(response => {

                const r = response.data[0];

                let dateStr = new Date(r._timestamp).toDateString().split(' ');
                const day = dateStr.splice(2, 1);
                dateStr[0] = day;
                dateStr.splice(1, 0, " - ");
                dateStr.splice(3, 0, " - ");

                r._timestamp = dateStr;

                let processStr = r.process;
                if (processStr.length > 28) {
                    let index = -1;
                    for (let i = 15; i < processStr.length; i++) {
                        if (processStr[i] !== " ") continue;
                        else { index = i + 1; break; }
                    }
                    let str_1 = processStr.substring(0, index);
                    let str_2 = processStr.substring(index, processStr.length);
                    r.process = [str_1, str_2];
                    setPsLine2(true);
                }

                JobService.update(params.id, { status: "received" })
                    .catch((e) => { console.log(e); });

                setJob(r);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        ContactService.searchCompany(job.order?.customer, "primary")
            .then(response => {
                setContact(response.data[0]);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [job]);

    return (
        <>
            <div className="rotate-270 translate-x-46 -translate-y-25 h-[528px] aspect-[calc(8.5/11)] text-sm pr-4 pl-4">
                <div className="font-bold text-center my-2"> WORK TAG </div>

                <div className="m-1 flex gap-2"> <p>Company:</p> <div className="grow border-b border-slate-500 text-center text-xl"> {job.order ? job.order.customer : ""} </div> </div>

                <div className="flex">
                    <div className="grow m-1 flex gap-2"> <p>Date:</p> <div className="grow border-b border-slate-500 text-center text-lg"> {job._timestamp} </div> </div>
                    <div className="grow m-1 flex gap-2"> <p>P.O.#:</p> <div className="grow border-b border-slate-500 text-center text-lg"> {job.order ? job.order.po_num : ""} </div> </div>
                </div>

                <div className="flex">
                    <div className="grow m-1 flex gap-2"> <p># of Pcs.:</p> <div className="grow border-b border-slate-500 text-center text-xl"> {job.qty} </div> </div>
                    <div className="grow m-1 flex gap-2"> <p>Initial:</p> <div className="grow border-b border-slate-500 text-center text-lg"> {job.tag ? job.tag.author_initial : ""} </div> </div>
                </div>

                <div className="flex">
                    <div className="grow m-1 flex gap-2"> <p className="min-w-1/5">Process & Instructions:</p> <div className="grow border-b border-slate-500 text-center text-xl"> {psLine2 ? job.process[0] : job.process} </div> </div>
                </div>
                {psLine2
                    ? <>
                        <div className="m-1 flex gap-2"> <div className="grow border-b border-slate-500 text-center text-xl"> {job.process[1]} </div> </div>
                    </> : <></>
                }
                <div className="mt-2 m-1 flex gap-2"> <p>Remarks:</p> <div className="grow border-b border-slate-500 text-center text-xl"> {job.remarks} </div> </div>

                <div className="flex">
                    <div className="grow m-1 flex gap-2"> <p>Contact:</p> <div className="grow border-b border-slate-500 text-center text-lg"> {contact?.name} </div> </div>
                    <div className="grow m-1 flex gap-2"> <p>Ph #:</p> <div className="grow border-b border-slate-500 text-center text-lg"> {contact?.phone} </div> </div>
                </div>


                <div className="mt-4 mx-1 border-b border-slate-500 text-center text-xl max-w-full"></div>

                <div className="text-center my-2"> For Operator's Use </div>

                <div className="m-2 flex">
                    <p className="w-full">QP</p>
                    <p className="w-full">Box</p>
                    <p className="w-full">Rcl</p>
                    <p className="w-full">Fcl</p>
                    <p className="w-full">Scl</p>
                    <p className="w-full">Blk</p>
                    <p className="w-full">Dk</p>
                    <p className="w-full">Dd</p>
                    <p className="w-full">Other</p>
                </div>

                <div className="flex">
                    <div className="m-1 flex gap-3 min-w-2/5">
                        <p>Difficulty Level:</p>
                        <p className="grow">1</p>
                        <p className="grow">2</p>
                        <p className="grow">3</p>
                        <p className="grow">4</p>
                        <p className="grow">5</p>
                    </div>
                    <div className="grow m-1 flex gap-2">
                        <p># of Pcs/Rack:</p>
                        <div className="grow border-b border-slate-500 text-center text-xl"> </div>
                    </div>
                </div>

                <div className="m-1 flex gap-2"> <p>Space in Tank & Remarks:</p> <div className="grow border-b border-slate-500 text-center text-xl"> </div> </div>
                <br></br>
                <div className="m-1 flex gap-2"> <div className="grow border-b border-slate-500 text-center text-xl"> </div> </div>

                <div className="flex">
                    <div className="grow m-1 flex gap-2"> <p>Quality:</p> <div className="grow border-b border-slate-500 text-center text-xl"> </div> </div>
                    <div className="grow m-1 flex gap-2"> <p>Initial:</p> <div className="grow border-b border-slate-500 text-center text-xl"> </div> </div>
                </div>

            </div>
        </>
    );
}

