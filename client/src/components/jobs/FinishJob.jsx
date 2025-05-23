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
    
    const [initial, setInitial] = useState("");
    const [notes, setNotes] = useState("");
    const [rack, setRack] = useState("");
    const [diff_level, setDiff_level] = useState("");

    const [submitted, setSubmitted] = useState(false);

    function saveJob() {
        if (initial === "") {
            setError(true);
            setErrorMessage("Please enter operator's initials to submit finished Job. ");
            return;
        }

        const updatedInfo = { operator_initial: initial, operator_notes: notes, rack_type: rack, diff_level: diff_level };

        JobService.updateTag(params.id, updatedInfo)
            .then((response) => {
                //navigate(`/orders/${response.data.po_id}`) 
                //console.log(response.data)
                setSubmitted(true);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    function previousPage() {
        if (params.poId) navigate(`/order/${params.poId}`);
        else navigate(`/jobs`);
    }

    const label_classname = "font-bold text-md text-[#544B76] border-b border-slate-500 pl-4 pb-1 pt-2 ml-8 my-2";
    const input_classname = "col-span-2 focus:outline-none border-b border-slate-500 pl-16 pb-1 pt-2 mr-8 my-2";
    const button_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm text-white hover:text-[#544B76] shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] hover:bg-[#DEE1F4] rounded-md";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className=""><Sidebar /></div>
                <div className="col-span-5"> 
                    {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></>}

                    {submitted
                        ? <>
                            <div className="max-w-5/7 mx-4 py-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">
                                <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                    For Operator
                                </div>
                                <div className="my-8 py-8 text--[#544B76]"> Submitted. Thanks! </div>
                                <Link
                                    className={button_classname}
                                    to={`/jobs/${params.id}`}
                                >
                                    <p> {" <- Return to Job " } </p>
                                </Link>
                            </div>
                        </>
                        : <>
                        <div className="max-w-5/7 mx-4 pt-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                            <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                For Operator
                            </div>
                            {/*<div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>*/}


                            <div className="bg-white grid grid-cols-3 gap-0 place-content-start mx-4 mt-8 pb-8 max-w-full border border-slate-500">

                                <div className="col-span-3 mb-4"></div>

                                <div className={label_classname}> Initial: </div>
                                <input className={input_classname}
                                    type="text"
                                    value={initial}
                                    onChange={(e) => setInitial(e.target.value)}
                                />

                                <div className={label_classname}>  Notes: </div>
                                <input className={input_classname}
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />


                                <div className="my-2 col-span-3 flex justify-between mx-8 mt-8 border-b border-slate-500">
                                    <div className="text-[#544B76] font-bold mx-4 my-2 pr-8"> Rack Type: </div>
                                    <input className="mb-2"
                                        type="radio"
                                        name="rack"
                                        value="A"
                                        onChange={(e) => setRack(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> A </label>
                                    <input className="mb-2"
                                        type="radio"
                                        name="rack"
                                        value="B"
                                        onChange={(e) => setRack(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> B </label>
                                    <input className="mb-2"
                                        type="radio"
                                        name="rack"
                                        value="C"
                                        onChange={(e) => setRack(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> C </label>
                                    <input className="mb-2"
                                        type="radio"
                                        name="rack"
                                        value="D"
                                        onChange={(e) => setRack(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> D </label>
                                </div>


                                <div className="my-2 col-span-3 flex justify-between mx-8 border-b border-slate-500">
                                    <div className="text-[#544B76] font-bold mx-4 mb-2 my-2"> Difficulty Level: </div>
                                    <input className="mb-2"
                                        type="radio"
                                        name="diff_level"
                                        value="1"
                                        onChange={(e) => setDiff_level(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> 1 </label>
                                    <input className="mb-2"
                                        type="radio"
                                        name="diff_level"
                                        value="2"
                                        onChange={(e) => setDiff_level(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> 2 </label>
                                    <input className="mb-2"
                                        type="radio"
                                        name="diff_level"
                                        value="3"
                                        onChange={(e) => setDiff_level(e.target.value)}
                                    />
                                    <label className="text-md mr-8"> 3 </label>
                                    <input className="mb-2"
                                        type="radio"
                                        name="diff_level"
                                        value="4"
                                        onChange={(e) => setDiff_level(e).target.value}
                                    />
                                    <label className="text-md mr-8"> 4 </label>
                                </div>
                            </div>

                            <div className="flex place-content-center gap-4 mt-4 mb-8">
                                <div></div>
                                <Link
                                    className="text-center text-white py-2 my-2 rounded w-sm bg-[#544B76] outline  hover:bg-red-800"
                                    onClick={previousPage}
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

                        </div>
                    </>}
                </div>
            </div>
        </>
    );
}

