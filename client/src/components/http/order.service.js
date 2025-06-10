import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const create = (data) => {
    return http.post("/orders", data);
};

const get = (id) => {
    return http.get(`/orders/${id}`);
};

const search = (status, customer, po_num) => {
    const queries = [];

    if (customer) queries.push(`?customer=${encodeURIComponent(customer)}`);
    if (po_num) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `po_num=${encodeURIComponent(po_num)}`;
    }

    let request = "";
    if (status) request += status;
    else request += "all";

    queries.forEach(q => request += q);

    return http.get(`/orders/search/${request}`);
};

const update = (id, data) => {
    return http.put(`/orders/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/orders/${id}`);
};

const createNote = (data) => {
    return http.post(`/order_notes`, data);
};

const getNotes = (orderId) => {
    return http.get(`/order_notes/order/${encodeURIComponent(orderId)}`);
};

const updateNote = (id, data) => {
    return http.put(`/order_notes/${id}`, data);
};

export default {
    create,
    get,
    search,
    update,
    remove,
    createNote,
    getNotes,
    updateNote
};