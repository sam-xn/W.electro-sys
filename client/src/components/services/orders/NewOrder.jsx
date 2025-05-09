import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import OrderService from "./order.service";

function NewOrder() {
    const navigate = useNavigate();
    const [poNum, setPoNum] = useState("");
    const [customer, setCustomer] = useState("");
    const [status, setStatus] = useState("open");
    const [submitted, setSubmitted] = useState(false);

    const saveOrder = () => {
        const data = { poNum, customer, status };
        OrderService.create(data)
            .then((response) => {
                console.log(response.data);
                setSubmitted(true);
                navigate(`/orders/${response.data[0]}`);
            })
            .catch((e) => {
                console.log(e);
            });

    };
    const input_classname = "w-sm mx-8 mb-2 bg-white py-1.5 px-3 rounded-sm shadow-sm ring-1 ring-slate-500";

    return (
        <>
            <div className="max-w-lg mt-4 mx-8 p-8 bg-[#eff1fc] rounded shadow border border-slate-500">
                <h4 className="font-bold text-xl border-b border-slate-500 text-slate-500 pb-4 mb-4">New PO</h4>

                <div className="mb-2">
                    <label className="block mb-1 font-medium mx-8 text-slate-500">Customer</label>
                    <input
                        type="text"
                        className={input_classname}
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                    />
                    </div>
                    
                <div className="mb-2">
                    <label className="block mb-1 font-medium mx-8 text-slate-500">PO Number</label>
                    <input
                        type="text"
                        className={ input_classname }
                        value={poNum}
                        onChange={(e) => setPoNum(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label className="block mb-1 font-medium mx-8 text-slate-500">Status</label>
                    <input
                        type="text"
                        className={input_classname}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>

                <button
                    className="text-white mx-8 py-1 rounded my-4 w-sm bg-slate-500"
                    onClick={saveOrder}
                >
                    Submit
                </button>
            </div>
        </>
    );
}

export default NewOrder;