import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar, Typography } from "@material-tailwind/react";
export default function OrdersNavbar({ status, setter }) {


    const ty_classname = "p-1 font-normal hover:border-b border-[#544B76]";

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "open" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/orders/status/open"
                    onClick={() => setter("open")}
                >
                    Open
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "finished" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/orders/status/finished"
                    onClick={() => setter("finished")}
                >
                    Finished
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "priced" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/orders/status/priced"
                    onClick={() => setter("priced")}
                >
                    Priced
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "invoiced" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/orders/status/invoiced"
                    onClick={() => setter("invoiced")}
                >
                    Invoiced
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "all" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/orders"
                    onClick={() => setter("all")}
                >
                    All
                </Link>
            </Typography>
        </ul>
    );

    return (
        <>
            <Navbar className="bg-[#eff1fc] top-2 z-10 h-max max-w-full rounded-sm px-4 py-2 px-8 py-4 border-slate-500">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <div></div>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{ navList }</div>
                    </div>
                </div>
            </Navbar>
        </>
    );
}