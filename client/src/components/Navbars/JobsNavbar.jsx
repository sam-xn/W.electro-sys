import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar, Typography } from "@material-tailwind/react";
export default function JobsNavbar({ status, setter }) {

    const ty_classname = "p-1 font-normal hover:border-b border-[#544B76]";

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "incoming" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/jobs/status/incoming"
                    onClick={() => setter("incoming")}
                >
                    Incoming
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "received" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/jobs/status/received"
                    onClick={() => setter("received")}
                >
                    Received
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "processed" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/jobs/status/processed"
                    onClick={() => setter("processed")}
                >
                    Processed
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className={ty_classname + (status === "delivered" ? " border-b border-[#544B76]" : "")}
            >
                <Link
                    className="flex items-center text-[#544B76]"
                    to="/jobs/status/delivered"
                    onClick={() => setter("delivered")}
                >
                    Delivered
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
                    to="/jobs"
                    onClick={() => setter("all")}
                >
                    All
                </Link>
            </Typography>
        </ul>
    );

    return (
        <>
            <Navbar className="bg-[#eff1fc] top-2 z-10 h-max max-w-full rounded-sm px-4 py-2 lg:px-8 lg:py-4 border-slate-500">
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