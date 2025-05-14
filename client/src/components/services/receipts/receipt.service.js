import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getAll = () => {
    return http.get("/receipts");
};

const get = (id) => {
    return http.get(`/receipts/${id}`);
};

const create = (data) => {
    return http.post("/receipts", data);
};

const update = (id, data) => {
    return http.put(`/receipts/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/receipts/${id}`);
};

const getPOList = (rIds) => {
    return http.get(`/receipts/PO/list/id=${rIds}`);
};

const getPO = (PO) => {
    return http.get(`/receipts/PO/id=${PO}`);
};

const findByCriteria = (customer, PO, DS) => {
    if (!customer == "") {
        if (!PO == "") {
            if (!DS == "")
                return http.get(`/receipts/search/customer=${customer}/PO=${PO}/DS=${DS}`);
            else
                return http.get(`/receipts/search/customer=${customer}/PO=${PO}`);
        } else {
            if (!DS == "")
                return http.get(`/receipts/search/customer=${customer}/DS=${DS}`);
            else
                return http.get(`/receipts/search/customer=${customer}`);
        }
    }
    else {
        if (!PO == "") {
            if (!DS == "")
                return http.get(`/receipts/search/PO=${PO}/DS=${DS}`);
            else
                return http.get(`/receipts/search/PO=${PO}`);
        } else {
            if (!DS == "")
                return http.get(`/receipts/search/DS=${DS}`);
            else return http.get(`/receipts`);
        }
    }
};

export default {
    getAll,
    get,
    getPO,
    getPOList,
    create,
    update,
    remove,
    findByCriteria,
};