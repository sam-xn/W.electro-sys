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

const getType = (type) => {
    return http.get(`/contacts/type/${type}`);
};

const getCompany = (company) => {
    if (company === "") return ({});
    return http.get(`/contacts/company/${company}`);
};

const searchCompany = (company, type) => {
    return http.get(`/contacts/search/${type}?company=${company}`);
};

export default {
    create,
    getType,
    getCompany,
    searchCompany
};