import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import JobService from '/src/components/http/job.service';
import OrderService from '/src/components/http/order.service';

import Error from '/src/components/Error';
export default function NewJob() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 

    const navigate = useNavigate();
    const params = useParams();

    const [po, setPo] = useState({});
    const [status, setStatus] = useState("received");
    const [qty, setQty] = useState("");
    const [process, setProcess] = useState("");
    const [remarks, setRemarks] = useState("");
    const [initial, setInitial] = useState("");

    useEffect(() => {
        OrderService.get(params.id)
            .then((response) => {
                setPo(response.data);
                //setStatus(response.data.status);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function saveJob() {
        if (status==="" || process === "" || qty === "" || initial === "") {
            setError(true);
            setErrorMessage("Please enter Qty, Process, and Initial to submit a new Job. ");
            return;
        }

        const tag = { status: status, author_initial: initial, po_id: po.id, process: process, qty: qty, remarks: remarks };

        JobService.create(tag)
            .then(() => {
                navigate(`/orders/${po.id}`);
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2 ml-8";
    const input_classname = "col-span-3 text-center mr-8 pr-16 focus:outline-none border-b pl-16 pb-1 pt-2";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className=""><Sidebar /></div>
                <div className="col-span-5"> 
                    <div className="grid place-items-center">
                        {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></> }

                        <div className="max-w-full mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                            <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                New Job
                            </div>
                            <div className="mb-4 text-sm text-[#544B76]"> {/*- Edit info -*/} </div>

                            <div className="bg-white grid grid-cols-2 m-4 px-8 py-4 max-w-full border border-slate-500">

                                <div className="text-[#544B76] font-bold ml-4 mb-2"> Status </div>
                                <div></div>

                                <div className="ml-8">
                                    <input className=""
                                        type="radio"
                                        name="status"
                                        value="incoming"
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                    <label className="text-md px-2"> Incoming </label>
                                </div>
                                <div className="">
                                    <input className=""
                                        type="radio"
                                        name="status"
                                        value="received"
                                        defaultChecked
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                    <label className="text-md px-2"> Received </label>
                                </div>

                            </div>

                            <div className="bg-white grid grid-cols-4 mx-4 mb-4 pt-4 pb-8 max-w-full border border-slate-500">
                                <div className={label_classname}>  Date:  </div>
                                {/*<div className="col-span-3 place-self-stretch justify-content-center border">*/}
                                    <input className={input_classname}
                                        disabled
                                        type="text"
                                        value={new Date().toDateString()}
                                    />
                                {/*</div>*/}
                                <div className={label_classname}> Customer: </div>
                                {/*<div className="col-span-3">*/}
                                    <input className={input_classname}
                                        disabled
                                        type="text"
                                        value={po.customer}
                                    />
                                {/*</div>*/}
                                <div className={label_classname}> PO#: </div>
                                {/*<div className="col-span-3">*/}
                                    <input className={input_classname}
                                        disabled
                                        type="text"
                                        value={po.po_num}
                                    />
                                {/*</div>*/}
                                <div className={label_classname + " mt-12"}> Qty: </div>
                                {/*<div className="col-span-3">*/}
                                    <input className={input_classname + " mt-12"}
                                        type="text"
                                        placeholder="input required"
                                        onChange={(e) => setQty(e.target.value)}
                                    />
                                {/*</div>*/}
                                <div className={label_classname}> Process: </div>
                                {/*<div className="col-span-3">*/}
                                    <input className={input_classname}
                                        type="text"
                                        placeholder="input required"
                                        onChange={(e) => setProcess(e.target.value)}
                                    />
                                {/*</div>*/}
                                <div className={label_classname+" mt-12"}> Remarks: </div>
                                {/*<div className="col-span-3">*/}
                                    <input className={input_classname + " mt-12"}
                                        type="text"
                                        placeholder=""
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                {/*</div>*/}
                                <div className={label_classname}>  Initial:  </div>
                                {/*<div className="col-span-3">*/}
                                    <input className={input_classname}
                                        type="text"
                                        placeholder="input required"
                                        onChange={(e) => setInitial(e.target.value)}
                                    />
                                {/*</div>*/}
                            </div>

                            {/*<div className="pt-4">*/}
                            <div className="grid place-items-center">
                                <button
                                    className="text-white mb-4 mx-8 py-1 rounded w-sm bg-[#544B76] outline hover:bg-blue-800"
                                    onClick={saveJob}
                                    >
                                    Submit
                                </button>
                            </div>
                            <div className="grid place-items-center">
                                <button
                                    className="text-white mb-4 mx-8 py-1 rounded w-sm bg-[#544B76] outline hover:bg-red-800"
                                    onClick={(e) => navigate(`/orders/${params.id}`)}
                                    >
                                        Discard
                                </button>
                            </div>
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
