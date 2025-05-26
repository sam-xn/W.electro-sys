import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ReceiptService from '/src/components/http/receipt.service';

export default function Receipt() {

    const navigate = useNavigate();

    const [currentReceipt, setCurrentReceipt] = useState([]);

    useEffect(() => {
        if (!currentReceipt.id) return;
        getReceipt(id)
            .then(response => { })
            .catch((e) => { console.log(e)})
    }, []);

    return (
    //    print receipt
    //        < br ></br >
    //            <br></br>
    //            receipt component: <br></br>
    //{ currentReceipt.id } <br></br>
    //{ currentReceipt._timestamp } <br></br>
    //{ currentReceipt.notes }<br></br>
        <>
            <div className="h-[1056px] w-[408px] border"></div>


            
        </>
    )
}