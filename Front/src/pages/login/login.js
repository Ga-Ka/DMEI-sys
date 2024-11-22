// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

import './login.css';

export default function Login() {
    const { signin, signout } = useAuth();

    const ver = useState(true);

    useEffect(() => {
        signout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ver])

    const navigate = useNavigate();

    const login = () => {
        let nickname = document.getElementById('nickname').value;
        let password = document.getElementById('password').value;

        console.log(nickname, password)

        axios.get('http://10.10.135.100:3002/api/users')
        .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.length; i++) {
                if (nickname === res.data[i].nickname && password === res.data[i].password) {
                    if(res.data[i].id === 1) signin(res.data[i].id, nickname, password, 1); // Usuário ADM
                    else signin(res.data[i].id, nickname, password, 2); // Usuário Comum
                    alert('Você está logado!');
                    navigate(`/dmei-sys/dashboard`);
                    return;
                };
            };
            alert('Usuário ou senha incorretos!');
        })
        .catch((err) => {
            alert('Erro na conexão!');
        });
    };
    const anonymous = () => {
        signin("", "anonymous", "", 3); // Usuário Anônimo
        alert('Você entrou como visitante!');
        navigate(`/dmei-sys/anon/dashboard`);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          login();
        }
    };
    
    const [state, setState] = useState(false);
    useEffect(() => {
        if (state === false) {
            document.getElementById('password').type = 'password';
        } else {
            document.getElementById('password').type = 'text';
        }
    },[state])

    return(
        <div className="login">
            <Form>
                <h1>DMEIsys</h1>
                <hr />
                <Input
                    id="nickname"
                    placeholder="Nickname"
                    onKeyDown={handleKeyDown}>
                </Input>
                <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    onKeyDown={handleKeyDown}>
                </Input>
                <FormGroup switch style={{textAlign:'left'}}>
                    <Input
                    type="switch"
                    defaultChecked={false}
                    onKeyDown={handleKeyDown}
                    onClick={() => {
                        setState(!state);
                    }}
                    />
                    <Label>Mostrar senha</Label>
                </FormGroup>
                <hr />
                <Button color="primary" onClick={login}>Entrar</Button>
            </Form>
            <br/>
            <Button id="anonymous" color="secondary" outline onClick={anonymous}>Entrar como Visitante</Button>
        </div>
    );
};