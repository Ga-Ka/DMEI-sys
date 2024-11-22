// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Form, Card } from "reactstrap";
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function Substitution() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [substitution, setSubstitution] = useState([]);
    const [machineIn, setMachineIn] = useState([]);
    const [machineOut, setMachineOut] = useState([]);
    const [entity, setEntity] = useState([]);

    //Get the Substitution data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/substitutions/${id}/${year}`)
        .then((res) => {
            console.log(res.data);
            setSubstitution(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/machines/${substitution[0]?.id_machine_in_sub}`)
        .then((res) => {
            //console.log(res.data);
            setMachineIn(res.data);
        });
        axios.get(`http://10.10.135.100:3002/api/machines/${substitution[0]?.id_machine_out_sub}`)
        .then((res) => {
            //console.log(res.data);
            setMachineOut(res.data);
        });
        axios.get(`http://10.10.135.100:3002/api/entities/${substitution[0]?.id_entities_sub}`)
        .then((res) => {
            //console.log(res.data);
            setEntity(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [substitution]);

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

                            <Card><strong>{substitution[0]?.id}</strong></Card>

                            <p><strong>Substituíção de Equipamento</strong></p>

                            <hr/>

                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Declaramos que <strong>{machineOut[0]?.model}</strong> N/S:<strong>{machineOut[0]?.num_serial}</strong> está com defeito, 
                                impossibilitando que o mesmo funcione de maneira correta na <strong>{entity[0]?.name} - {entity[0]?.code}</strong>. 
                                O equipamento em questão será substituído por <strong>{machineIn[0]?.model}</strong> N/S:<strong>{machineIn[0]?.num_serial}</strong>.
                                
                            </p>
                            <br/>
                            <p style={{textAlign:"left", margin:'0px'}}>
                                Responsável:
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{substitution[0]?.responsible}</strong></Card>
                            </p>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(substitution[0]?.date);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>
                            <hr/>
                            
                            <br/><br/>
                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {substitution[0]?.date.slice(0,4)}
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
                    onClick={handlePrint}
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