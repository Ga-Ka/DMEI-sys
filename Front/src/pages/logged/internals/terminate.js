// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import Select from 'react-select';

import '../../styles/create-update.css';

export default function TerminateInternal() {
    const navigate = useNavigate();

    const [ver] = useState("");

    const [internal, setInternal] = useState(null);
    const [internalData, setInternalData] = useState([]);

    const [machines, setMachines] = useState([]);
    const [users, setUsers] = useState([]);

    const [service, setService ] = useState(null);

    const [internalsList, setInternalsList] = useState([]);
    

    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/internals/not/terminateds').then((res) => {
            setInternalsList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: 'OSI-' + obj.id
                }
            }));
        });
    },[ver])

    useEffect(() => {
        if (internal !== null) {
            axios.get(`http://10.10.135.100:3002/api/internals/${internal.value}`).then((res) => {
                setInternalData(res.data);
            });
            axios.get(`http://10.10.135.100:3002/api/internals/${internal.value}/machines`)
            .then((res) => {
                setMachines(res.data);
            });
            axios.get(`http://10.10.135.100:3002/api/internals/${internal.value}/users`)
            .then((res) => {
                setUsers(res.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[internal])

    //Generate PDF?
    const generatePDF = (insertId) => {
        confirmAlert({
            title: 'Documento de Serviço Interno',
            message: 'Você deseja gerar o PDF?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                    navigate(`/dmei-sys/internals/terminateds/${insertId}/document`);
                    }
                },
                {
                label: 'Não',
                onClick: () => {
                    navigate(`/dmei-sys/internals/terminateds`);
                    }
                },
            ]
        });
    };

    //Confirm Update
    const updateInternal = () => {
        if (service === null) {
            alert("Erro, o campo Serviço Realizado está vazio!");
        }
        else {
            axios.patch(`http://10.10.135.100:3002/api/internals/${internal.value}/terminate`, {
                service: service,
            })
            .then((r) => {
                console.log(r.data);
                generatePDF(internal.value);
            })
            .catch((e) => {
                alert('Erro de Conexão com o Banco!');
            });
        }
    };

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/internals/terminateds`);
    }

    return(
        <div className="create-update">
            <h1>Finalizar</h1>
            <h4>Serviço Internos</h4>
            
            <Form className="form-create-update">
                <hr/>
                <Card color="light" outline>
                    <CardBody>
                        <Label>Ordem de Serviço Interno:</Label>
                        <Select
                            options={internalsList}
                            defaultValue={internal}
                            value={internal}
                            onChange={setInternal}
                        />
                        <br/>
                    </CardBody>
                </Card>

                <br/>

                {internalData?.map((val, key) => {
                    return (
                        <FormGroup key={key}>
                            <Form className="form-read-one">
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
                                </div>
                            </Form>

                            <Label>Serviço Realizado:</Label>
                            <Input
                                defaultValue={val.service_performed}
                                placeholder="Serviço Realizado..."
                                type='textarea'
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setService(null);
                                    } else {
                                        setService(event.target.value);
                                    }
                                }}
                            />
                        </FormGroup>
                    )
                })}
                <hr/>
                
                <Button color="success" onClick={updateInternal}>Finalizar</Button>
                <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
            </Form>
        </div>
    );
};