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

export default function Deactivation() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [deactivation, setDeactivation] = useState([]);
    const [machine, setMachine] = useState([]);
    const [entity, setEntity] = useState([]);

    //Get the Deactivation data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/deactivations/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDeactivation(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/machines/${deactivation[0]?.id_machine_d}`)
        .then((res) => {
            //console.log(res.data);
            setMachine(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deactivation]);

    //Get the Entity data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/entities/${machine[0]?.id_entities_m}`)
        .then((res) => {
            //console.log(res.data);
            setEntity(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machine]);

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

                            <Card><strong>{deactivation[0]?.id}</strong></Card>

                            <p><strong>Parecer Técnico</strong></p>

                            <hr/>
                            <br/><br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Declaramos que o&#40;a&#41; <strong>{machine[0]?.model} N/S:{machine[0]?.num_serial}</strong> está
                                danificado&#40;a&#41; e sem possibilidade de reparo, impossibilitando, assim, o funcionamento da mesma.
                                Tendo em vista que não temos substitutos adequados para suprir a necessidade
                                da <strong>{entity[0]?.name} / Cód: {entity[0]?.code}</strong> deve-se, assim, substituir a máquina por outro equipamento.
                                Mediante isto, reiteramos a solicitação em caráter de necessidade de um novo substituto para continuar as
                                atividades no setor.
                            </p>
                            <br/>
                            <p>
                                Problema:
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{deactivation[0]?.problem}</strong></Card>
                            </p>
                            <br/><br/>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(deactivation[0]?.date);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>

                            <hr/>
                            
                            <br/><br/>
                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {deactivation[0]?.date.slice(0,4)}
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