import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import CustomerService from '/src/components/http/customer.service';

import Error from '/src/components/Error';

function NewContact() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 

    const navigate = useNavigate();

    const [customer, setCustomer] = useState("select");
    const [customerList, setCustomerList] = useState([]);

    const [type, setType] = useState("");
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


    function saveContact() {

        if (customer === "select") {
            setErrorMessage("Please select an existing customer or select New Customer to create a new contact.");
            setError(true);
            return;
        }
        else if (customer === "new" && (newCompany === "" || newContactName === "" || newContactEmail === "")) {
            setErrorMessage("Please enter contact info.");
            setError(true);
            return;
        }

        if (customer == "new") {
            CustomerService.create({ company: newCompany.toUpperCase(), name: newContactName, email: newContactEmail, phone: newContactPhone })
                .then(() => {
                    navigate(`/customers`);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }


    const label_classname = "font-bold text-md text-[#544B76] pl-4 pt-4";
    const input_classname = "focus:outline-none border-b border-slate-500 text-center col-span-3 pr-16";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className=""><Sidebar /></div>
                <div className="col-span-5">
                    <div className="grid place-items-center">
                        {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></>}

                        <div className="max-w-3/4 mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                            <div className="p-1 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                New Contact
                            </div>

                            {/*<div className="mb-4 text-sm text-[#544B76]"> - Edit info - </div>*/}



                            <div className="bg-white grid grid-cols-4 m-4 pl-8 py-4 max-w-full border border-slate-500">
                                <div className={label_classname}> Customer: </div>
                                <select
                                    className="col-span-3 mr-8 border-b border-slate-500 text-center "
                                    defaultValue="select"
                                    onChange={(e) => setCustomer(e.target.value)}
                                >
                                    <option value="select"> {"< select customer >"} </option>
                                    <option value="new"> New Customer </option>
                                    {customerList.map((company, index) =>
                                        <option value={company}> {company} </option>
                                    )}
                                </select>

                                {customer !== "select"
                                    ? (
                                        <div className="mt-6 mr-8 col-span-4">

                                            {customer == "new" ? <>
                                                <div className="grid grid-cols-4 mb-4">
                                                    <div className={label_classname}> Company Name: </div>
                                                    <input className={input_classname}
                                                        type="text"
                                                        value={newCompany}
                                                        onChange={(e) => setNewCompany(e.target.value)}
                                                    />
                                                </div>
                                            </> : <></>}

                                            <div className="grid grid-cols-3 mt-8">
                                                <div className="text-[#544B76] font-bold ml-4 mb-2"> Type: </div>
                                                {/*<div></div>*/}
                                                {/*<div></div>*/}
                                                <div className="">
                                                    <input className=""
                                                        type="radio"
                                                        name="type"
                                                        value="primary"
                                                        defaultChecked
                                                        onChange={(e) => setType(e.target.value)}
                                                    />
                                                    <label className="text-md px-2"> Primary </label>
                                                </div>
                                                <div className="">
                                                    <input className=""
                                                        type="radio"
                                                        name="type"
                                                        value="accounting"
                                                        onChange={(e) => setType(e.target.value)}
                                                    />
                                                    <label className="text-md px-2"> Accounting </label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4">

                                                <div className={label_classname}> Contact Name: </div>
                                                <input className={input_classname}
                                                    type="text"
                                                    value={newContactName}
                                                    onChange={(e) => setNewContactName(e.target.value)}
                                                />

                                                <div className={label_classname}> Contact Email: </div>
                                                <input className={input_classname}
                                                    type="text"
                                                    value={newContactEmail}
                                                    onChange={(e) => setNewContactEmail(e.target.value)}
                                                />
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
                                    )
                                    : <></>
                                }
                            </div>

                            <div className="pt-8 mx-8 flex gap-4 place-items-center">
                                <button
                                    className="text-white mb-4 mx-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-red-800"
                                    onClick={() => navigate(`/customers`)}
                                >
                                    Discard
                                </button>
                                <button
                                    className="text-white mb-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-blue-800"
                                    onClick={saveContact}
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

export default NewContact;