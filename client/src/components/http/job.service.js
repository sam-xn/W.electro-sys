import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const create = (data) => {
    return http.post("/jobs", data);
};

const getJob = (id) => {
    return http.get(`/jobs/${id}`);
};

const getOrder = (poId) => {
    return http.get(`/jobs/order/${encodeURIComponent(poId)}`);
};

const getCustomer = (status, customer) => {
    if (status === "select") status = null;
    return http.get(`/jobs/customer/${status}/${encodeURIComponent(customer)}`);
};

const getList = (jobIds) => {
    return http.get(`/jobs/list/${jobIds}`);
};

const search = (status, customer, po_num, process) => {
    const queries = [];

    if (customer) queries.push(`?customer=${encodeURIComponent(customer)}`);
    if (po_num) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `po_num=${encodeURIComponent(po_num)}`;
    }
    if (process) {
        if (queries.length > 0) queries.push("&")
        else queries.push("?");
        queries[queries.length - 1] += `process=${encodeURIComponent(process)}`;
    }

    let request = "";
    if (status) request += status;
    else request += "all";

    queries.forEach(q => request += q);

    return http.get(`/jobs/search/${request}`);
};

const update = (id, data) => {
    return http.put(`/jobs/${id}`, data);
};

const updateTag = (id, data) => {
    return http.put(`/jobs/tag/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/jobs/${id}`);
};
export default {
    create,
    getJob,
    getOrder,
    search,
    getCustomer,
    getList,
    update,
    updateTag,
    remove,
};