// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

const useAuth = () => {
    const context = useContext(AuthContext);

    return context;
};

export default useAuth;