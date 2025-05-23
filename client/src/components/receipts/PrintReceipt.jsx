import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ReceiptService from '/src/components/http/receipt.service';

export default function Receipt() {
    const { id } = useParams(); console.log("id= " + id);
    const navigate = useNavigate();

    const [currentReceipt, setCurrentReceipt] = useState({
        id: null,
        _timestamp: null,
        notes: null,
    });
    const [message, setMessage] = useState("");

    const getReceipt = (id) => {
        ReceiptService.get(id)
            .then((response) => {
                setCurrentReceipt(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        if (id) getReceipt(id);
    }, [id]);

    return (
        <>
            print receipt
            <br></br>
            <br></br>
            receipt component:<br></br>
            {currentReceipt.id}<br></br>
            {currentReceipt._timestamp}<br></br>
            {currentReceipt.notes}<br></br>
        </>
    )
}