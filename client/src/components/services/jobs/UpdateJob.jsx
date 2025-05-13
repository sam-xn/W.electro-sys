import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import JobService from "./job.service";

export default function UpdateJob() {

    const navigate = useNavigate();
    const params = useParams();
    console.log(params)
    const [initial, setInitial] = useState("");
    const [notes, setNotes] = useState("");
    const [rack, setRack] = useState("");
    const [diff_level, setDiff_level] = useState("");

    const [submitted, setSubmitted] = useState(false);

    function saveJob() {
        JobService.update(params.id, { initial, notes, rack, diff_level })
            .then((response) => {
                navigate(`/orders/${params.poId}`)
            })
            .catch((e) => {
                console.log(e);
            });
    };



    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2 ml-8";
    const input_classname = "col-span-2 focus:outline-none border-b pl-16 pb-1 pt-2 mr-8";

    return (
        <>
            <div className="max-w-4/7 mx-4 pt-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    For Operator
                </div>
                <div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>


                <div className="bg-white grid grid-cols-3 gap-0 place-content-start mx-4 mt-8 pt-4 pb-8 max-w-full border border-slate-500">
                    {/*<div className="ml-8">*/}
                        <div className={label_classname}>
                            Initial:
                        </div>
                        <input className={input_classname}
                            type="text"
                            value={initial}
                            placeholder="- input required -"
                            onChange={(e) => setInitial(e.target.value)}
                        />

                        <div className={label_classname}>
                            Notes:
                        </div>
                        <input className={input_classname}
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <div className={label_classname}>
                            Rack Type:
                        </div>
                        <input className={input_classname}
                            type="text"
                            value={rack}
                            placeholder="change to radio buttons"
                            onChange={(e) => setRack(e.target.value)}
                        />

                        <div className={label_classname}>
                            Difficulty Level:
                        </div>
                        <input className={input_classname}
                            type="text"
                            value={diff_level}
                            placeholder="change to radio buttons"
                            onChange={(e) => setDiff_level(e.target.value)}
                        />

                </div>

                <div className="grid place-content-center my-8">
                    <div></div>
                    <button
                        className="text-white py-1 my-2 rounded w-sm bg-[#544B76] outline"
                        onClick={saveJob}
                    >
                        Submit Finished Job
                    </button>
                    <button
                        className="text-white py-1 my-2 rounded w-sm bg-[#544B76] outline"
                        onClick={() => navigate(`/orders/${params.poId}`)}
                    >
                        Discard Updates
                    </button>
                    <div></div>
                </div>

            </div>
        </>
    );
}

