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

export default function Request() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [request, setRequest] = useState([]);

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/requests/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setRequest(res.data);
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
        navigate(`/dmei-sys/documents/requests`);
    };

    return(
        <div className="read-one">
            <h1>Solicitação</h1>

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

                            <Card><strong>{request[0]?.id}</strong></Card>

                            <p><strong>Solicitação de Recurso</strong></p>

                            <hr/>

                            <p style={{textAlign:"left", margin:'0px'}}>
                                Ilmo&#40;a&#41; Sr&#40;a&#41;
                                <br/>
                                <strong>
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{request[0]?.receiver}</strong></Card>
                                </strong>
                                <br/>
                                Secretário&#40;a&#41; Executivo&#40;a&#41; de Gestão - SEMEC/PMT
                            </p>

                            <br/><br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Senhor&#40;a&#41; Secretário&#40;a&#41;,

                                <br/><br/>

                                Venho por meio deste, solicitar:
                                <br/>
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{request[0]?.content}</strong></Card>
                                <br/>
                                Tendo em vista, a continuação da execução dos trabalhos do 
                                setor&#40;DMEI&#41; - Divisão de Manutenção de Equipamentos em Informática.
                            </p>
                            <br/><br/>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(request[0]?.date);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>
                            <hr/>

                            <p>Atenciosamente.</p>
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