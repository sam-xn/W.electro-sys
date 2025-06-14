import ContactService from '/src/components/http/contact.service.js';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

export default function Contacts({ company }) {

    const [contacts, setContacts] = useState({ primary: [], accounting: [], other: [] });

    useEffect(() => {
        ContactService.getCompany(company)
            .then((response) => {
                console.log(response.data)
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

                setContacts(c); console.log(c)
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    const link_classname = "hover:text-white mx-2 px-2 pt-1 rounded text-sm text-center bg-[#DEE1F4] outline hover:bg-blue-800";

    return (
        <>
            <div className="max-w-full m-4 p-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    {company}
                </div>

                <div className="flex gap-2 my-4 text-[#544B76] text-lg">
                    {contacts.primary[0]?.id ?
                        <>
                            <div className="mx-4 text-sm "> Primary: </div>
                            <div>{contacts.primary[0].name}</div>
                            {contacts.primary.email !== null ?
                                <div className="border-l border-slate-500 pl-2 ml-2">{contacts.primary.email}</div>
                                : <></>
                            }
                            {contacts.primary.phone !== null ?
                                <div className="border-l border-slate-500 pl-2 ml-2">{contacts.primary.phone}</div>
                                : <></>
                            }
                            <Link
                                className={link_classname}
                                to={`/contacts/${contacts.primary.id}/edit`}>
                                Edit
                            </Link>
                        </> : <></>
                    }
                </div>
                {/*<div className="flex gap-2 my-4 text-[#544B76] text-lg">*/}
                {/*    {contacts.accounting?[0].id ?*/}
                {/*    <>*/}
                {/*        <div className="mx-4 text-lg"> Accounting: </div>*/}
                {/*        <div>{contacts.accounting.name}</div>*/}
                {/*        {contacts.accounting.email !== null ?*/}
                {/*            <div className="border-l border-slate-500 pl-2 ml-2">{contacts.accounting.email}</div>*/}
                {/*            : <></>*/}
                {/*        }*/}
                {/*        {contacts.accounting.phone !== null ?*/}
                {/*            <div className="border-l border-slate-500 pl-2 ml-2">{contacts.accounting.phone}</div>*/}
                {/*            : <></>*/}
                {/*        }*/}
                {/*        <Link*/}
                {/*            className={link_classname}*/}
                {/*            to={`/contacts/${contacts.accounting.id}/edit`}>*/}
                {/*            Edit*/}
                {/*        </Link> */}
                {/*        </> : <></>*/}
                {/*    }*/}
                {/*</div>*/}
                {/*<div className="flex gap-2 my-4 text-[#544B76] text-lg">*/}
                {/*    {contacts.other ? <>*/}
                {/*        {contacts.other[0] !== null*/}
                {/*            ? <>*/}
                {/*                <div className="flex gap-2 my-4 text-[#544B76] text-lg">*/}
                {/*                    <div className="mx-4 text-lg"> Other: </div>*/}
                {/*                    {contacts.other.map((other, i) => {*/}
                {/*                        <>*/}
                {/*                            <div>{other[i].name}</div>*/}
                {/*                            <div> | </div>*/}
                {/*                            <div>{other[i].email}</div>*/}
                {/*                            {contacts.other[i].id ?*/}
                {/*                                <Link*/}
                {/*                                    className={link_classname}*/}
                {/*                                    to={`/contacts/${contacts.other[i].id}/edit`}>*/}
                {/*                                    Edit*/}
                {/*                                </Link>*/}
                {/*                            : <></>}*/}
                {/*                        </>*/}
                {/*                    })}*/}
                {/*                </div>*/}
                {/*            </> : <></>*/}
                {/*        }*/}
                {/*    </> : <></>}*/}
                {/*</div>*/}
            </div>
        </>
    );
}

