import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const create = (data) => {
    return http.post("/receipts", data);
};

const getOrder = (poId) => {
    return http.get(`/receipts/order/${encodeURIComponent(poId)}`);
};

const getList = (receiptIds) => { 
    return http.get(`/receipts/list/${receiptIds}`);
};

const getPrint = (id) => {
    return http.get(`/receipts/print/${id}`);
};

const getPastPickups = (jobIds) => {
    return http.get(`/receipts/deliverables/list/${jobIds}`);
};

const search = (id, customer, po_num) => {
    const queries = [];

    if (id) queries.push(`?id=${id}`);
    if (customer) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `customer=${encodeURIComponent(customer)}`;
    }
    if (po_num) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `po_num=${encodeURIComponent(po_num)}`;
    }

    let request = "";
    queries.forEach(q => request += q);

    return http.get(`/receipts/search${request}`);
};

const remove = (id) => {
    return http.delete(`/receipts/${id}`);
};

const update = (id, data) => {
    return http.put(`/receipts/${id}`, data);
};

const createNote = (data) => {
    return http.post(`/receipt_notes`, data);
};

const getNotes = (orderId) => {
    return http.get(`/receipt_notes/order/${encodeURIComponent(orderId)}`);
};

const updateNote = (id, data) => {
    return http.put(`/receipt_notes/${id}`, data);
};

export default {
    create,
    getOrder,
    getList,
    getPrint,
    getPastPickups,
    search,
    update,
    remove,
    createNote,
    getNotes,
    updateNote
};