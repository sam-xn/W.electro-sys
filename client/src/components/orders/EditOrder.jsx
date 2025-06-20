import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import OrderService from '/src/components/http/order.service';

import Error from '/src/components/Error';

export default function EditOrder() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 

    const navigate = useNavigate();
    const params = useParams();

    //const [status, setStatus] = useState("open");
    const [order, setOrder] = useState([]);
    const [newPoNum, setNewPoNum] = useState("");

    useEffect(() => {
        OrderService.get(params.id)
            .then((response) => {
                setOrder(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);


    function saveOrder() {

        if (newPoNum === "") {
            navigate(`/orders/${params.id}`);
            return;
        }

        OrderService.update(params?.id, {po_num: newPoNum})
            .then((response) => {
                navigate(`/orders/${params.id}`);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const label_classname = "font-bold text-md text-[#544B76] pl-4 pb-1 pt-2";
    const input_classname = "grow focus:outline-none text-center border-b border-slate-500 pb-1 pt-2 col-span-3";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className="mb-8"><Sidebar /></div>
                <div className="col-span-5"> 
                    <div className="grid">
                        {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></>}

                        <div className="place-self-center w-3/4 mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                            <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                Edit Order
                            </div>

                            <div className="bg-white flex gap-4 m-4 pl-8 py-4 max-w-full border border-slate-500">
                                <div className={label_classname}> Customer: </div>
                                <div className="grow mr-8 border-b border-slate-500 text-center">
                                    {order?.customer}
                                </div>
                            </div>

                            <div className="bg-white flex gap-2 m-4 px-8 pt-4 pb-8 max-w-full border border-slate-500">
                                <div className={label_classname}> PO #:</div>
                                <input className={input_classname}
                                    placeholder={order?.po_num}
                                    value={newPoNum}
                                    onChange={(e) => setNewPoNum(e.target.value)}
                                />
                            </div>

                            <div className="pt-8 mx-8 grid grid-cols-2 gap-4 place-items-center">
                                <button
                                    className="text-white mb-4 mx-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-red-800"
                                    onClick={() => navigate(`/orders`)}
                                >
                                    Discard
                                </button>
                                <button
                                    className="text-white mb-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-blue-800"
                                    onClick={saveOrder}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
