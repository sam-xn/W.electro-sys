import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const create = (data) => {
    return http.post("/customers", data);
};

const getAll = () => {
    return http.get("/customers");
};

const get = (company) => {
    return http.get(`/customers/${company}`);
};

const searchCompany = (company, type) => {
    return http.get(`/customers/search/${type}?company=${encodeURIComponent(company)}`);
};
const update = (id, data) => {
    return http.put(`/customers/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/customers/${id}`);
};


export default {
    create,
    getAll,
    get,
    searchCompany,
    update,
    remove,
};