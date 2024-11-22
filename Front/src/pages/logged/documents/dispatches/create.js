// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

import { Button, Form, Card, Input, CardBody, Label, Col, Container, Row } from "reactstrap";
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function DispatchCreateDOC() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [id, setID] = useState("");
    const [machine, setMachine ] = useState(null);
    const [machinesList, setMachinesList] = useState([]);
    const [observation, setObservation ] = useState("");

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/machines/`)
        .then((res) => {
            setMachinesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.num_serial + '  .  .  .  ' + obj.model,
                    model: obj.model,
                    num_serial: obj.num_serial
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Dispatch data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/dispatches/this-year`)
        .then((res) => {
            let date = new Date(Date.now());
            let year = String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
            setID(`GA/DMEI Nº ${(res.data.length + 1)} / ${year} - MD`);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machine]);

    //ADD a Dispatch
    const dispatch = () => {
        if (machine === null) alert('Selecione uma ou mais máquinas!') 
        else {
            axios.post("http://10.10.135.100:3002/api/dispatches/create/", {
                id: id,
                observation: observation
            })
            .then((r)=>{
                for (let count = 0; count < machine.length; count++) {
                    axios.post("http://10.10.135.100:3002/api/dispatches/create/item", {
                        id_dispatch: id,
                        id_machine: machine[count].value
                    })
                    .then((res)=>{
                        //console.log(res);
                    })
                    .catch((err)=>{
                        //console.log(err);
                    })
                }
                alert('Despacho Criado!');
                handlePrint();
                navigate(`/dmei-sys/documents/dispatches`);
            })
            .catch((e)=>{
                console.log(e)
                alert('Erro de Conexão com o Banco!');
            })
        }
    }

    //Print Document
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //Go Back
    const goBack = () => {
        navigate(`/dmei-sys/documents/dispatches`);
    };

    return(
        <div className="read-one">
            <h1>Despacho</h1>
            <h5>Memorando</h5>

            <hr/>

            <Card color="light" outline>
                <CardBody>
                    <Label>Adicionar Máquina&#40;s&#41;:</Label>
                    <Select
                        placeholder='Código da Máquina...'
                        options={machinesList}
                        defaultValue={machine}
                        value={machine}
                        onChange={setMachine}
                        isMulti
                    />
                </CardBody>
                <br/>
            </Card>

            <Form className="form-read-one">
                <hr/>

                <div id="DocumentPDF" ref={componentRef}
                    style={{
                        width:'100%',
                        height:'auto',
                        background:'white',
                        padding:'30px 80px',
                        fontFamily:'Times',
                        fontSize:'16px',
                        justifyContent:'center',
                        textAlign:'center'
                    }}>
                        <document>
                            <DocumentHeader/>

                            <Card><strong>{id}</strong></Card>

                            <p><strong>Memorando</strong></p>

                            <hr/>

                            <p style={{textAlign:"left", margin:'0px'}}>
                                Da: Gerência de Administração - GA
                                <br/>
                                Para: <Input />
                                <br/>
                                Assunto: Material em desuso
                            </p>

                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Estamos encaminhando os materiais abaixo, para armazenamento ou outros fins neste depósito.
                                <Container style={{padding:'0px'}}>
                                    <Row xs={3}>
                                        {machine?.map((val, key) => {
                                            return (
                                                <Col style={{padding:'1px'}}>
                                                    <Card key={key}
                                                        style={{
                                                            fontFamily: 'Times',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            padding: '1px',
                                                            borderRadius: '2px',
                                                        }}
                                                    >
                                                        {val.model}
                                                        <br/>
                                                        N/S: {val.num_serial}
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Container>
                            </p>
                            <br/>
                            <p style={{textAlign:"left", margin:'0px'}}>
                                Observação:
                                <Input
                                    style={{
                                        fontFamily: 'Times',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        padding: '1px',
                                        borderRadius: '2px',
                                    }}
                                    type='textarea'
                                    onChange={(event) =>{
                                        setObservation(event.target.value);
                                    }}
                                />
                            </p>
                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Segue devolução dos mesmos materiais que está&#40;ão&#41; 
                                em desuso, e não terão mais utilidade para o setor DMEI.
                            </p>
                            <br/>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    let date = new Date(Date.now());
                                                    return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
                                                })()}
                                            </strong>
                            <hr/>
                            
                            <br/><br/>
                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {(() => {
                                                                                    let date = new Date(Date.now());
                                                                                    return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
                                                                                })()}
                            </p>

                            <br/><br/>
                            <line>____________________________________</line>
                            <p>Assinatura Recebedora</p>

                            <br/><br/>
                            <line>____________________________________</line>
                            <p>Assinatura Setor DMEI</p>
                        </document>
                </div>
                
                <hr/>

                <Button color="success"
                    onClick={dispatch}
                >
                    Imprimir <GrDocumentDownload/>
                </Button>
            </Form>

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={goBack}>Voltar</Button>
            </Form>
        </div>
    );
}