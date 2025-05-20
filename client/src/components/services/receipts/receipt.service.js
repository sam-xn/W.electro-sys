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
    return http.get(`/receipts/order/${poId}`);
};

const getList = (receiptIds) => { 
    return http.get(`/receipts/list/${receiptIds}`);
};

const search = (id, customer, po_num) => {
    const queries = [];

    if (id) queries.push(`?id=${id}`);
    if (customer) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `customer=${customer}`;
    }
    if (po_num) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `po_num=${po_num}`;
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

export default {
    create,
    getOrder,
    getList,
    search,
    update,
    remove,
};