import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar';

import ContactService from '/src/components/http/contact.service';

import Error from '/src/components/Error';

function EditContact({ contactId }) {
    // ---------------------------------------------------- ErrorModal 
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    function handleClose() { setError(false); }
    // --------------------------------------------------- /ErrorModal 
    const navigate = useNavigate();
    const params = useParams();

    const [submitted, setSubmitted] = useState(false);

    const [contact, setContact] = useState([]);
    const [newContactType, setNewContactType] = useState("primary");

    const [newContactName, setNewContactName] = useState("");
    const [newContactEmail, setNewContactEmail] = useState("");
    const [newContactPhone, setNewContactPhone] = useState("");

    useEffect(() => {
        ContactService.get(params?.id)
            .then((response) => {
                setContact(response.data); console.log(response.data);
                setNewContactType(response.data.type); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [params.id]);

    function saveContact() {

        if (newContactType === contact?.type && newContactName === "" && newContactEmail === "" && newContactPhone === "") {
            setErrorMessage("Please enter new values to update.");
            setError(true);
            return;
        }

        const info = {};
        if (newContactType!== contact?.type) info.type = newContactType;
        if (newContactName !== "") info.name = newContactName;
        if (newContactEmail !== "") info.email = newContactEmail;
        if (newContactPhone !== "") info.phone = newContactPhone;

        ContactService.update(params?.id, info)
            .then(() => {
                setSubmitted(true);
            })
            .catch((e) => {
                console.log(e);
            });
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
                                Edit Contact
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
                                    <div className="col-span-3 mr-8 border-b border-slate-500 text-center">
                                        {contact?.company}
                                    </div>

                                    <div className="mt-6 mr-8 col-span-4">

                                        <div className="grid grid-cols-4 mt-8">
                                            <div className="text-[#544B76] font-bold ml-4 mb-2"> Type: </div>
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
                                                    checked={newContactType === "accounting"}
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
                                                placeholder={contact.name}
                                                value={newContactName}
                                                onChange={(e) => setNewContactName(e.target.value)}
                                            />

                                            <div className={label_classname}> Contact Email: </div>
                                            <input className={input_classname}
                                                type="text"
                                                placeholder={contact.email}
                                                value={newContactEmail}
                                                onChange={(e) => setNewContactEmail(e.target.value)}
                                            />
                                            <div className={label_classname}> Contact Phone: </div>
                                            <input className={input_classname}
                                                type="text"
                                                placeholder={contact.phone}
                                                value={newContactPhone}
                                                onChange={(e) => setNewContactPhone(e.target.value)}
                                            />
                                        </div>

                                        <div className="mt-4 mr-8 text-center text-sm text-slate-600">
                                            <i>* please confirm spelling before submitting.</i>
                                        </div>
                                    </div>

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

export default EditContact;