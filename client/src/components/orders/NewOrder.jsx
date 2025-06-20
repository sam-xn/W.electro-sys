import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import OrderService from '/src/components/http/order.service';
import CustomerService from '/src/components/http/customer.service';

import Error from '/src/components/Error';

function NewOrder() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 

    const navigate = useNavigate();
    //const params = useParams();

    //const [status, setStatus] = useState("open");
    const [poNum, setPoNum] = useState("");

    const [customer, setCustomer] = useState("select");
    const [customerList, setCustomerList] = useState([]);

    const [newCompany, setNewCompany] = useState("");
    const [newContactName, setNewContactName] = useState("");
    const [newContactEmail, setNewContactEmail] = useState("");
    const [newContactPhone, setNewContactPhone] = useState("");

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

        if (customer === "select") {
            setErrorMessage("Please select an existing customer or select New Customer to create a new contact.");
            setError(true);
            return;
        }
        else if (customer === "new" && (newCompany === "" || newContactName === "" || (newContactEmail === "" && newContactPhone === ""))) {
            setErrorMessage("Please enter Contact Info.");
            setError(true);
            return;
        }
        else if (poNum === "") {
            setErrorMessage("Please enter a PO number to continue.");
            setError(true);
            return;
        }

        const newPo_data = { po_num: poNum, customer: customer, status: "open" };

        if (customer == "new") {
            CustomerService.create({ company: newCompany, name: newContactName, email: newContactEmail, phone: newContactPhone })
                .catch((e) => {
                    console.log(e);
                });
            //ContactService.create({ newContactName, newContactEmail, newCompany })
            //    .catch((e) => {
            //        console.log(e);
            //    });

            newPo_data.customer = newCompany;
        }

        OrderService.create(newPo_data)
            .then((response) => {
                navigate(`/orders/${response.data.id}`);
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
                                New Order
                            </div>

                            <div className="bg-white flex gap-4 m-4 pl-8 py-4 max-w-full border border-slate-500">
                                <div className={label_classname}> Customer: </div>
                                <select
                                    className="grow mr-8 border-b border-slate-500 text-center "
                                    defaultValue="select"
                                    onChange={(e) => setCustomer(e.target.value)}
                                >
                                    <option value="select"> {"< select customer >"} </option>
                                    <option value="new"> New Customer </option>
                                    {customerList.map((company, index) =>
                                        <option value={company}> {company} </option>
                                    )}
                                </select>
                            </div>

                            {customer == "new" ?
                                <div className="bg-white m-4 pl-8 py-4 max-w-full border border-slate-500">
                                    <div className="mt-6 mr-8 col-span-4">
                                        <div className="flex gap-4">
                                            <div className={label_classname}> Company: </div>
                                            <input className={input_classname}
                                                type="text"
                                                value={newCompany}
                                                onChange={(e) => setNewCompany(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className={label_classname}> Contact Name: </div>
                                            <input className={input_classname}
                                                type="text"
                                                value={newContactName}
                                                onChange={(e) => setNewContactName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className={label_classname}> Contact Email: </div>
                                            <input className={input_classname}
                                                type="text"
                                                value={newContactEmail}
                                                onChange={(e) => setNewContactEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className={label_classname}> Contact Phone: </div>
                                            <input className={input_classname}
                                                type="text"
                                                value={newContactPhone}
                                                onChange={(e) => setNewContactPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-4 mr-8 text-center text-sm text-slate-600">
                                            <i>* please confirm spelling before submitting.</i>
                                        </div>
                                    </div>
                                </div>
                            : <></>}

                            {customer == "select"
                                ? <></>
                                : <>
                                    <div className="bg-white flex gap-2 m-4 px-8 pt-4 pb-8 max-w-full border border-slate-500">
                                        <div className={label_classname}> PO #:</div>
                                        <input className={input_classname}
                                            type="text"
                                            placeholder="input required"
                                            value={poNum}

                                            onChange={(e) => setPoNum(e.target.value)}
                                        />
                                    </div>
                                </>
                            }

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

export default NewOrder;