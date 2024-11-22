// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { Button, Form, Card, Input } from "reactstrap";
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function RequestCreateDOC() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [id, setID] = useState("");
    const [content, setContent] = useState("");
    const [receiver, setReceiver] = useState("");

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/requests/this-year`)
        .then((res) => {
            let date = new Date(Date.now());
            let year = String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
            setID(`GA/DMEI Nº ${(res.data.length + 1)} / ${year} - SR`);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //ADD a Request
    const request = () => {
        if (receiver === "" || receiver === " ") alert('Informe o nome do Destinatário!')
        else if (content === "" || content === " ") alert('Informe o conteúdo a ser solicitado!')
        else{
            axios.post("http://10.10.135.100:3002/api/requests/create/", {
                id: id,
                content: content,
                receiver: receiver
            })
            .then((res)=>{
                console.log(res);
                alert('Solicitação Criada!');
                handlePrint();
                navigate(`/dmei-sys/documents/requests`);
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

                            <Card><strong>{id}</strong></Card>

                            <p><strong>Solicitação de Recurso</strong></p>

                            <hr/>

                            <p style={{textAlign:"left", margin:'0px'}}>
                                Ilmo&#40;a&#41; Sr&#40;a&#41;
                                <br/>
                                <Input 
                                    style={{
                                        fontFamily: 'Times',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        padding: '1px',
                                        borderRadius: '2px',
                                    }}
                                    type='text'
                                    onChange={(event) =>{
                                        setReceiver(event.target.value);
                                    }}
                                />
                                Secretário&#40;a&#41; Executivo&#40;a&#41; de Gestão - SEMEC/PMT
                            </p>

                            <br/><br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Senhor&#40;a&#41; Secretário&#40;a&#41;,

                                <br/><br/>

                                Venho por meio deste, solicitar:
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
                                        setContent(event.target.value);
                                    }}
                                />
                                Tendo em vista, a continuação da execução dos trabalhos do 
                                setor&#40;DMEI&#41; - Divisão de Manutenção de Equipamentos em Informática.
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

                            <p>Atenciosamente.</p>
                        </document>
                </div>
                
                <hr/>

                <Button color="success"
                    onClick={request}
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