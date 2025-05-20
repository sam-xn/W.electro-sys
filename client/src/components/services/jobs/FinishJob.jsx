import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import JobService from "./job.service";

import Error from '../../Error';

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
        if (initial === "" || rack === "" || diff_level === "") {
            setError(true);
            setErrorMessage("Please enter operator's initials to submit finished Job. ");
            return;
        }
        const updatedInfo = { initial, notes, rack, diff_level }

        JobService.update(params.id, updatedInfo)
            .then((response) => {
                //navigate(`/orders/${params.poId}`)
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

    return (
        <>
            {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></>}

            {submitted
                ? <> Submitted.Thanks!Button->Go home. </>
                : <>
                <div className="max-w-5/7 mx-4 pt-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                    <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                        For Operator
                    </div>
                    <div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>


                    <div className="bg-white grid grid-cols-3 gap-0 place-content-start mx-4 mt-8 pt-4 pb-8 max-w-full border border-slate-500">

                        <div className="my-2 col-span-3 flex justify-between mx-8  border-b border-slate-500">
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

                        <div className={label_classname}>
                            Notes:
                        </div>
                        <input className={input_classname}
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <div className={label_classname}>
                            Initial:
                        </div>
                        <input className={input_classname}
                            type="text"
                            value={initial}

                            onChange={(e) => setInitial(e.target.value)}
                        />

                            {/*<div className={label_classname}>*/}
                            {/*    Rack Type:*/}
                            {/*</div>*/}
                            {/*<input className={input_classname}*/}
                            {/*    type="text"*/}
                            {/*    value={rack}*/}
                            {/*    placeholder="change to radio buttons"*/}
                            {/*    onChange={(e) => setRack(e.target.value)}*/}
                            {/*/>*/}

                            {/*<div className={label_classname}>*/}
                            {/*    Difficulty Level:*/}
                            {/*</div>*/}
                            {/*<input className={input_classname}*/}
                            {/*    type="text"*/}
                            {/*    value={diff_level}*/}
                            {/*    placeholder="change to radio buttons"*/}
                            {/*    onChange={(e) => setDiff_level(e.target.value)}*/}
                            {/*/>*/}

                    </div>

                    <div className="flex place-content-center gap-4 mt-8 mb-12">
                        <div></div>
                        <button
                            className="text-white py-1 my-2 rounded w-sm bg-[#544B76] outline  hover:bg-red-800"
                            onClick={previousPage}
                        >
                            Discard Updates
                        </button>
                        <button
                            className="text-white py-1 my-2 rounded w-sm bg-[#544B76] outline  hover:bg-blue-800"
                            onClick={saveJob}
                        >
                            Submit Finished Job
                        </button>

                        <div></div>
                    </div>

                </div>
            </>}
        </>
    );
}

