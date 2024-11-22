// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

import { Button, Form, Card, Input, CardBody, Label } from "reactstrap";
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function DeactivationCreateDOC() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [id, setID] = useState("");
    const [machine, setMachine ] = useState("");
    const [problem, setProblem ] = useState("");
    const [machinesList, setMachinesList] = useState([]);

    const [machineData, setMachineData] = useState(null);

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/machines/activateds`)
        .then((res) => {
            setMachinesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: 'N/S: ' + obj.num_serial + '  .  .  .  ' + obj.model,
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/deactivations/this-year`)
        .then((res) => {
            let date = new Date(Date.now());
            let year = String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
            setID(`GA/DMEI Nº ${(res.data.length + 1)} / ${year} - PT`);
        });

        axios.get(`http://10.10.135.100:3002/api/machines/${machine.value}`)
        .then((res) => {
            setMachineData(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machine]);

    //ADD a Deactivation
    const deactivate = () => {
        if (machine === "" || machine === null) alert('Informe a Máquina a ser desativada!')
        else if (problem === "" || problem === " ") alert('Informe o problema!')
        else{
            axios.post("http://10.10.135.100:3002/api/deactivations/create/", {
                id: id,
                machine: machine.value,
                problem: problem
            })
            .then((res)=>{
                alert('Desativação Criada!');
                handlePrint();
                navigate(`/dmei-sys/documents/deactivations`);
            })
            .catch((err)=>{
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
        navigate(`/dmei-sys/documents/deactivations`);
    };

    return(
        <div className="read-one">
            <h1>Desativação</h1>
            <h5>Parecer Técnico</h5>

            <hr/>

            <Card color="light" outline>
                <CardBody>
                    <Label>Máquina:</Label>
                    <Select
                        placeholder='Código da Máquina...'
                        options={machinesList}
                        defaultValue={machine}
                        value={machine}
                        onChange={setMachine}
                    />
                </CardBody>
                <br/>
            </Card>

            {machineData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>

                        <div id="DocumentPDF" ref={componentRef}
                            style={{
                                width:'100%',
                                height:'auto',
                                background:'white',
                                padding:'30px 80px',
                                fontFamily:'Times',
                                fontSize:'20px',
                                justifyContent:'center',
                                textAlign:'center'
                            }}>
                                <document>
                                    <DocumentHeader/>

                                    <Card><strong>{id}</strong></Card>

                                    <p><strong>Parecer Técnico</strong></p>

                                    <hr/>
                                    <br/><br/>
                                    <p style={{textAlign:"justify", margin:'0px'}}>
                                        Declaramos que o&#40;a&#41; <strong>{val.model} N/S:{val.num_serial}</strong> está
                                        danificado&#40;a&#41; e sem possibilidade de reparo, impossibilitando, assim, o funcionamento da mesma.
                                        Tendo em vista que não temos substitutos adequados para suprir a necessidade
                                        da <strong>{val.entities_name} / Cód: {val.entities_code}</strong> deve-se, assim, substituir a máquina por outro equipamento.
                                        Mediante isto, reiteramos a solicitação em caráter de necessidade de um novo substituto para continuar as
                                        atividades no setor.
                                    </p>
                                    <br/>
                                    <p>
                                        Problema:
                                        <Input
                                            style={{
                                                fontFamily: 'Times',
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                padding: '1px',
                                                borderRadius: '2px',
                                            }}
                                            type='textarea'
                                            onChange={(event) =>{
                                                setProblem(event.target.value);
                                            }}
                                        />
                                    </p>
                                    <br/><br/>
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
                                    <p>Assinatura do Recebedor</p>

                                    <br/><br/>
                                    <line>____________________________________</line>
                                    <p>Assinatura Setor DMEI</p>
                                </document>
                        </div>
                        
                        <hr/>

                        <Button color="success"
                            onClick={deactivate}
                        >
                            Imprimir <GrDocumentDownload/>
                        </Button>
                    </Form>
                )
            })}

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={goBack}>Voltar</Button>
            </Form>
        </div>
    );
}