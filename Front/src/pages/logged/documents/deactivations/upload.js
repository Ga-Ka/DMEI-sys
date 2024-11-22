// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import '../../../styles/create-update.css';

export default function DeactivationUpload() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [deactivation, setDeactivation] = useState([]);

    const [deactivation_doc, setDeactivation_doc] = useState(null);
    const [docSelected, setDocSelected] = useState(null);

    //Get the Deactivation data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/deactivations/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDeactivation(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Confirm Deactivate
    const deactivateMachine = () => {
        //Alert if there is Empty Fields
        if (deactivation_doc === null) {
            alert('Erro, o campo Documento está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/deactivations/create/doc/${id}/${year}`, deactivation_doc, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((r) => {
                //console.log(r);
                axios.patch(`http://10.10.135.100:3002/api/machines/${deactivation[0].id_machine_d}/deactivate`)
                .then((r) => {
                    alert('Desativado com sucesso!');
                    navigate(`/dmei-sys/documents/deactivations`)
                })
                .catch((e) => {
                    alert('Erro de Conexão com o Banco!');
                });
            })
            .catch((e) => {
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel Deactivate
    const cancelDeactivate = () => {
        navigate(`/dmei-sys/documents/deactivations`);
    }

    return(
        <div className="read-one">
            <h1>Desativação</h1>
            <h4>Guardar Laudo</h4>

            <hr/>

            {deactivation !== null ? (
                <Form className="form-create-update">
                    <hr/>
                    <h5><strong>{deactivation[0]?.id}</strong></h5>
                    <hr/>
                    
                    <Card color="light" outline>
                        <CardBody>
                            <Label>Laudo de Desativação:</Label>
                            <Input
                                placeholder="Laudo de Desativação"
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setDeactivation_doc(null);
                                        setDocSelected(null);
                                    } else {
                                        const file = event.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        setDeactivation_doc(formData);
                                        setDocSelected(event.target.value);
                                    }
                                }}
                            />

                            <hr/>

                            {docSelected ? (
                                <p>Documento carregado! Finalize para desativar a Máquina</p>
                            ) : (
                                <p>Carregue o Laudo de Desativação para liberar a Desativação da Máquina</p>
                            )}
                        </CardBody>
                        <br/>
                    </Card>

                    <hr/>
                    
                    {docSelected ? (
                        <Button color="danger" onClick={deactivateMachine}>Finalizar</Button>
                    ) : ("")}
                </Form>
            ) : ('')}

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={cancelDeactivate}>Cancelar</Button>
            </Form>
        </div>
    );
};