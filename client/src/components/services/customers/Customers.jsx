import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import CustomersNavbar from './CustomersNavbar';
import { Search } from "lucide-react";

import CustomerService from "./customer.service";

export default function Customer() {

    const [customers, setCustomers] = useState([]);
    const filter = useParams();

    useEffect(() => {
        CustomerService.getAllJoinContacts()
            .then((response) => {
                setCustomers(response.data.sort((a, b) => a.company - b.company)); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    // ------------------------------------------------------------------------------------ SearchBar 

    //const [searchDate, setSearchDate] = useState("");
    const [searchCustomer, setSearchCustomer] = useState("");
    
    //const onChangeSearchDate = (e) => { setSearchDate(e.target.value); };
    const onChangeSearchCustomer = (e) => { setSearchCustomer(e.target.value); };
    function findBy(e) {
        e.preventDefault();
        CustomerService.getAllJoinContacts(searchCustomer)
            .then((response) => {
                setCustomers(response.data.sort((a, b) => a.id - b.id));
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const input_classname = "block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6";
    const th_classname = "h-12 px-4 align-middle font-medium border-b border-slate-500";
    const td_classname = "p-2 align-middle border border-slate-300";
    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";

    return (
        <>
            <div className="mr-6">
                <CustomersNavbar />
            </div>
            <div className="grid grid-cols-4">
                <div className="p-4 pt-6 border-b border-slate-500 text-[#544B76]">
                    Customers
                </div>
            </div>

            <div className="mr-6 mt-2">

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
                                value={searchCustomer}
                                onChange={onChangeSearchCustomer}
                            />
                        </div>
                    </form>
                </div>
                { /*-------------------------------------------------------- Customers Table />*/}
                <div className="border border-slate-500 rounded-md overflow-hidden mb-4">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="text-[#544B76]">
                                <th className={th_classname}>
                                    Primary Contact
                                </th>
                                <th className={th_classname}>
                                    Company
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
                                    <tr className="even:bg-white odd:bg-[#eff1fc]">
                                        <td className={td_classname}
                                            key={[index, customer.name]}
                                        >
                                            {customer.name}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, customer.company]}
                                        >
                                            {customer.company}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, customer.email]}
                                        >
                                            {customer.email}
                                        </td>
                                        <td className={td_classname}
                                            key={index, customer.company, customer.company}
                                        >
                                            <Link
                                                className={button_classname}
                                                to={`/customers/${customer.company}`}
                                            >
                                                View Contacts
                                            </Link>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>

                    <div>{
                        customers.length == 0 ?
                            <div className="text-sm px-8 py-2 bg-[#eff1fc]">
                                No {filter.status ? filter.status : ''} customers to display.
                            </div>
                            : <div></div>
                    }</div>
                </div>
            </div>
        </>
    )
}  