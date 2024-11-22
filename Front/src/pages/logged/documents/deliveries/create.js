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

export default function DeliveryCreateDOC() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [id, setID] = useState("");
    const [machine, setMachine ] = useState(null);
    const [machinesList, setMachinesList] = useState([]);
    const [text_machines, setText_machines] = useState("");
    const [observation, setObservation] = useState("");

    const [entity, setEntity ] = useState({value:null, name:"Nome da Escola...", code:"Código da Escola..."});
    const [entitiesNameList, setEntitiesNameList] = useState([]);
    const [entitiesCodeList, setEntitiesCodeList] = useState([]);

    //Get the Machines and Entity data
    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/entities').then((res) => {
            setEntitiesNameList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.name,
                    code: obj.code,
                    name: obj.name
                }
            }));
            setEntitiesCodeList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.code,
                    code: obj.code,
                    name: obj.name
                }
            }));
        });

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

    //Get the Delivery data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/deliveries/this-year`)
        .then((res) => {
            let date = new Date(Date.now());
            let year = String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
            setID(`GA/DMEI Nº ${(res.data.length + 1)} / ${year} - REE`);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machine]);

    //ADD a Delivery
    const delivery = () => {
        if (entity.value === null) alert('Selecione uma entidade!')
        else if (machine === null && text_machines === "") alert('Selecione ou Digite uma ou mais máquinas!')
        else {
            axios.post("http://10.10.135.100:3002/api/deliveries/create/", {
                id: id,
                id_entity: entity.value,
                text_machines: text_machines,
                observation: observation
            })
            .then((r)=>{
                if (machine !== null) {
                    for (let count = 0; count < machine.length; count++) {
                        axios.post("http://10.10.135.100:3002/api/deliveries/create/item", {
                            id_delivery: id,
                            id_machine: machine[count].value
                        })
                        .then((res)=>{
                            //console.log(res);
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    }
                }
                alert('Entrega Criada!');
                handlePrint();
                navigate(`/dmei-sys/documents/deliveries`);
            })
            .catch((e)=>{
                console.log(e);
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
        navigate(`/dmei-sys/documents/deliveries`);
    };

    return(
        <div className="read-one">
            <h1>Entrega</h1>
            <h5>Recibo</h5>

            <hr/>

            <Card color="light" outline>
                <CardBody>
                    <Label>Entidade:</Label>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <Select
                            options={entitiesNameList}
                            placeholder='Nome da Escola...'
                            defaultValue={{value:entity.value, label:entity.name}}
                            value={{value:entity.value, label:entity.name}}
                            onChange={setEntity}
                        />
                        <p>&nbsp;&nbsp;</p>
                        <Select
                            options={entitiesCodeList}
                            placeholder='Código da Escola...'
                            defaultValue={{value:entity.value, label:entity.code}}
                            value={{value:entity.value, label:entity.code}}
                            onChange={setEntity}
                        />
                    </div>
                    <br/>
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

                            <p><strong>Recibo de Entrega de Equipamento</strong></p>

                            <hr/>

                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Declaro que recebi da GA/DMEI/SEMEC, o&#40;s&#41; sequinte&#40;s&#41; equipamento&#40;s&#41;:
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
                                            setText_machines(event.target.value);
                                        }}
                                    />
                                </Container>
                                O&#40;s&#41; mesmo&#40;s&#41; sendo doado&#40;s&#41; para <strong>{entity.name} - {entity.code}</strong> em 
                                prol de atender as necessidades dos mesmos assim assumindo o compromisso
                                pela guarda e preservação do&#40;s&#41; equipamento&#40;s&#41;.
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
                    onClick={delivery}
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