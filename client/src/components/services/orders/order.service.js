import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getAll = () => {
    return http.get("/orders");
};

const get = (id) => {
    return http.get(`/orders/${id}`);
};

const create = (data) => {
    return http.post("/orders", data);
};

const update = (id, data) => {
    return http.put(`/orders/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/orders/${id}`);
};

const findByCriteria = (status, customer, PO) => {
    if (!status=="") status = "/status/" + status;
    else status = "";

    if (!customer == "") {
        if (!PO == "") return http.get(`/orders${status}/search/customer=${customer}/PO=${PO}`);
        else return http.get(`/orders${status}/search/customer=${customer}`);
    }
    else if (!PO == "") return http.get(`/orders${status}/search/PO=${PO}`);

    else return http.get(`/orders${status}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    findByCriteria,
};