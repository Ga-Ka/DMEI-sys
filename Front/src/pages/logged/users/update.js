// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import useAuth from '../../../contexts/useAuth.js';

import { Button, Form, Input, Label } from "reactstrap";

import '../../styles/create-update.css';

export default function UpdateUser() {
    const { signed } = useAuth();
    const navigate = useNavigate();

    const {id} = useParams();
    const [userId] = useState(id);
    const [userData, setUserData] = useState([]);

    const [nickname, setNickname ] = useState(null);
    const [password, setPassword ] = useState(null);
    const [realname, setRealname ] = useState(null);
    const [registration, setRegistration ] = useState(null);    

    //Get the user data
    useEffect(() => {
        // eslint-disable-next-line
        if (JSON.parse(localStorage.getItem("user")).id == userId || JSON.parse(localStorage.getItem("user")).type === 1) {
            axios.get(`http://10.10.135.100:3002/api/users/${userId}`)
            .then((res) => {
                setUserData(res.data);

                setNickname(res.data[0].nickname);
                setPassword(res.data[0].password);
                setRealname(res.data[0].realname);
                setRegistration(res.data[0].registration);
            });
        } else {
            navigate(`/dmei-sys/users`);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    //Confirm update
    const updateUser = () => {
        axios.patch(`http://10.10.135.100:3002/api/users/${id}/update`,{
            nickname: nickname,
            password: password,
            realname: realname,
            registration: registration,
        })
        .then(function (r) {
            if (r.data.code === 'ER_DUP_ENTRY') {
                alert('Erro, nickname já cadastrado!');
            } else {
                console.log(id + " + " + signed.id);
                if (id === String(signed.id)) {
                    console.log('Teste');
                    localStorage.setItem("user", JSON.stringify({id: Number(id), nickname: nickname, password: password, registration: registration, type: 1}));
                }
                alert('Atulizado!');
                navigate(`/dmei-sys/users`);
            }
        })
        .catch(function (e) {
            alert('Erro!');
        });
    };

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/users/${id}`);
    }

    return(
        <div className="create-update">
            <h1>Atualizar</h1>
            <h4>Usuário</h4>

            {userData?.map((val, key) => {
                return (
                    <Form className="form-create-update" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
                        <hr/>

                        <Label>Nome de Usuário:</Label>
                        <Input
                            defaultValue={val.nickname}
                            placeholder="Nome de Usuário"
                            type='text'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setNickname(null);
                                } else {
                                    setNickname(event.target.value);
                                }
                            }}
                        />
                        <Label>Senha:</Label>
                        <Input
                            defaultValue={val.password}
                            placeholder="Senha"
                            type='text'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setPassword(null);
                                } else {
                                    setPassword(event.target.value);
                                }
                            }}
                        />
                        <Label>Nome Completo:</Label>
                        <Input
                            defaultValue={val.realname}
                            placeholder="Nome Completo"
                            type='text'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setRealname(null);
                                } else {
                                    setRealname(event.target.value);
                                }
                            }}
                        />
                        <Label>Matrícula:</Label>
                        <Input
                            defaultValue={val.registration}
                            placeholder="Matrícula"
                            type='text'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setRegistration(null);
                                } else {
                                    setRegistration(event.target.value);
                                }
                            }}
                        />
                        <br/>
                        <hr/>
                        
                        <Button color="primary" onClick={updateUser}>Atualizar</Button>
                        <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
                    </Form>
                )
            })}
        </div>
    );
};