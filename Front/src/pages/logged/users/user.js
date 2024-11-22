// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import useAuth from '../../../contexts/useAuth.js';

import { Button, Form, Alert, Label, Input } from "reactstrap";
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin2Line } from "react-icons/ri";

import '../../styles/read-one.css';
import { confirmAlert } from "react-confirm-alert";

export default function User() {
    const { signed, signout } = useAuth();
    const navigate = useNavigate();

    const userPassword = JSON.parse(localStorage.getItem("user")).password;

    const {id} = useParams();
    const [userId] = useState(id);
    const [userData, setUserData] = useState([]);

    //Get the user data AND Check the Permission
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user")).id === Number(userId) || JSON.parse(localStorage.getItem("user")).type === 1) {
            axios.get(`http://10.10.135.100:3002/api/users/${userId}`)
            .then((res) => {
                setUserData(res.data);
            })
        } else {
            alert('Você não tem permissão para entrar nessa página!');
            navigate(`/dmei-sys/users`);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    //Go to update
    const dialogUpdate= (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                  <div className='react-confirm-alert-body'>
                    <h1>Editar Dados</h1>
                    <p>Para alterar dados sensíveis, confirme sua senha:</p>
                    <Input
                        id="password"
                        placeholder="Senha"
                        type="text"
                    />
                    <hr/>
                    <p>Ir para edição de dados?</p>
                    <div className="react-confirm-alert-button-group">
                        <button
                        onClick={() => {
                            if (document.getElementById('password').value === userPassword) {
                                goToUpdate(id);
                                onClose();
                            } else {
                                alert('Senha Incorreta!');
                                onClose();
                            }
                        }}
                        >
                        Sim, Editar
                        </button>
                        <button onClick={onClose}>Não, Cancelar</button>
                    </div>
                  </div>
                );
            }
        });
    };
    const goToUpdate = (id) => {
        navigate(`/dmei-sys/users/${id}/update`)
    };

    //Delete User
    const dialogDelete = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                  <div className='react-confirm-alert-body'>
                    <h1>Confirme a Remoção</h1>
                    <p>Para deletar dados sensíveis, confirme sua senha:</p>
                    <Input
                        id="password"
                        placeholder="Senha"
                        type="text"
                    />
                    <hr/>
                    <p>Você tem certeza que quer deletar?</p>
                    <div className="react-confirm-alert-button-group">
                        <button
                        onClick={() => {
                            if (document.getElementById('password').value === userPassword) {
                                deleteUser(id);
                                onClose();
                            } else {
                                alert('Senha Incorreta!');
                                onClose();
                            }
                        }}
                        >
                        Sim, Deletar
                        </button>
                        <button onClick={onClose}>Não, Cancelar</button>
                    </div>
                  </div>
                );
            }
        });
    };
    const deleteUser = (id) => {
        if (id === signed.id) {
            axios.delete(`http://10.10.135.100:3002/api/users/${id}/delete`)
            .then((res) => {
                alert('Seu Usuário foi Deletado!');
                signout();
            });
        } else {
            axios.delete(`http://10.10.135.100:3002/api/users/${id}/delete`)
            .then((res) => {
                alert('Usuário Deletado!');
            });
        }
    }

    //Back to Users Menu
    const goBack = () => {
        navigate(`/dmei-sys/users`);
    }

    return(
        <div className="read-one">
            <h1>Usuário</h1>

            {userData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
                        <hr/>

                        <div className='column'>
                            <Label>Nome de Usuário: 
                                <Alert color="secondary">{val.nickname}</Alert>
                            </Label>

                            <Label>Senha: 
                                <Alert color="secondary">• • • • • • • • • •</Alert>
                            </Label>

                            <Label>Nome Completo: 
                                <Alert color="secondary">{val.realname}</Alert>
                            </Label>

                            <Label>Matrícula: 
                                <Alert color="secondary">{val.registration}</Alert>
                            </Label>
                        </div>
                        <hr/>

                        <Button
                            title="Editar"
                            color="primary"
                            onClick={() => {dialogUpdate(val.id)}}>
                                <BiEdit/>
                        </Button>

                        {JSON.parse(localStorage.getItem("user")).type !== 1 ? (
                            <Button
                                color="danger"
                                disabled
                            >
                                <RiDeleteBin2Line/>
                            </Button>
                        ) : val.id === 1 ? (
                            <Button
                                color="danger"
                                disabled
                            >
                                <RiDeleteBin2Line/>
                            </Button>
                        ) : (
                            <Button
                                title="Deletar"
                                color="danger"
                                onClick={() => {dialogDelete(val.id)}}
                            >
                                    <RiDeleteBin2Line/>
                            </Button>
                        )}
                        
                        <Button color="secondary" onClick={goBack}>Voltar</Button>
                    </Form>
                )
            })}
        </div>
    );
};