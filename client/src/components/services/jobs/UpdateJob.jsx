import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import JobService from "./job.service";

export default function UpdateJob() {

    const navigate = useNavigate();
    const params = useParams();

    //const form, setForm = useState([]);

    const [tag, setTag] = useState([]);
    const [submitted, setSubmitted] = useState();

    useEffect(() => {
        if (params.id)
            JobService.get(params.id)
                .then((response) => {
                    setTag(response.data[0]);
                    console.log(response.data[0])
                })
                .catch((e) => {
                    console.log(e);
                });
        else console.log("new job");
    }, []);
    console.log(tag)

    function setValues() {

    }
    function saveJob() {

        // params.id ? update : create

        //JobService.create(tag)
        //    .then((response) => {
        //        console.log(response.data);
        //        setSubmitted(true);
        //        navigate(`/orders/${response.data[0]}`);
        //    })
        //    .catch((e) => {
        //        console.log(e);
        //    });
    };



    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2";
    const input_classname = "focus:outline-none border-b pl-16 pb-1 pt-2";

    return (
        <>
            <div className="max-w-3/4 mx-4 pt-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    For Operator
                </div>
                <div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>


                <div className="bg-white flex gap-0 place-content-center mx-4 mt-8 pt-4 pb-8 max-w-full border border-slate-500">
                    <div className="ml-8 w-full">
                        <div className={label_classname}>
                            Initial:
                        </div>
                        <div className={label_classname}>
                            Notes:
                        </div>
                        <div className={label_classname}>
                            Rack Type:
                        </div>
                        <div className={label_classname}>
                            Difficulty Level:
                        </div>
                    </div>
                    <div className="mr-8 grid grid-cols-1 w-full">
                        <input className={input_classname}
                            type="text"
                            value={tag.operator_initial}
                            placeholder="- input -"
                            onChange={(e) => setValues(e.target.value)}
                        />
                        <input className={input_classname}
                            type="text"
                            value={tag.operator_notes}
                            placeholder="- input -"
                            onChange={(e) => setValues(e.target.value)}
                        />
                        <input className={input_classname}
                            type="text"
                            value={tag.diff_level}
                            placeholder="- input -"
                            onChange={(e) => setValues(e.target.value)}
                        />
                        <input className={input_classname}
                            type="text"
                            value={tag.rack_type}
                            placeholder="- input -"
                            onChange={(e) => setValues(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid place-content-center ">
                    <div></div>
                    <button
                        className="text-white py-1 rounded my-8 w-sm bg-[#544B76] outline"
                        onClick={saveJob}
                    >
                        Submit Finished Job
                    </button>
                    <div></div>
                </div>

            </div>
        </>
    );
}

