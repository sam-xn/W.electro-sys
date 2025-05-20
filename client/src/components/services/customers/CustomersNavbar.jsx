import React from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar, Typography } from "@material-tailwind/react";
export default function CustomersNavbar({ modalOpen }) {

    const params = useParams();
    const ty_classname = "p-1 font-normal hover:border-b border-[#A295AF]";

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                color=""
                className={ty_classname + (params ? (params.type === "primary" ? " border-b border-[#A295AF]" : "") : "")}
            >
                <Link
                    className="flex items-center"
                    to="/customers/type/primary"
                >
                    Primary
                </Link>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color=""
                className={ty_classname + (params ? (params.type === "accounting" ? " border-b border-[#A295AF]" : "") : "")}
            >
                <Link
                    className="flex items-center"
                    to="/customers/type/accounting"
                >
                    Accounting
                </Link>
            </Typography>
        </ul>
    );

    return (
        <>
            <Navbar className="bg-[#eff1fc] sticky top-2 z-10 h-max max-w-full rounded-sm px-4 py-2 lg:px-8 lg:py-4 border-slate-500">
                <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{ navList }</div>
                    </div>
                </div>
            </Navbar>
        </>
    );
}