import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';
import JobService from '/src/components/http/job.service';

import Error from '/src/components/Error';

export default function FinishJob() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 

    const navigate = useNavigate();
    const params = useParams();

    const [submitted, setSubmitted] = useState(false);

    const [job, setJob] = useState([]);
    useEffect(() => {
        JobService.getJob(params.id)
            .then(response => {
                setJob(response.data[0]);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [submitted]);
    
    const [quality, setQuality] = useState("");
    const [initial, setInitial] = useState("");
    const [notes, setNotes] = useState("");
    const [rack, setRack] = useState("");
    const [diff_level, setDiff_level] = useState("");
    const [numPcsRack, setNumPcsRack] = useState("");


    function saveJob() {
        if (initial === "") {
            setError(true);
            setErrorMessage("Please enter operator's initials to submit finished Job. ");
            return;
        }

        const updatedInfo = { operator_initial: initial, operator_notes: notes, rack_type: rack, diff_level: diff_level, quality: quality };

        JobService.updateTag(params.id, updatedInfo)
            .then((response) => {
                setSubmitted(true);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const label_classname = "font-bold text-md text-[#544B76] border-b border-slate-500 pl-4 pb-1 pt-2 ml-8 my-2";
    const input_classname = "col-span-2 focus:outline-none border-b border-slate-500 pl-16 pb-1 pt-2 mr-8 my-2";
    const button_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm text-white hover:text-[#544B76] shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] hover:bg-[#DEE1F4] rounded-md";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className="mb-8"><Sidebar /></div>
                <div className="col-span-5"> 
                    {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></>}

                    {/*{submitted*/}
                    {/*    ? <>*/}
                    {/*        <div className="mx-4 py-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">*/}
                    {/*            <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">*/}
                    {/*                For Operator*/}
                    {/*            </div>*/}
                    {/*            <div className="my-8 py-8 ml-12 text--[#544B76] text-lg"> Submitted. Thanks! </div>*/}
                    {/*            <Link*/}
                    {/*                className={button_classname}*/}
                    {/*                to={`/jobs`}*/}
                    {/*            >*/}
                    {/*                <p> {" <- Return to Jobs " } </p>*/}
                    {/*            </Link>*/}
                    {/*        </div>*/}
                    {/*    </>*/}
                    {/*    : <>*/}
                            <div className="mx-4 pt-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">
                                <div className="flex gap-8">
                                    <div className={"bg-white max-w-full mr-2 p-8 mb-8 rounded shadow border border-slate-500"}>
                                        <div className="flex place-content-between border-b border-slate-500 pb-1">
                                            <div className="text-sm pt-1 font-semibold">{`WE-${job.id}`}</div>
                                            <div className="text-sm pt-1 font-semibold">{`${job.status}`}</div>
                                        </div>

                                        {/*<div className="mt-4 mx-4 flex gap-4 place-content-between font-semibold">*/}
                                            <div className="mt-4 font-semibold">{`${job.order?.customer}`}</div>
                                            <div className="font-semibold">{`PO # ${job.order?.po_num}`}</div>
                                        {/*</div>*/}

                                        <div className="grid grid-cols-1">
                                            <div className="py-4">{` ${new Date(job._timestamp).toDateString()}`}</div>
                                            <div className="flex gap-2">Qty: <div className="font-semibold">{job.qty}</div></div>
                                            <div className="font-semibold">{job.process}</div>
                                            <div className="pt-4 text-sm text-red-700">{job.remarks ? `${job.remarks}` : ""}</div>

                                            {job.status !== "incoming" && job.status !== "received"
                                                ? <>
                                                    <div className="mt-4 pt-4 pb-1 flex gap-4 border-t border-slate-500"> Operator: <div className="font-semibold text-blue-700">{job.tag?.operator_initial}</div></div>
                                                    <div className="flex gap-4 items-center">
                                                        {job.tag?.rack_type ? <> Rack Type: <div className="font-semibold text-blue-700 pr-6 border-r border-slate-500">{job.tag?.rack_type} </div> </> : <></>}
                                                        {job.tag?.diff_level ? <> Difficulty: <div className="font-semibold text-blue-700">{job.tag?.diff_level} </div> </> : <></>}
                                                    </div>
                                                    {job.tag?.operator_notes ? <div className="pt-1 font-semibold text-blue-700">{`-- ${job.tag?.operator_notes}`}</div> : <></>}
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

                                    </div>
                                    <div className="border-l pl-8 mb-8">
                                        <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                            For Operator's Use
                                        </div>

                                        {submitted
                                            ? <>
                                                <div className="my-8 py-8 ml-12 text--[#544B76] text-lg"> Submitted. Thanks! </div>
                                                <Link
                                                    className={button_classname}
                                                    to={`/jobs`}
                                                >
                                                    <p> {" <- Return to Jobs "} </p>
                                                </Link>
                                            </>
                                            : <>

                                        <div className="bg-white grid grid-cols-4 mx-4 mt-8 pb-8 border border-slate-500">

                                            <div className="my-2 col-span-4 flex justify-between mx-8 mt-8 pb-2">
                                                {/*<div className="text-[#544B76] font-bold mx-4 my-2 pr-8"> Rack Type: </div>*/}
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="QP"
                                                        
                                                    /> QP
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Box"
                                                    /> Box
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Rcl"
                                                    /> Rcl
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Fcl"
                                                    /> Fcl
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Scl"
                                                    /> Scl
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Blk"
                                                    /> Blk
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Dk"
                                                    /> Dk
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Dd"
                                                    /> Dd
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setRack(e.target.value)}
                                                        type="radio"
                                                        name="rack"
                                                        value="Other"
                                                    /> Other
                                                </div>
                                            </div>

                                            <div className="my-2 col-span-2 flex justify-between mx-8 mt-8 pb-2">
                                                {/*<div className="text-[#544B76] font-bold mx-4 my-2 pr-8"> Rack Type: </div>*/}
                                                Diffilculty Level: 
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setDiff_level(e.target.value)}
                                                        type="radio"
                                                        name="diff_level"
                                                        value="1"
                                                    /> 1
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setDiff_level(e.target.value)}
                                                        type="radio"
                                                        name="diff_level"
                                                        value="2"
                                                    /> 2
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setDiff_level(e.target.value)}
                                                        type="radio"
                                                        name="diff_level"
                                                        value="3"
                                                    /> 3
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setDiff_level(e.target.value)}
                                                        type="radio"
                                                        name="diff_level"
                                                        value="4"
                                                    /> 4
                                                </div>
                                                <div className="flex gap-1 text-md">
                                                    <input onChange={(e) => setDiff_level(e.target.value)}
                                                        type="radio"
                                                        name="diff_level"
                                                        value="5"
                                                    /> 5
                                                </div>
                                            </div>

                                            <div className="my-2 col-span-2 flex gap-2 mt-8 pb-2">
                                                # of Pcs/Rack: 
                                                <input className="focus:outline-none border-b border-slate-500 pl-16 mx-8"
                                                    type="text"
                                                    value={numPcsRack}
                                                    onChange={(e) => setNumPcsRack(e.target.value)}
                                                />
                                            </div>

                                            <div className="mx-8 col-span-4 flex gap-2 mt-8 pb-2">
                                                Space in Tank & Remarks: 
                                                <input className="grow focus:outline-none border-b border-slate-500 pl-16 ml-8"
                                                    type="text"
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                />
                                            </div>


                                            <div className="my-2 col-span-2 flex justify-between mx-8 mt-8 pb-2">
                                                Quality:
                                                <input className="grow focus:outline-none border-b border-slate-500 pl-16 ml-8"
                                                    type="text"
                                                    value={quality}
                                                    onChange={(e) => setQuality(e.target.value)}
                                                />
                                            </div>

                                            <div className="my-2 col-span-2 flex justify-between mx-8 mt-8 pb-2">
                                                Initial:
                                                <input className="grow focus:outline-none border-b border-slate-500 pl-16 ml-8"
                                                    type="text"
                                                    value={initial}
                                                    onChange={(e) => setInitial(e.target.value)}
                                                />
                                            </div>

                                        </div>

                                        <div className="flex place-content-center gap-4 mt-4 ">
                                            <div></div>
                                            <Link
                                                className="text-center text-white py-2 my-2 rounded w-sm bg-[#544B76] outline  hover:bg-red-800"
                                                to={`/jobs`}
                                            >
                                                Discard Updates
                                            </Link>
                                            <Link
                                                className="text-center text-white py-2 my-2 rounded w-sm bg-[#544B76] outline  hover:bg-blue-800"
                                                onClick={saveJob}
                                            >
                                                Submit Finished Job
                                            </Link>

                                            <div></div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </>
    );
}

