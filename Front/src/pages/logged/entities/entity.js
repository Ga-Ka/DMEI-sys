// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Alert, Label } from "reactstrap";
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin2Line } from "react-icons/ri";

import '../../styles/read-one.css';
import { confirmAlert } from "react-confirm-alert";

export default function Entity() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [entityId] = useState(id);
    const [entityData, setEntityData] = useState([]);

    //Get the user data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/entities/${entityId}`)
        .then((res) => {
            setEntityData(res.data);
        });
    }, [entityId]);

    //Go to update
    const goToUpdate = (id) => {
        navigate(`/dmei-sys/entities/${id}/update`)
    };

    //Delete Entity
    const dialogDelete = (id) => {
        confirmAlert({
            title: 'Confirme a remoção',
            message: 'Você tem certeza?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                        deleteEntity(id);
                        navigate(`/dmei-sys/entities`);
                    }
                },
                {
                label: 'Não'
                }
            ]
        });
    };
    const deleteEntity = (id) => {
        axios.delete(`http://10.10.135.100:3002/api/entities/${id}/delete`)
        .then((res) => {
            alert('Entidade deletada!');
        });
    }

    //Back to Entities Menu
    const goBack = () => {
        navigate(`/dmei-sys/entities`);
    }

    return(
        <div className="read-one">
            <h1>Entidade</h1>

            {entityData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
                        <hr/>

                        <div className="group-columns">
                            <div className="column">
                                <Label>Código: 
                                    <Alert color="secondary">{val.code}</Alert>
                                </Label>

                                <Label>Nome: 
                                    <Alert color="secondary">{val.name}</Alert>
                                </Label>

                                <Label>Telefone: 
                                    <Alert color="secondary">{val.phone}</Alert>
                                </Label>

                                <Label>Diretor: 
                                    <Alert color="secondary">{val.name_manager}</Alert>
                                </Label>

                                <Label>Fone Diretor: 
                                    <Alert color="secondary">{val.phone_manager}</Alert>
                                </Label>
                            </div>
                            <br/>
                            <div className="column">
                                <Label>CEP: 
                                    <Alert color="secondary">{val.cep_adress}</Alert>
                                </Label>

                                <Label>Logradouro: 
                                    <Alert color="secondary">{val.street_adress}</Alert>
                                </Label>

                                <Label>Número: 
                                    <Alert color="secondary">{val.number_adress}</Alert>
                                </Label>

                                <Label>Bairro: 
                                    <Alert color="secondary">{val.district_adress}</Alert>
                                </Label>

                                <Label>Zona: 
                                    <Alert color="secondary">{val.zone_name}</Alert>
                                </Label>
                            </div>
                        </div>
                        <hr/>

                        <Button
                            title="Editar"
                            color="primary"
                            onClick={() => {goToUpdate(val.id)}}>
                                <BiEdit/>
                        </Button>

                        {JSON.parse(localStorage.getItem("user")).type === 1 ? (
                            <Button
                                title="Deletar"
                                color="danger"
                                onClick={() => {dialogDelete(val.id)}}>
                                    <RiDeleteBin2Line/>
                            </Button>
                        ) : (
                            <Button
                                title="Deletar"
                                color="danger"
                                disabled>
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