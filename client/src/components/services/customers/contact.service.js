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

const findByTitle = (company_name) => {
    return http.get(`/contacts?company=${company_name}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle,
};