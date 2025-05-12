import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const get = (id) => {
    return http.get(`/jobs/${id}`); 
};

//const getAll = () => {
//    return http.get("/jobs");
//};

const getPO = (id) => {
    return http.get(`/jobs/PO/id=${id}`);
};

const findByCriteria = (status, customer, PO, process) => {
    if (!status == "") status = "/status/" + status;
    else status = "";

    if (!customer == "") {
        if (!PO == "") {
            if (!process == "")
                return http.get(`/jobs${status}/search/customer=${customer}/PO=${PO}/process=${process}`);
            else
                return http.get(`/jobs${status}/search/customer=${customer}/PO=${PO}`);
        } else {
            if (!process == "")
                return http.get(`/jobs${status}/search/customer=${customer}/process=${process}`);
            else
                return http.get(`/jobs${status}/search/customer=${customer}`);
        }
    }
    else {
        if (!PO == "") {
            if (!process == "")
                return http.get(`/jobs${status}/search/PO=${PO}/process=${process}`);
            else
                return http.get(`/jobs${status}/search/PO=${PO}`);
        } else {
            if (!process == "")
                return http.get(`/jobs${status}/search/process=${process}`);
            else return http.get(`/jobs${status}`);
        }
    }
};

const update = (id, data) => {
    return http.put(`/jobs/${id}`, data);
};

const create = (data) => {
    console.log(data);
    return http.post("/jobs", data);
};

const remove = (id) => {
    return http.delete(`/jobs/${id}`);
};


export default {
    //getAll,
    get,
    create,
    update,
    remove,
    getPO,
    findByCriteria,
};