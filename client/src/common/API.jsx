/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api`;


//api call interrface

const APICall = async (endpoint, method = "GET", body = undefined, headers = undefined, expectResponse = true) => {
    let errors = [];

    try {
        const response = await fetch(SERVER_BASE + endpoint, {
            method,
            body,
            headers,
            credentials: "include"
        });

        if (response.ok) {
            if (expectResponse) return await response.json();
        }
    } catch {
        const err = ["Failed to contact the server"];
        throw err;
    }

    if (errors.length !== 0)
        throw errors;
};


//auth

const logIn = async (credentials) => await APICall(
    '/session',
    'POST',
    JSON.stringify(credentials),
    {
        'Content-Type': 'application/json',
    }
);

const logOut = async () => await APICall(
    "/session/current",
    "DELETE",
    undefined,
    undefined,
    false
);

//const getUserInfo = async () => await APICall('/sessions/current');



// get all pages
const fetchPages = async () => await APICall('/frontoffice/pages')


// get all pages backOffice
const fetchPagesBackOffice = async () => await APICall('/backoffice/pages')

//get page by id FrontOffice
const fetchFrontOfficePage = async (id) => await APICall(`/frontoffice/pages/${id}`);

//get page by id BackOffice
const fetchBackOfficePage = async (id) => await APICall(`/backoffice/pages/${id}`);

// get all authors
const fetchAuthors = async () => await APICall('/backoffice/authors');

// get all images infos
const fetchImages = async () => await APICall('/backoffice/images');

// edit admin
//const EditAdmin = async (id, pageUpdateAdmin) => await APICall(`/backoffice/pages/${id}/admin`, 'POST', pageUpdateAdmin);




//update page generic

const UpdatePageGeneric = async (id, content) =>{ await APICall(
    `/backoffice/pages/${id}`,
    'POST',
    JSON.stringify(content),
    {
        'Content-Type': 'application/json',
    }
)};


//update page amdin

/*const UpdatePageAdmin = async (id, pageUpdate) => await APICall(
    `/backoffice/pages/${id}/admin`,
    'POST',
    JSON.stringify(pageUpdate),
    {
        'Content-Type': 'application/json',
    }
);*/


//update page amdin

const CreatePage = async (page) => {
    await APICall(
    `/backoffice/pages`,
    'POST',
    JSON.stringify(page),
    {
        'Content-Type': 'application/json',
    }
)};


//delete page

const DeletePage = async (id) =>{ await APICall(
    `/backoffice/pages/${id}`,
    'DELETE',
    undefined,
    undefined,
    false
)};


const API = {
    fetchPages,
    fetchFrontOfficePage,
    logIn,
    //getUserInfo,
    logOut,
    fetchBackOfficePage,
    fetchAuthors,
    //EditAdmin,
    UpdatePageGeneric,
    //UpdatePageAdmin,
    CreatePage,
    DeletePage,
    fetchPagesBackOffice,
    fetchImages
}

export default API;