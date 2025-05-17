import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getAll = () => {
    return http.get("/contacts");
};

const getAllType = (type) => {
    if (!type || type === '') return http.get(`/contacts`);
    return http.get(`/contacts/type/${type}`);
};

const getAllCompany = (company, type) => {
    if (!company || company === '') return http.get(`/contacts/type/${type}`);
    return http.get(`/contacts/type/${type}/company/${company}`);
};

const getCompany = (company) => {
    if (company === "") return ({});
    return http.get(`/contacts/company/${company}`);
};

const get = (id) => {
    return http.get(`/contacts/${id}`);
};

const create = (data) => {
    return http.post("/contacts", data);
};

const update = (id, data) => {
    return http.put(`/contacts/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/contacts/${id}`);
};

const findByTitle = (company) => {
    return http.get(`/contacts?company=${company}`);
};

export default {
    getAll,
    getAllCompany,
    getCompany,
    getAllType,
    get,
    create,
    update,
    remove,
    findByTitle,
};