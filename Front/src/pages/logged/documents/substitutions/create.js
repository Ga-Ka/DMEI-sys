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

export default function SubstitutionCreateDOC() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [id, setID] = useState("");
    const [machineIn, setMachineIn ] = useState({value:null, label:"Código da Máquina...", model:"Modelo da Máquina...", serial:"Serial da Máquina..."});
    const [machineOut, setMachineOut ] = useState({value:null, label:"Código da Máquina...", model:"Modelo da Máquina...", serial:"Serial da Máquina..."});
    const [responsible, setResponsible] = useState("");
    const [machinesList, setMachinesList] = useState([]);

    const [entity, setEntity ] = useState({value:null, name:"Nome da Escola...", code:"Código da Escola..."});

    //Get the Machines and Entity data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/machines/`)
        .then((res) => {
            setMachinesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.num_serial + '  .  .  .  ' + obj.model,
                    num_serial: obj.num_serial,
                    model: obj.model,
                    entity: obj.id_entities_m,
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machine data
    useEffect(() => {
        if (machineOut){
            axios.get(`http://10.10.135.100:3002/api/entities/${machineOut.entity}`).then((res) => {
                setEntity(res.data?.map((obj) => {
                    return {
                        value: obj.id,
                        label: obj.name,
                        code: obj.code,
                        name: obj.name,
                    }
                }));
                setResponsible(res.data[0]?.name_manager)
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machineOut]);

    //Get the Dispatch data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/substitutions/this-year`)
        .then((res) => {
            let date = new Date(Date.now());
            let year = String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
            setID(`GA/DMEI Nº ${(res.data.length + 1)} / ${year} - SE`);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machineOut]);

    //ADD a Substitution
    const substitution = () => {
        if (machineOut.value === null) alert('Selecione uma máquina para ser substituída!')
        else if (machineIn.value === null) alert('Selecione uma máquina para substituir!')
        else if (machineIn.value === machineOut.value) alert('Uma máquina não pode substituir ela mesma!')
        else if (responsible === "") alert('Informe o nome do responsável!')
        else {
            axios.post("http://10.10.135.100:3002/api/substitutions/create", {
                id: id,
                id_machine_in: machineIn.value,
                id_machine_out: machineOut.value,
                id_entity: machineOut.entity,
                responsible: responsible
            })
            .then((r)=>{
                alert('Substituíção Criada!');
                handlePrint();
                navigate(`/dmei-sys/documents/substitutions`);
            })
            .catch((e)=>{
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
        navigate(`/dmei-sys/documents/substitutions`);
    };

    return(
        <div className="read-one">
            <h1>Substituíção</h1>
            <hr/>

            <Card color="light" outline>
                <CardBody>
                    <Label>Máquina a ser Substituída:</Label>
                    <Select
                        placeholder='Código da Máquina...'
                        options={machinesList}
                        defaultValue={machineOut}
                        value={machineOut}
                        onChange={setMachineOut}
                    />
                    <br/>
                    <Label>Máquina Substituta:</Label>
                    <Select
                        placeholder='Código da Máquina...'
                        options={machinesList}
                        defaultValue={machineIn}
                        value={machineIn}
                        onChange={setMachineIn}
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
                        fontSize:'20px',
                        justifyContent:'center',
                        textAlign:'center'
                    }}>
                        <document>
                            <DocumentHeader/>

                            <Card><strong>{id}</strong></Card>

                            <p><strong>Substituíção de Equipamento</strong></p>

                            <hr/>

                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Declaramos que <strong>{machineOut?.model}</strong> N/S:<strong>{machineOut?.num_serial}</strong> está com defeito, 
                                impossibilitando que o mesmo funcione de maneira correta na {entity[0]?.name} - {entity[0]?.code}. 
                                O equipamento em questão será substituído por <strong>{machineIn?.model}</strong> N/S:<strong>{machineIn?.num_serial}</strong>.
                                
                            </p>
                            <br/>
                            <p style={{textAlign:"left", margin:'0px'}}>
                                Responsável:
                                <Input
                                    style={{
                                        fontFamily: 'Times',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        padding: '1px',
                                        borderRadius: '2px',
                                    }}
                                    value={responsible}
                                    type='text'
                                    onChange={(event) =>{
                                        setResponsible(event.target.value);
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
                    onClick={substitution}
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