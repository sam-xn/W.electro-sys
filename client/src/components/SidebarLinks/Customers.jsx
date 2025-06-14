import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Search } from 'lucide-react';

import Sidebar from '/src/components/Sidebar';
import CustomersNavbar from '/src/components/Navbars/CustomersNavbar';

import ContactService from '/src/components/http/contact.service';

import Contacts from '/src/components/Contacts';
import Modal from '/src/components/Modal';
export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState("primary");

    useEffect(() => {
        ContactService.getType(filter)
            .then((response) => {
                setCustomers(response.data.sort((a, b) => a.company.localeCompare(b.company))); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [filter]);

    // ------------------------------------------------------------------------------------ SearchBar 

    const [searchCompany, setSearchCompany] = useState("");
    
    const onChangeSearchCompany = (e) => { setSearchCompany(e.target.value); };
    function findBy(e) {
        e.preventDefault();
        ContactService.searchCompany(searchCompany, filter)
            .then((response) => {
                setCustomers(response.data.sort((a, b) => a.id - b.id)); 
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // ------------------------------------------------------------------------------------ Modal 

    const [open, setOpen] = useState(false);
    const [modalCompany, setModalCompany] = useState("");

    const handleClose = () => { setOpen(false); };
    const handleOpen = (c) => { setOpen(true); setModalCompany(c); };

    const input_classname = "block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6";
    const th_classname = "h-12 px-4 align-middle font-medium border-b border-slate-500";
    const td_classname = "p-2 align-middle border border-slate-300";
    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    const newPO_classname = "grid py-2 px-2 mx-18 md:mx-6 text-center text-sm text-white hover:text-[#544B76] shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-[#544B76] text-white hover:bg-[#DEE1F4] rounded-md";

    return (
        <>
            <div className="grid grid-cols-6">
                <Modal isOpen={open} onClose={handleClose}>
                    <Contacts company={modalCompany} />
                </Modal>
                <div className="mb-8"><Sidebar /></div>
                <div className="col-span-5"> <CustomersNavbar status={filter} setter={setFilter} />
                    <div className="grid grid-cols-4">
                        <div className="text-md p-4 pt-6 border-b border-slate-500 text-[#544B76]">
                            Customers {" : " + (filter === "all" ? "Primary" : String(filter).charAt(0).toUpperCase() + String(filter).slice(1)) + " Contacts"}
                        </div>
                        <div></div><div></div>
                        <div className="pt-8 pr-10">
                            <Link
                                className={newPO_classname}
                                to={'/contacts/new'}
                            >
                                New Contact
                            </Link>
                        </div>
                    </div>

                    <div className="mt-2">

                        <div className="grid gap-2 mx-40">
                            <form onSubmit={findBy} className="col-span-2 my-8">
                                <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500">
                                    <div className="flex items-center pl-2">
                                        <Search size={16} color="#94a3b8" />
                                    </div>
                                    <input
                                        list="customer"
                                        type="text"
                                        name="customer"
                                        id="customer"
                                        className={input_classname}
                                        placeholder={"Find by company"}
                                        value={searchCompany}
                                        onChange={onChangeSearchCompany}
                                    />
                                </div>
                            </form>
                        </div>
                        { /*-------------------------------------------------------- Customers Table />*/}
                        <div className="border border-slate-500 rounded-md overflow-hidden mb-8">
                            <table className="w-full caption-bottom text-sm">
                                <thead>
                                    <tr className="text-[#544B76]">
                                        <th className={th_classname}>
                                            Company
                                        </th>
                                        <th className={th_classname}>
                                            {String(filter).charAt(0).toUpperCase() + String(filter).slice(1)} Contact 
                                        </th>
                                        <th className={th_classname}>
                                            Email
                                        </th>
                                        <th className={th_classname}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { customers.map((customer, index) => (
                                        <>
                                            <tr className="even:bg-white odd:bg-[#eff1fc] items-center" key={customer.company}
                                            >
                                                <td className={td_classname}
                                                >
                                                    {customer.company}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {customer.name}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {customer.email}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    <div className={"flex " + button_classname}>
                                                    <button type="button" onClick={() => handleOpen(customer.company)}>
                                                        View Contacts
                                                        </button>
                                                    </div>
                                                    
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>

                            <div>{
                                customers.length == 0 ?
                                    <div className="text-sm px-8 py-2 bg-[#eff1fc]">
                                        No {filter === "all" ? "" : filter} contacts to display.
                                    </div>
                                    : <div></div>
                            }</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}  