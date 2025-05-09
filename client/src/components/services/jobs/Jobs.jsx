import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import JobsNavbar from './JobsNavbar';
import { Search } from "lucide-react";

import JobService from "./job.service";

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const filter = useParams();

    useEffect(() => {
        JobService.findByCriteria(filter.status, searchCustomer, searchPO, searchProcess)
            .then((response) => {
                setJobs(response.data); console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [filter.status]);

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
        JobService.findByCriteria(filter.status, searchCustomer, searchPO, searchProcess)
            .then((response) => {
                setJobs(response.data);
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
                <JobsNavbar />
            </div>
            <div className="grid grid-cols-4">
                <div className="p-4 pt-6 border-b border-slate-500 text-slate-500">
                    {"Open Orders : " + (filter.status ? String(filter.status).charAt(0).toUpperCase() + String(filter.status).slice(1) : "All") + " Jobs"}
                </div>
            </div>

            <div className="mr-6 mt-2">

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
                <div className="border border-slate-500 rounded-md overflow-hidden mb-4">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="">
                                <th className={th_classname}>
                                    Date
                                </th>
                                <th className={th_classname}>
                                    Customer
                                </th>
                                <th className={th_classname}>
                                    Process
                                </th>
                                <th className={th_classname}>
                                    PO #
                                </th>
                                <th className={th_classname}></th>
                            </tr>
                        </thead>
                        <tbody>
                            { jobs.map((job, index) => (
                                <>
                                    <tr className="even:bg-white odd:bg-[#eff1fc]">
                                        <td className={td_classname}
                                            key={[index, job.id, job._timestamp]}
                                        >
                                            {new Date(job._timestamp).toDateString()}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, job.id, job.customer]}
                                        >
                                            {job.customer}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, job.id, job.process]}
                                        >
                                            {job.process}
                                        </td>
                                        <td className={td_classname}
                                            key={[index, job.id, job.po_num]}
                                        >
                                            {job.po_num}
                                        </td>
                                        <td className={td_classname}
                                            key={index, job.id, job.id}
                                        >
                                            <Link
                                                className={button_classname}
                                                to={`/orders/${job.orderId}`}
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
                                {`No ${filter.status} jobs to display.`}
                            </div>
                            : <div></div>
                    }</div>
                </div>
            </div>
        </>
    )
}  