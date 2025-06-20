import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import JobService from '/src/components/http/job.service';
import OrderService from '/src/components/http/order.service';

import Error from '/src/components/Error';
export default function EditJob() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 

    const navigate = useNavigate();
    const params = useParams();

    const [po, setPo] = useState({});
    const [job, setJob] = useState({});

    const [newStatus, setNewStatus] = useState("");
    const [qty, setQty] = useState("");
    const [process, setProcess] = useState("");
    const [remarks, setRemarks] = useState("");
    const [initial, setInitial] = useState("");

    useEffect(() => {
        JobService.getJob(params.id)
            .then((response) => {
                setJob(response.data[0]);
                setNewStatus(response.data[0].status);
                OrderService.get(response.data[0].po_id)
                    .then(r => {
                        setPo(r.data); 
                    })
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function saveJob() {
        //if (initial === "") {
        //    setError(true);
        //    setErrorMessage("Please enter Initial to update Job. ");
        //    return;
        //}

        const updates = { author_initial: initial };
        if (qty !== "") updates.qty = qty;
        if (process !== "") updates.process = process
        if (remarks !== "") updates.remarks = remarks;
        if (newStatus !== "" && newStatus !== job?.status) updates.status = newStatus;

        console.log(updates)
        JobService.update(params.id, updates)
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
                <div className="mb-8"><Sidebar /></div>
                <div className="col-span-5"> 
                    <div className="grid place-items-center">
                        {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></> }

                        <div className="max-w-full mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                            <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                Edit Job
                            </div>

                            <div className="bg-white grid grid-cols-4 mx-4 mt-8 mb-4 py-8 max-w-full border border-slate-500">
                                <div className={label_classname}>  Date:  </div>
                                    <input className={input_classname}
                                        disabled
                                        type="text"
                                        value={new Date().toDateString()}
                                    />
                                <div className={label_classname}> Customer: </div>
                                    <input className={input_classname}
                                        disabled
                                        type="text"
                                        value={po.customer}
                                    />
                                <div className={label_classname}> PO#: </div>
                                    <input className={input_classname}
                                        disabled
                                        type="text"
                                        value={po.po_num}
                                    />
                                <div className={label_classname + " mt-12"}> Qty: </div>
                                    <input className={input_classname + " mt-12"}
                                        type="text"
                                        placeholder={job.qty}
                                        onChange={(e) => setQty(e.target.value)}
                                    />
                                <div className={label_classname}> Process: </div>
                                    <input className={input_classname}
                                        type="text"
                                        placeholder={job.process}
                                        onChange={(e) => setProcess(e.target.value)}
                                    />
                                <div className={label_classname+" mt-12"}> Remarks: </div>
                                    <input className={input_classname + " mt-12"}
                                        type="text"
                                        placeholder={job.remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                <div className={label_classname}>  Initial:  </div>
                                    <input className={input_classname}
                                        type="text"
                                        placeholder="input required"
                                        onChange={(e) => setInitial(e.target.value)}
                                    />
                            </div>

                            <div className="bg-white border border-slate-500 mx-4 mb-8 pb-4 pl-8 pt-2">
                                <div className="text-[#544B76] font-bold ml-4 mt-2"> Status: </div>
                                <div className="grid grid-cols-3 place-content-center mx-4 pl-8 my-1">
                                    <div>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="incoming"
                                            checked={newStatus === "incoming"}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        />
                                        <label className="text-md px-2"> incoming </label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="received"
                                            checked={newStatus === "received"}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        />
                                        <label className="text-md px-2"> received </label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="processed"
                                            checked={newStatus === "processed"}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        />
                                        <label className="text-md px-2"> processed </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 place-content-center mx-4 pl-8 my-1">
                                    
                                    <div>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="delivered"
                                            checked={newStatus === "delivered"}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        />
                                        <label className="text-md px-2"> delivered </label>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="delivered-partial"
                                            checked={newStatus === "delivered-partial"}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        />
                                        <label className="text-md px-2"> delivered-partial </label>
                                    </div>
                                </div>
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
                                    onClick={(e) => navigate(`/orders/${job.po_id}`)}
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
