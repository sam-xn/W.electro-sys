import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getAll = () => {
    return http.get("/customers");
};

const get = (id) => {
    return http.get(`/customers/${id}`);
};

const create = (data) => {
    return http.post("/customers", data);
};

const update = (id, data) => {
    return http.put(`/customers/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/customers/${id}`);
};

const findByTitle = (company_name) => {
    return http.get(`/customers?company_name=${company_name}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle,
};