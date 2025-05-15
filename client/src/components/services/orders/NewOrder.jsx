import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import OrderService from "./order.service";
import CustomerService from "../customers/customer.service";
import ContactService from "../customers/contact.service";

function NewOrder() {

    const navigate = useNavigate();
    //const params = useParams();

    const [status, setStatus] = useState("open");
    const [poNum, setPoNum] = useState("");

    const [customer, setCustomer] = useState("");
    const [customerList, setCustomerList] = useState([]);
    const [newCompany, setNewCompany] = useState("");
    const [newContactName, setNewContactName] = useState("");
    const [newContactEmail, setNewContactEmail] = useState("");

    useEffect(() => {
        CustomerService.getAll()
            .then((response) => {
                setCustomerList(response.data.map((customer) => customer.company));
            })
            .catch((e) => {
                console.log(e);
            });
    }, [customerList.length]);

    function saveOrder() {

        let po_customer = customer;

        if (customer == "new") {

            ContactService.create({ newContactName, newContactEmail, newCompany })
                .then((response) => {
                })
                .catch((e) => {
                    console.log(e);
                });

            CustomerService.create({ newCompany })
                .then((response) => {
                    //setSubmitted(true);
                    //navigate(`/orders/${response.data[0]}`);
                })
                .catch((e) => {
                    console.log(e);
                });

            po_customer = newCompany;
        }

        let po_data = { poNum, po_customer, status };
        OrderService.create(po_data)
            .then((response) => {
                //setSubmitted(true);
                navigate(`/orders/${response.data[0]}`);
            })
            .catch((e) => {
                console.log(e);
            });
        setSubmitted(false);
    }


    const label_classname = "font-bold text-md text-[#544B76] border-b pl-4 pb-1 pt-2";
    const input_classname = "focus:outline-none text-center border-b pb-1 pt-2 col-span-3";

    return (
        <>
            <div className="max-w-1/2 mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

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

                <div className="bg-white grid grid-cols-4 m-4 pl-8 py-4 max-w-full border border-slate-500">
                    <div className={label_classname}> Customer: </div>
                    <select
                        className="col-span-3 mr-8 border-b border-slate-500"
                        defaultValue="select"
                        onChange={(e) => setCustomer(e.target.value)}
                    >
                        <option value="select"> {"< select customer >"} </option>
                        <option value="new"> New Customer </option>
                        {customerList.map((company, index) =>
                            <option value={company}> {company} </option>
                        )}
                    </select>

                    {customer == "new"
                        ? (
                            <div className="mt-6 mr-8 col-span-4">
                                <div className="grid grid-cols-4">

                                    <div className={label_classname}> Company: </div>
                                    <input className={input_classname}
                                        type="text"
                                        value={newCompany}
                                        placeholder="input required"
                                        onChange={(e) => setNewCompany(e.target.value)}
                                    />

                                    <div className={label_classname}> Contact name: </div>
                                    <input className={input_classname}
                                        type="text"
                                        value={newContactName}
                                        placeholder="input required"
                                        onChange={(e) => setNewContactName(e.target.value)}
                                    />

                                    <div className={label_classname}> Contact email: </div>
                                    <input className={input_classname}
                                        type="text"
                                        value={newContactEmail}
                                        placeholder="input required"
                                        onChange={(e) => setNewContactEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mt-8 mr-8 text-center text-sm text-slate-600">
                                    <i>* Please check spelling before submitting.</i>
                                </div>
                            </div>
                        )
                        : <></>
                    }
                </div>

                <div className="bg-white grid grid-cols-4 m-4 px-8 pt-4 pb-8 max-w-full border border-slate-500">
                    <div className={label_classname}> PO #:</div>
                    <input className={input_classname}
                        type="text"
                        value={poNum}
                        placeholder="input required"
                        onChange={(e) => setPoNum(e.target.value)}
                    />
                </div>

                <div className="flex place-items-center gap-4 pt-4 mx-8">
                    <button
                        className="text-white mb-4 py-1 rounded w-sm bg-[#544B76] outline  hover:bg-red-800"
                        onClick={saveOrder}
                    >
                        Discard
                    </button>
                    <button
                        className="text-white mb-4 py-1 rounded w-sm bg-[#544B76] outline  hover:bg-blue-800"
                        onClick={saveOrder}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}

export default NewOrder;