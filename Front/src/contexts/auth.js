// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    //Login
    const signin = (id, nickname, password, type) => {
        setUser({id, nickname, password, type});
        localStorage.setItem("user", JSON.stringify({id: id, nickname: nickname, password: password, type: type}));
        return;
    }

    useEffect(() => {
        const userSaved = JSON.parse(localStorage.getItem("user"));
        if (user === null) {
            setUser(userSaved);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    //Logout
    const signout = () => {
        setUser(null);
        localStorage.setItem("user", null);
        return;
    }

    return (
        <AuthContext.Provider
            value={{ user, signed: user, signout, signin }}
        >
            {children}
        </AuthContext.Provider>
    );
};
//user