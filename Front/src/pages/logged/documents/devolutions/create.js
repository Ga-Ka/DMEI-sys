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

export default function DevolutionCreateDOC() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [id, setID] = useState("");
    const [content, setContent] = useState("");

    //Get the Machine data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/devolutions/this-year`)
        .then((res) => {
            let date = new Date(Date.now());
            let year = String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(6,10);
            setID(`GA/DMEI Nº ${(res.data.length + 1)} / ${year} - DE`);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //ADD a Devolution
    const devolution = () => {
        
        if (content === "" || content === " ") alert('Informe o conteúdo a ser solicitado!')
        else{
            axios.post("http://10.10.135.100:3002/api/devolutions/create/", {
                id: id,
                content: content,
            })
            .then((res)=>{
                console.log(res);
                alert('Devolução Criada!');
                handlePrint();
                navigate(`/dmei-sys/documents/devolutions`);
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

                            <Card><strong>{id}</strong></Card>

                            <br/>

                            <p>Termo de Devolução</p>

                            <hr/>

                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                O setor DMEI - Divisão de Manutenção de Equipamentos em Informática, 
                                vem por meio deste, devolver:
                                <Input
                                    style={{
                                        fontFamily: 'Times',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                    }}
                                    type='textarea'
                                    onChange={(event) =>{
                                        setContent(event.target.value);
                                    }}
                                />
                                Sendo este&#40;s&#41;, devolvidos após a manutenção.
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
                    onClick={devolution}
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