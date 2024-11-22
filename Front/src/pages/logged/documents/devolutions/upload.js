// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import '../../../styles/create-update.css';

export default function DevolutionUpload() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [devolution, setDevolution] = useState([]);

    const [devolution_doc, setDevolution_doc] = useState(null);
    const [docSelected, setDocSelected] = useState(null);

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/devolutions/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDevolution(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Confirm devolution
    const uploadDevolution = () => {
        //Alert if there is Empty Fields
        if (devolution_doc === null) {
            alert('Erro, o campo Documento está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/devolutions/create/doc/${id}/${year}`, devolution_doc, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((r) => {
                //console.log(r);
                alert('Devolução salva com sucesso!');
                navigate(`/dmei-sys/documents/devolutions`)
            })
            .catch((e) => {
                //console.log(e);
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel devolution
    const cancelDevolution = () => {
        navigate(`/dmei-sys/documents/devolutions`);
    }

    return(
        <div className="read-one">
            <h1>Devolução</h1>
            <h4>Guardar Documento</h4>

            {devolution !== null ? (
                <Form className="form-create-update">
                    <hr/>
                    <h5><strong>{devolution[0]?.id}</strong></h5>
                    <hr/>
                    
                    <Card color="light" outline>
                        <CardBody>
                            <Label>Documento de Devolução:</Label>
                            <Input
                                placeholder="Documento de Devolução"
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setDevolution_doc(null);
                                        setDocSelected(null);
                                    } else {
                                        const file = event.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        setDevolution_doc(formData);
                                        setDocSelected(event.target.value);
                                    }
                                }}
                            />

                            <hr/>

                            {docSelected ? (
                                <p>Documento carregado! Finalize para salvar o Documento</p>
                            ) : (
                                <p>Carregue o documento de Devolução</p>
                            )}
                        </CardBody>
                        <br/>
                    </Card>

                    <hr/>
                    
                    {docSelected ? (
                        <Button color="success" onClick={uploadDevolution}>Salvar</Button>
                    ) : ("")}
                </Form>
            ) : ('')}

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={cancelDevolution}>Cancelar</Button>
            </Form>
        </div>
    );
};