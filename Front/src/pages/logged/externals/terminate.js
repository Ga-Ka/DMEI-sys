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

export default function TerminateExternal() {
    const navigate = useNavigate();

    const [ver] = useState("");

    const [external, setExternal] = useState(null);
    const [externalData, setExternalData] = useState([]);

    const [machines, setMachines] = useState([]);
    const [users, setUsers] = useState([]);

    const [service, setService ] = useState(null);

    const [externalsList, setExternalsList] = useState([]);
    

    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/externals/not/terminateds').then((res) => {
            setExternalsList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: 'OSE-' + obj.id
                }
            }));
        });
    },[ver])

    useEffect(() => {
        if (external !== null) {
            axios.get(`http://10.10.135.100:3002/api/externals/${external.value}`).then((res) => {
                setExternalData(res.data);
            });
            axios.get(`http://10.10.135.100:3002/api/externals/${external.value}/machines`)
            .then((res) => {
                setMachines(res.data);
            });
            axios.get(`http://10.10.135.100:3002/api/externals/${external.value}/users`)
            .then((res) => {
                setUsers(res.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[external])

    //Generate PDF?
    const generatePDF = (insertId) => {
        confirmAlert({
            title: 'Documento de Agendamento Externo',
            message: 'Você deseja gerar o PDF?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                    navigate(`/dmei-sys/externals/terminateds/${insertId}/document`);
                    }
                },
                {
                label: 'Não',
                onClick: () => {
                    navigate(`/dmei-sys/externals/terminateds`);
                    }
                },
            ]
        });
    };

    //Confirm Update
    const updateExternal = () => {
        if (service === null) {
            alert("Erro, o campo Serviço Realizado está vazio!");
        }
        else {
            axios.patch(`http://10.10.135.100:3002/api/externals/${external.value}/terminate`, {
                service: service,
            })
            .then((r) => {
                console.log(r.data);
                generatePDF(external.value);
            })
            .catch((e) => {
                alert('Erro de Conexão com o Banco!');
            });
        }
    };

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/externals/terminateds`);
    }

    return(
        <div className="create-update">
            <h1>Finalizar</h1>
            <h4>Agendamento Externo</h4>
            
            <Form className="form-create-update">
                <hr/>
                <Card color="light" outline>
                    <CardBody>
                        <Label>Ordem de Serviço Externo:</Label>
                        <Select
                            options={externalsList}
                            defaultValue={external}
                            value={external}
                            onChange={setExternal}
                        />
                        <br/>
                    </CardBody>
                </Card>

                <br/>

                {externalData?.map((val, key) => {
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
                
                <Button color="success" onClick={updateExternal}>Finalizar</Button>
                <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
            </Form>
        </div>
    );
};