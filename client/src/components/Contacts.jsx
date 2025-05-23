export default function Contacts({ company, contacts }) {

    return (
        <>
            <div className="max-w-full m-4 p-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    {/*{params.company}*/}
                    {company}
                </div>

                <div className="flex gap-2 my-4 text-[#544B76]">
                    <div className="mx-4 text-lg"> Primary Contact: </div>
                    <div className="pt-1">{contacts.primary?.name ? contacts.primary.name : ''}</div>
                    <div className="pt-1"> | </div>
                    <div className="pt-1">{contacts.primary?.email ? contacts.primary.email : ''}</div>
                </div>
                <div className="flex gap-2 py-4 text-[#544B76]">
                    <div className="mx-4 text-lg"> Accounting Contact: </div>
                    <div className="pt-1">{contacts.accounting?.name ? contacts.accounting.name : ''}</div>
                    <div className="pt-1"> | </div>
                    <div className="pt-1">{contacts.accounting?.email ? contacts.accounting.email : ''}</div>
                </div>
                <div className="flex gap-2 my-4 text-[#544B76]">
                    <div className="mx-4 text-lg"> Other Contacts: </div>
                    {contacts.other?.map(() => {
                        <>
                            <div className="pt-1">{contacts.other.name}</div>
                            <div className="pt-1"> | </div>
                            <div className="pt-1">{contacts.other.email}</div>
                        </>
                    })}
                </div>

            </div>
        </>
    );
}

