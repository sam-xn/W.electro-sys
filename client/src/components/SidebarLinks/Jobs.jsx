import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Search } from 'lucide-react';

import Sidebar from '/src/components/Sidebar';
import JobsNavbar from '/src/components/Navbars/JobsNavbar';

import JobService from '/src/components/http/job.service';

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        JobService.search(filter, searchCustomer, searchPO, searchProcess)
            .then((response) => {
                setJobs(response.data.sort((a, b) => b.id - a.id)); 
            })
            .catch((e) => {
                console.log(e);
            });
    }, [filter]);

    // ------------------------------------------------------------------------------------ SearchBar 

    //const [searchDate, setSearchDate] = useState("");
    const [searchCustomer, setSearchCustomer] = useState("");
    const [searchPO, setSearchPO] = useState("");
    const [searchProcess, setSearchProcess] = useState("");

    //const onChangeSearchDate = (e) => { setSearchDate(e.target.value); };
    const onChangeSearchCustomer = (e) => { setSearchCustomer(e.target.value); };
    const onChangeSearchPO = (e) => { setSearchPO(e.target.value); };
    const onChangeSearchProcess = (e) => { setSearchProcess(e.target.value); };

    function findBy(e) {
        e.preventDefault();
        JobService.search(filter, searchCustomer, searchPO, searchProcess)
            .then((response) => {
                setJobs(response.data.sort((a, b) => b.id - a.id));
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const input_classname = "block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6";
    const th_classname = "h-12 px-4 align-middle font-medium border-b border-slate-500";
    const td_classname = "w-1/6 p-2 align-middle border border-slate-300";
    const button_classname = "grid text-center text-sm font-medium shadow-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-500 border-input bg-background hover:bg-[#DEE1F4] rounded-md py-2";

    return (
        <>
            <div className="grid grid-cols-6">
                <div className="mb-8"><Sidebar /></div>
                <div className="col-span-5"> <JobsNavbar status={filter} setter={setFilter} />

                    <div className="grid grid-cols-4">
                        <div className="p-4 pt-6 border-b border-slate-500 text-[#544B76]">
                            {"Open Orders : " + String(filter).charAt(0).toUpperCase() + String(filter).slice(1) + " Jobs"}
                        </div>
                    </div>

                    <div className="mt-2">

                        <div className="grid grid-cols-3 gap-2 items-center">
                            <form onSubmit={findBy}>
                                <div className="p-4 mr-8">
                                    <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-md">
                                        <div className="flex items-center pl-2">
                                            <Search size={16} color="#94a3b8" />
                                        </div>
                                        <input
                                            list="customer"
                                            type="text"
                                            name="customer"
                                            id="customer"
                                            className={input_classname}
                                            placeholder={"Search by customer"}
                                            value={searchCustomer}
                                            onChange={onChangeSearchCustomer}
                                        />
                                    </div>
                                </div>
                            </form>
                            <form onSubmit={findBy}>
                                <div className="m-4 p-4">
                                    <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-md">
                                        <div className="flex items-center pl-2">
                                            <Search size={16} color="#94a3b8" />
                                        </div>
                                        <input
                                            list="process"
                                            type="text"
                                            name="process"
                                            id="process"
                                            className={input_classname}
                                            placeholder={"Search by process"}
                                            value={searchProcess}
                                            onChange={onChangeSearchProcess}
                                        />
                                    </div>
                                </div>
                            </form>
                            <form onSubmit={findBy}>
                                <div className="m-4 p-4">
                                    <div className="flex rounded-sm shadow-sm ring-1 ring-slate-500 sm:max-w-md">
                                        <div className="flex items-center pl-2">
                                            <Search size={16} color="#94a3b8" />
                                        </div>
                                        <input
                                            list="PO"
                                            type="text"
                                            name="PO"
                                            id="PO"
                                            className={input_classname}
                                            placeholder={"Search by PO"}
                                            value={searchPO}
                                            onChange={onChangeSearchPO}
                                        />
                                    </div>
                                </div>
                            </form>

                        </div>
                        { /*-------------------------------------------------------- Jobs Table />*/}
                        <div className="border border-slate-500 rounded-md overflow-hidden mb-8">
                            <table className="w-full caption-bottom text-sm">
                                <thead>
                                    <tr className="text-[#544B76]">
                                        <th className={th_classname}>
                                            Date
                                        </th>
                                        <th className={th_classname}>
                                            Customer
                                        </th>
                                        <th className={th_classname}>
                                            PO #
                                        </th>
                                        <th className={th_classname}>
                                            Process
                                        </th>
                                        <th className={th_classname}>
                                            Qty
                                        </th>
                                        <th className={th_classname}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { jobs.map((job, index) => (
                                        <>
                                            <tr className="even:bg-white odd:bg-[#eff1fc]" key={job.id}>
                                                <td className={td_classname}
                                                >
                                                    {new Date(job._timestamp).toDateString()}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {job.order.customer}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {job.order.po_num}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {job.process}
                                                </td>
                                                <td className={td_classname+" text-center"}
                                                >
                                                    {job.qty}
                                                </td>
                                                <td className={td_classname}
                                                >
                                                    {job.status === "incoming" ? <>
                                                        <Link
                                                            className={button_classname+" mb-2"}
                                                            to={`/jobs/${job.id}/print`}
                                                        >
                                                            Print Tag
                                                        </Link>
                                                    </> :
                                                        job.status === "received" || job.status === "delivered-partial" ? <>
                                                            <Link
                                                                className={button_classname+ " mb-2"}
                                                                to={`/jobs/${job.id}/update`}
                                                            >
                                                                Finish Job
                                                            </Link>
                                                        </> : <></>
                                                    }
                                                    <Link
                                                        className={button_classname}
                                                        to={`/orders/${job.po_id}`}
                                                    >
                                                        View Order
                                                    </Link>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>

                            <div>{
                                jobs.length == 0 ?
                                    <div className="text-sm px-8 py-2 bg-[#eff1fc]">
                                        No {filter === "all" ? "" : filter} jobs to display.
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