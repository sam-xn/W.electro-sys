import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getAll = () => {
    return http.get("/deliverables");
};

const get = (id) => {
    console.log(id);
    return http.get(`/deliverables/${id}`);
};

const create = (data) => {
    //console.log(data);
    return http.post("/deliverables", data);
};

const update = (id, data) => {
    return http.put(`/deliverables/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/deliverables/${id}`);
};

const getPOList = (rIds) => {
    return http.get(`/deliverables/PO/list/id=${rIds}`);
};

const getPO = (PO) => {
    return http.get(`/deliverables/PO/id=${PO}`);
};

//const getReceipt = (id) => {
//    return http.get(`/deliverables/receipt/${id}`);
//};

const findByCriteria = (customer, PO, DS) => {
    if (!customer == "") {
        if (!PO == "") {
            if (!DS == "")
                return http.get(`/deliverables/search/customer=${customer}/PO=${PO}/DS=${DS}`);
            else
                return http.get(`/deliverables/search/customer=${customer}/PO=${PO}`);
        } else {
            if (!DS == "")
                return http.get(`/deliverables/search/customer=${customer}/DS=${DS}`);
            else
                return http.get(`/deliverables/search/customer=${customer}`);
        }
    }
    else {
        if (!PO == "") {
            if (!DS == "")
                return http.get(`/deliverables/search/PO=${PO}/DS=${DS}`);
            else
                return http.get(`/deliverables/search/PO=${PO}`);
        } else {
            if (!DS == "")
                return http.get(`/deliverables/search/DS=${DS}`);
            else return http.get(`/deliverables`);
        }
    }
};

export default {
    getAll,
    get,
    getPO,
    //getReceipt,
    getPOList,
    create,
    update,
    remove,
    findByCriteria,
};