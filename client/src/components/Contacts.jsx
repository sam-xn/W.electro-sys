import ContactService from '/src/components/http/contact.service.js';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

export default function Contacts({ company }) {

    const [contacts, setContacts] = useState({ primary: [], accounting: [], other: [] });

    useEffect(() => {
        ContactService.getCompany(company)
            .then((response) => {
                const d = response.data;
                const c = { primary: [], accounting: [], other: [] };
                d.forEach(r => {
                    switch (r.type) {
                        case "primary":
                            c.primary.push({
                                id: r.id,
                                name: r.name,
                                email: r.email,
                                phone: r.phone
                            }); break;
                        case "accounting":
                            c.accounting.push({
                                id: r.id,
                                name: r.name,
                                email: r.email,
                                phone: r.phone
                            }); break;
                        default:
                            c.other.push({
                                id: r.id,
                                name: r.name,
                                email: r.email,
                                phone: r.phone
                            });
                    }
                });

                setContacts(c); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    const link_classname = "hover:text-white mx-2 px-2 my-2 rounded text-sm text-center bg-[#DEE1F4] outline hover:bg-blue-800";

    return (
        <>
            <div className="max-w-full m-4 p-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    {company}
                </div>

                {contacts.primary[0]?.id ?
                    <>
                        <div className="text-[#544B76] underline my-2 mx-4"> Primary </div>
                        {contacts.primary.map(c => <>
                            <div className="ml-8 mr-4 flex justify-between text-[#544B76] border-b border-slate-500">
                                <div className="px-2 pt-1">{c.name}</div>
                                {c.email !== null ? <div className="px-2 pt-1">{c.email}</div> : <></>}
                                {c.phone !== null ? <div className="px-2 pt-1">{c.phone}</div> : <></>}
                                <Link
                                    className={link_classname}
                                    to={`/contacts/${c.id}/edit`}>
                                    Edit
                                </Link>
                            </div>
                        </>)}
                    </> : <></>
                }
                {contacts.accounting[0]?.id ?
                    <>
                        <div className="text-[#544B76] underline my-2 mx-4"> Accounting </div>
                        {contacts.accounting.map(c => <>
                            <div className="ml-8 mr-4 flex justify-between text-[#544B76] border-b border-slate-500">
                                <div className="px-2 pt-1">{c.name}</div>
                                {c.email !== null ? <div className="px-2 pt-1">{c.email}</div> : <></>}
                                {c.phone !== null ? <div className="px-2 pt-1">{c.phone}</div> : <></>}
                                <Link
                                    className={link_classname}
                                    to={`/contacts/${c.id}/edit`}>
                                    Edit
                                </Link>
                            </div>
                        </>)}
                    </> : <></>
                }
                {contacts.other[0]?.id ?
                    <>
                        <div className="text-[#544B76] underline my-2 mx-4"> Other </div>
                        {contacts.other.map(c => <>
                            <div className="ml-8 mr-4 flex justify-between text-[#544B76] border-b border-slate-500">
                                <div className="px-2 pt-1">{c.name}</div>
                                {c.email !== null ? <div className="px-2 pt-1">{c.email}</div> : <></>}
                                {c.phone !== null ? <div className="px-2 pt-1">{c.phone}</div> : <></>}
                                <Link
                                    className={link_classname}
                                    to={`/contacts/${c.id}/edit`}>
                                    Edit
                                </Link>
                            </div>
                        </>)}
                    </> : <></>
                }

            </div>
        </>
    );
}

