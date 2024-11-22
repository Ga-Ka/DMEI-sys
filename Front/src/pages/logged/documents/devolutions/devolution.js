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

export default function Devolution() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [devolution, setDevolution] = useState([]);

    //Get the Devolution Data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/devolutions/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDevolution(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Print Document
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //Go Back
    const goBack = () => {
        navigate(`/dmei-sys/documents/devolutions`);
    };

    return(
        <div className="read-one">
            <h1>Devolução</h1>

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

                            <Card><strong>{devolution[0]?.id}</strong></Card>

                            <br/>

                            <p>Termo de Devolução</p>

                            <hr/>

                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                O setor DMEI - Divisão de Manutenção de Equipamentos em Informática, 
                                vem por meio deste, devolver:
                                <br/>
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{devolution[0]?.content}</strong></Card>
                                <br/>
                                Sendo este&#40;s&#41;, devolvidos após a manutenção.
                            </p>
                            <br/><br/>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(devolution[0]?.date);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>
                            <hr/>

                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {(() => {
                                                                                    let date = new Date(Date.now());
                                                                                    return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
                                                                                })()}
                            </p>
                            <p>Atenciosamente,</p>

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