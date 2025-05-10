import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import OrderService from "../orders/order.service";
export default function NewReceipt() {

    const navigate = useNavigate();
    const params = useParams();

    console.log("params:" + params.id)

    const [po, setPo] = useState({});
    const [submitted, setSubmitted] = useState();

    useEffect(() => {
            OrderService.get(params.id)
                .then((response) => {
                    setPo(response.data);
                    console.log(response.data)
                })
                .catch((e) => {
                    console.log(e);
                });
    }, []);
    //console.log(po)

    function setValues() {

    }
    function saveReceipt() {

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
        //navigate(`/receipts/${new_receipt_id}`);
    };

    function discardReceipt() {
        navigate(`/receipts`);
    }


    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2";
    const input_classname = "focus:outline-none border-b pl-16 pb-1 pt-2";

    return (
        <>
            <div className="max-w-lg mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    New Receipt
                </div>

                <br></br>
                <br></br>
                    - Select from list of jobs to add to DS -
                <br></br>
                <br></br>
                {/*<div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>*/}

                {/*<div className="bg-white grid grid-cols-2 m-4 px-8 py-4 max-w-full border border-slate-500">*/}

                {/*    <div className="text-[#544B76] font-bold ml-4 mb-2"> Status </div>*/}
                {/*    <div></div>*/}
                {/*    <div className="ml-8">*/}
                {/*        <input className=""*/}
                {/*            type="radio"*/}
                {/*            name="status"*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <label className="text-md px-2"> Incoming </label>*/}
                {/*    </div>*/}
                {/*    <div className="">*/}
                {/*        <input className=""*/}
                {/*            type="radio"*/}
                {/*            name="status"*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <label className="text-md px-2"> Received </label>*/}
                {/*    </div>*/}

                {/*</div>*/}

                {/*<div className="bg-white grid grid-cols-4 place-content-center mx-4 mb-4 pt-4 pb-8 max-w-full border border-slate-500">*/}
                {/*    <div className="ml-8">*/}
                {/*        <div className={label_classname}>*/}
                {/*            Date:*/}
                {/*        </div>*/}
                {/*        <div className={label_classname}>*/}
                {/*            Customer:*/}
                {/*        </div>*/}
                {/*        <div className={label_classname}>*/}
                {/*            PO#:*/}
                {/*        </div>*/}
                {/*        <div className={label_classname + " mt-12"}>*/}
                {/*            Qty:*/}
                {/*        </div>*/}
                {/*        <div className={label_classname}>*/}
                {/*            Process:*/}
                {/*        </div>*/}
                {/*        <div className={label_classname+" mt-12"}>*/}
                {/*            Remarks:*/}
                {/*        </div>*/}
                {/*        <div className={label_classname}>*/}
                {/*            Initial:*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="col-span-3">*/}
                {/*        <input className={input_classname}*/}
                {/*            disabled*/}
                {/*            type="text" */}
                {/*            value={new Date().toDateString()}*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <input className={input_classname}*/}
                {/*            disabled*/}
                {/*            type="text"*/}
                {/*            value={po.customer}*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <input className={input_classname}*/}
                {/*            disabled*/}
                {/*            type="text"*/}
                {/*            value={po.po_num}*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <input className={input_classname + " mt-12"}*/}
                {/*            type="text"*/}
                {/*            placeholder="input required"*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <input className={input_classname}*/}
                {/*            type="text"*/}
                {/*            placeholder="input required"*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <input className={input_classname+" mt-12"}*/}
                {/*            type="text"*/}
                {/*            placeholder=""*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*        <input className={input_classname}*/}
                {/*            type="text"*/}
                {/*            placeholder="input required"*/}
                {/*            onChange={(e) => setValues(e.target.value)}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}

                <button
                    className="text-white my-2 mx-8 py-1 rounded w-sm bg-[#544B76] outline"
                    onClick={saveReceipt}
                >
                    Create
                </button>
                <button
                    className="text-white mb-4 mx-8 py-1 rounded w-sm bg-[#544B76] outline"
                    onClick={discardReceipt}
                >
                    Discard
                </button>
            </div>
        </>
    );
}
