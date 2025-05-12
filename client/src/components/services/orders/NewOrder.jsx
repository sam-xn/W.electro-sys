import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import OrderService from "./order.service";

function NewOrder() {

    const navigate = useNavigate();
    const params = useParams();

    const [status, setStatus] = useState("open");
    const [poNum, setPoNum] = useState("");
    const [customer, setCustomer] = useState("");

    function saveOrder() {

        const data = { poNum, customer, status };
        OrderService.create(data)
            .then((response) => {
                //setSubmitted(true);
                navigate(`/orders/${response.data[0]}`);
            })
            .catch((e) => {
                console.log(e);
            });
        setSubmitted(false);
    };


    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2";
    const input_classname = "focus:outline-none border-b pl-16 pb-1 pt-2";

    return (
        <>
            <div className="max-w-lg mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    New PO
                </div>
                <div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>

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
                            value="open"
                            defaultChecked
                            onChange={(e) => setStatus(e.target.value)}
                        />
                        <label className="text-md px-2"> Open </label>
                    </div>

                </div>

                <div className="bg-white grid grid-cols-4 place-content-center mx-4 mb-4 pt-4 pb-8 max-w-full border border-slate-500">
                    <div className="ml-8">
                        <div className={label_classname}>
                            Customer:
                        </div>
                        <div className={label_classname}>
                            PO#:
                        </div>
                    </div>
                    <div className="col-span-3">
                        <input className={input_classname}
                            type="text"
                            value={customer}
                            placeholder="input required"
                            onChange={(e) => setCustomer(e.target.value)}
                        />
                        <input className={input_classname}
                            type="text"
                            value={poNum}
                            placeholder="input required"
                            onChange={(e) => setPoNum(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        className="text-white mb-4 mx-8 py-1 rounded w-sm bg-[#544B76] outline"
                        onClick={saveOrder}
                    >
                        Submit
                    </button>
                    <button
                        className="text-white mb-4 mx-8 py-1 rounded w-sm bg-[#544B76] outline"
                        onClick={saveOrder}
                    >
                        Discard
                    </button>
                </div>
            </div>
        </>
    );
}

export default NewOrder;