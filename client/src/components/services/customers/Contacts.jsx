export default function Contacts({ company, contacts }) {

    return (
        <>
            <div className="max-w-full mx-4 pt-8 px-8 bg-[#eff1fc] rounded shadow border border-slate-500">

                <div className="p-1 mb-8 text-[#544B76] font-bold text-xl border-b border-slate-500">
                    {/*{params.company}*/}
                    {company}
                </div>

                <div className="flex gap-6 my-4 text-[#544B76]">
                    <div className="mx-8 text-lg font-bold "> Primary Contact: </div>
                    <div>{contacts.primary?.name ? contacts.primary.name : ''}</div>
                    <div>{contacts.primary?.email ? contacts.primary.email : ''}</div>
                </div>
                <div className="flex gap-6 my-4 text-[#544B76]">
                    <div className="mx-8 text-lg font-bold "> Accounting Contact: </div>
                    <div>{contacts.accounting?.name ? contacts.accounting.name : ''}</div>
                    <div>{contacts.accounting?.email ? contacts.accounting.email : ''}</div >
                </div>
                <div className="flex gap-6 my-4 text-[#544B76]">
                    <div className="mx-8 text-lg font-bold "> Other Contacts: </div>
                    {contacts.other?.map(() => {
                        {contacts.other.name}
                        {contacts.other.email}
                    })}
                </div>

            </div>
        </>
    );
}

