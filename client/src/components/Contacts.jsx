export default function Contacts({ company, contacts }) {

    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";
    console.log(contacts)
    return (
        <>
            <div className="max-w-full m-4 p-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    {company}
                </div>

                <div className="flex gap-2 my-4 text-[#544B76] text-lg">
                    <div className="mx-4 text-lg"> Primary Contact: </div>
                    <div>{contacts.primary?.name ? contacts.primary.name : ''}</div>
                    <div> | </div>
                    <div>{contacts.primary?.email ? contacts.primary.email : ''}</div>
                </div>
                {contacts.accounting
                    ?
                    <div className="flex gap-2 py-4 text-[#544B76] text-lg">
                        <div className="mx-4 text-lg"> Accounting Contact: </div>
                        <div>{contacts.accounting?.name ? contacts.accounting.name : ''}</div>
                        <div> | </div>
                        <div>{contacts.accounting?.email ? contacts.accounting.email : ''}</div>
                    </div>
                    : <></>
                }
                {contacts.other ? <>
                    {contacts.other[0]
                        ? <>
                            <div className="flex gap-2 my-4 text-[#544B76] text-lg">
                                <div className="mx-4 text-lg"> Other Contacts: </div>
                                {contacts.other?.map((other, i) => {
                                    <>
                                        <div>{other[i]?.name}</div>
                                        <div> | </div>
                                        <div>{other[i]?.email}</div>
                                    </>
                                })}
                            </div>
                        </> : <></>
                    }
                </> : <></>}
            </div>
        </>
    );
}

