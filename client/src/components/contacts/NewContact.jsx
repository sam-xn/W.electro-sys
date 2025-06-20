import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import CustomerService from '/src/components/http/customer.service';
import ContactService from '/src/components/http/contact.service';

import Error from '/src/components/Error';

function NewContact() {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const [customer, setCustomer] = useState("select");
    const [customerList, setCustomerList] = useState([]);

    const [newCompany, setNewCompany] = useState("");
    const [newContactType, setNewContactType] = useState("primary");
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
    }, []);

    function saveContact() {

        if (customer === "select") {
            setErrorMessage("Please select an existing customer or select New Customer to create a new contact.");
            setError(true);
            return;
        }

        else if (customer === "new") {
            if (newCompany === "") {
                setErrorMessage("Please enter new Company Name.");
                setError(true);
                return;
            }
            else if (newContactName === "" || (newContactEmail === "" && newContactPhone === "")) {
                setErrorMessage("Please enter new Contact info.");
                setError(true);
                return;
            }

            CustomerService.create({ company: newCompany.toUpperCase(), name: newContactName, email: newContactEmail, phone: newContactPhone, type: newContactType })
                .then(() => {
                    setSubmitted(true);
                })
                .catch((e) => {
                    console.log(e);
                });
        }

        else {
            if (newContactName === "" || (newContactEmail === "" && newContactPhone === "")) {
                setErrorMessage("Please enter new Contact info.");
                setError(true);
                return;
            }

            const info = { company: customer, name: newContactName, type: newContactType };
            if (newContactEmail !== "") info.email = newContactEmail;
            if (newContactPhone !== "") info.phone = newContactPhone;

            ContactService.create(info)
                .then(() => {
                    setSubmitted(true);
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
                <div><Sidebar /></div>
                <div className="col-span-5">
                    <div className="grid place-items-center">
                        {error ? <Error isOpen={error} onClose={handleClose}> {errorMessage} </Error> : <></>}

                        <div className="w-3/4 mx-4 py-8 px-8 mb-12 bg-[#eff1fc] rounded shadow border border-slate-500">

                            <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                                New Contact
                            </div>

                            {submitted ? <>
                                <div className="my-8 py-8 ml-12 text--[#544B76] text-lg"> Submitted. Thanks! </div>
                                <Link
                                    className="grid py-2 px-2 mx-18 md:mx-6 text-center text-sm text-white hover:text-[#544B76] shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] hover:bg-[#DEE1F4] rounded-md"
                                    to={`/customers`}
                                >
                                    <p> {" <- Return to Contacts "} </p>
                                </Link>
                            </> : <>
                                <div className="bg-white grid grid-cols-4 m-4 pl-8 py-4 max-w-full border border-slate-500">
                                    <div className={label_classname}> Customer: </div>
                                    <select
                                        className="col-span-3 mr-8 border-b border-slate-500 text-center"
                                        defaultValue="select"
                                        onChange={(e) => { setCustomer(e.target.value); if (e.target.value === "new") setNewContactType("primary"); else setNewContactType("other"); }}
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

                                                <div className="grid grid-cols-4 mt-8">
                                                    <div className="text-[#544B76] font-bold ml-4 mb-2"> Contact Type: </div>
                                                    <div>
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="primary"
                                                            checked={newContactType === "primary"}
                                                            onChange={(e) => setNewContactType(e.target.value)}
                                                        />
                                                        <label className="text-md px-2"> Primary </label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="accounting"
                                                            onChange={(e) => setNewContactType(e.target.value)}
                                                        />
                                                        <label className="text-md px-2"> Accounting </label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="other"
                                                            checked={newContactType === "other"}
                                                            onChange={(e) => setNewContactType(e.target.value)}
                                                        />
                                                        <label className="text-md px-2"> Other </label>
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

                                <div className="pt-4 mx-8 flex gap-4 place-content-center">
                                    <button
                                        className="text-white mb-2 mx-4 py-1 rounded w-sm bg-[#544B76] outline hover:bg-red-800"
                                        onClick={() => navigate(`/customers`)}
                                    >
                                        Discard
                                    </button>
                                    <button
                                        className="text-white mb-2 py-1 rounded w-sm bg-[#544B76] outline hover:bg-blue-800"
                                        onClick={saveContact}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewContact;