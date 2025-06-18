import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const create = (data) => {
    return http.post("/contacts", data);
};

const update = (id, data) => {
    return http.put(`/contacts/${id}`, data);
};

const get = (id) => {
    return http.get(`/contacts/${id}`);
};

const getType = (type) => {
    return http.get(`/contacts/type/${type}`);
};

const getCompany = (company) => {
    if (company === "") return ({});
    return http.get(`/contacts/company/${encodeURIComponent(company)}`);
};

const searchCompany = (company, type) => {
    return http.get(`/contacts/search/${type}?company=${encodeURIComponent(company)}`);
};

export default {
    create,
    update,
    get,
    getType,
    getCompany,
    searchCompany
};