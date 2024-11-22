// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import { Alert, Button, Card, Col, Container, Form, Input, Label, Row } from "reactstrap";
import { BiEdit } from 'react-icons/bi';
import { GrDocumentPdf, GrDocumentDownload, GrDocumentUpload } from 'react-icons/gr';
import { RiDeleteBin2Line } from 'react-icons/ri';

import '../../styles/read-one.css';

export default function Internal() {
    const navigate = useNavigate();
    const [ver, setVer] = useState(true);

    const {id} = useParams();
    const [internalId] = useState(id);
    const [internalData, setInternalData] = useState([]);

    const [machines, setMachines] = useState([]);
    const [users, setUsers] = useState([]);

    const [doc, setDoc] = useState(null);
    const [docSelected, setDocSelected] = useState(null);

    //Get the user data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/internals/${internalId}`)
        .then((res) => {
            setInternalData(res.data);
        });
        axios.get(`http://10.10.135.100:3002/api/internals/${internalId}/machines`)
        .then((res) => {
            setMachines(res.data);
        });
        axios.get(`http://10.10.135.100:3002/api/internals/${internalId}/users`)
        .then((res) => {
            setUsers(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, ver]);

    //Save Document
    const saveDocument = () => {
        //Alert if there is Empty Fields
        if (doc === null) {
            alert('Erro, o campo Documento está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/internals/upload/doc/${id}`, doc, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((r)=>{
                alert('Documento assinado salvo com sucesso!');
                setVer(!ver);
                //console.log(r.data);
            })
            .catch((e)=>{
                alert('Erro de Conexão com o Banco!');
                //console.log(e);
            })
        }
    }

    //Download Report
    async function downloadDoc(documentPath) {
        const documentName = documentPath.split('/')[3];
        console.log(documentName);

        axios.get(`http://10.10.135.100:3002/api/internals/open/doc/?fileName=${encodeURIComponent(documentName)}`, {
            responseType: 'blob',
        })
        .then((res) => {
            console.log(res);
    
            const blob = new Blob([res.data], { type: 'application/pdf' });
            
            const url = document.createElement('a');
            url.href = URL.createObjectURL(blob);
            console.log(url);
            window.open(url, '_blank');

            URL.revokeObjectURL(url.href);
        })
        .catch((err) => {
            console.error('Erro ao fazer o download do arquivo:', err);
            alert('Erro de Conexão com o Banco!');
        })
    };

    //Delete Document
    const removeDialog = () => {
        confirmAlert({
            title: 'Confirme a remoção',
            message: 'Você tem certeza que quer remover um documento assinado?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                        removeDocument();
                        setDocSelected(null);
                    }
                },
                {
                label: 'Não'
                }
            ]
        });
    };
    //Remove Document
    const removeDocument = () => {
        axios.delete(`http://10.10.135.100:3002/api/internals/delete/doc/${id}`)
        .then((r)=>{
            setVer(!ver);
            alert('Documento removido!');
            //console.log(r);
        })
        .catch((e)=>{
            alert('Erro de Conexão com o Banco!');
            //console.log(e);
        })
    }

    //Go to update
    const goToUpdate = (id) => {
        navigate(`/dmei-sys/internals/${id}/update`)
    };

    //Back to Entities Menu
    const goBack = () => {
        navigate(`/dmei-sys/internals`);
    }

    return(
        <div className="read-one">
            <h1>Serviço Interno</h1>

            {internalData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>
                        <h5>OSI: <strong>{val.id}</strong></h5>
                        <hr/>

                        <div className="column">
                            <Card color="light" outline>
                                <Label>Entidade: 
                                    <Alert color="secondary">{val.entity_name}</Alert>
                                </Label>

                                <Label>Máquina&#40;s&#41;:
                                    <Container style={{padding:'0px'}}>
                                        <Row xs={2}>
                                            {machines?.map((val, key) => {
                                                return (
                                                    <Col style={{padding:'5px'}}>
                                                        <Alert color="secondary" key={key}>
                                                            {val.model}
                                                            <br/>
                                                            N/S: {val.num_serial}
                                                        </Alert>
                                                    </Col>
                                                )
                                            })}
                                        </Row>

                                        {val.text_machines !== null ? (
                                            <Alert color="secondary">{val.text_machines}</Alert>
                                        ) : ('')}
                                    </Container>
                                </Label>

                                <Label>Solicitante:
                                    {val.requester !== null ? (
                                        <Alert color="secondary">{val.requester}</Alert>
                                    ) : ('')}
                                </Label>
                            </Card>
                            
                            <br/>

                            <Card color="light" outline>
                                <Label>Técnico&#40;s&#41;:
                                    <Container style={{padding:'0px'}}>
                                        <Row xs={2}>
                                            {users?.map((val, key) => {
                                                return (
                                                    <Col style={{padding:'5px'}}>
                                                        <Alert color="secondary" key={key}>
                                                            {val.nickname}
                                                        </Alert>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Container>
                                </Label>
                            </Card>

                            <div className="group-columns">
                                <div className="column">
                                    <Label>Data de Entrada: 
                                        <Alert color="secondary">
                                            {(() => {
                                                const date = new Date(val.date_input);
                                                const offset = date.getTimezoneOffset();
                                                date.setMinutes(date.getMinutes() - offset);
                                                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                            })()}
                                        </Alert>
                                    </Label>
                                </div>
                                <br/>
                                <div className="column">
                                    {val.date_exit ? (
                                        <Label>Data de Saída: 
                                            <Alert color="secondary">
                                                {(() => {
                                                    const date = new Date(val.date_exit);
                                                    const offset = date.getTimezoneOffset();
                                                    date.setMinutes(date.getMinutes() - offset);
                                                    return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                })()}
                                            </Alert>
                                        </Label>
                                    ) : (
                                        <Label>Data Agendada: 
                                            <Alert color="secondary">
                                                {(() => {
                                                    const date = new Date(val.date_schedule);
                                                    const offset = date.getTimezoneOffset();
                                                    date.setMinutes(date.getMinutes() - offset);
                                                    return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                })()}
                                            </Alert>
                                        </Label>
                                    )}
                                </div>
                            </div>

                            <Label>Problema: 
                                <Alert color="secondary">{val.problem}</Alert>
                            </Label>

                            <Label>Comentário: 
                                <Alert color="secondary">{val.comment}</Alert>
                            </Label>

                            {val.service_performed ? (
                                <Label>Serviço: 
                                    <Alert color="secondary">{val.service_performed}</Alert>
                                </Label>
                            ) : ('')}
                        </div>

                        <hr/>
                        {val.date_exit ? (
                            <>
                            <p>Documento &#40;Assinado&#41;</p>

                            {!val.document ? (
                                <>
                                <Input
                                    placeholder="Laudo de Saída"
                                    type="file"
                                    name="file"
                                    accept="application/pdf"
                                    onChange={(event) =>{
                                        if (!event.target.value === true) {
                                            setDoc(null);
                                            setDocSelected(null);
                                        } else {
                                            const file = event.target.files[0];
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            setDoc(formData);
                                            setDocSelected(event.target.value);
                                        }
                                    }}
                                />
                                {docSelected ? (
                                    <Button color="light"
                                        title="Guardar Documento"
                                        onClick={saveDocument}
                                    >
                                        Salvar <GrDocumentUpload/>
                                    </Button>
                                ):(
                                    <Button color="light"
                                        title="Guardar Documento"
                                        disabled
                                    >
                                        Salvar <GrDocumentUpload/>
                                    </Button>
                                )}
                                </>
                            ):('')}

                            {val.document? (
                                <>
                                <Button color="success"
                                    onClick={() => downloadDoc(val.document)}
                                >
                                    Abrir Documento <GrDocumentDownload/>
                                </Button>
                                <Button color="danger"
                                    onClick={removeDialog}>
                                    <RiDeleteBin2Line/>
                                </Button>
                                </>
                            ):('')}

                            <hr/>
                            </>
                        ):('')}

                        <Button
                            title="Editar"
                            color="primary"
                            onClick={() => {goToUpdate(val.id)}}>
                                <BiEdit/>
                        </Button>

                        {val.date_exit && !val.document ? (
                            <Button color="warning"
                                onClick={() => {navigate('document')}}>
                                Documento <GrDocumentPdf/>
                            </Button>
                        ) : ("")}

                        <Button color="secondary" onClick={goBack}>Voltar</Button>
                    </Form>
                )
            })}
        </div>
    );
};