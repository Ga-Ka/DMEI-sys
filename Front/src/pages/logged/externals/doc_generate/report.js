// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Card, Input } from "reactstrap";
import { BiEdit } from 'react-icons/bi';
import { GrDocumentDownload } from 'react-icons/gr';
import { pdfFromReact } from "generate-pdf-from-react-html";

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function ExternalReport() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [externalData, setExternalData] = useState([]);

    //Get the External data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/externals/${id}`)
        .then((res) => {
            setExternalData(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //Go to update
    const goToUpdate = (id) => {
        navigate(`/dmei-sys/externals/${id}/update`)
    };

    //Go Back to External
    const goBack = () => {
        navigate(`/dmei-sys/externals/${id}`);
    };

    return(
        <div className="read-one">
            <h1>Agendamento Externo</h1>
            <h5>Documento de Relatório</h5>

            {externalData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>

                        <div id="DocumentPDF"
                            style={{
                                width:'100%',
                                height:'auto',
                                background:'white',
                                padding:'30px',
                                fontFamily:'Times',
                                fontSize:'10px',
                                justifyContent:'center',
                                textAlign:'center'
                            }}>
                                <document>
                                    <DocumentHeader/>

                                    <Card><strong>OAE: {val.id}</strong></Card>

                                    <p><strong>Comprovante de Recebimento de Equipamento</strong></p>

                                    <hr/>

                                    <p style={{textAlign:"left", margin:'0px'}}>
                                        Código: <strong>{val.entity_code}</strong>
                                        <br/>
                                        Entidade: <strong>{val.entity_name}</strong> 
                                        <br/>
                                        Endereço: <strong>{val.entity_street_adress}, {val.entity_number_adress} - {val.entity_district_adress}</strong>
                                        <br/>
                                        Zona: <strong>{val.zone_name}</strong>
                                        <br/>
                                        Data de Emissão: <strong>
                                                            {(() => {
                                                                let date = new Date(Date.now());
                                                                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
                                                            })()}
                                                        </strong>
                                        <br/>
                                        Setor Requisição: <strong>
                                                    <Input
                                                        style={{
                                                            display:'inline-flex',
                                                            fontFamily:'Times',
                                                            fontSize:'10px',
                                                            height:'30px',
                                                            width:'250px',
                                                            padding:'2px 10px'
                                                        }}
                                                        type='text'
                                                    />
                                                </strong>
                                    </p>

                                    <hr/>

                                    <p style={{textAlign:"left", margin:'0px'}}>
                                        Relatório de Atendimento:
                                        <strong>
                                            <Input
                                                style={{
                                                    fontFamily:'Times',
                                                    fontSize:'10px',
                                                }}
                                                type='textarea'
                                            />
                                        </strong>
                                        <br/>
                                        Problema: <strong>{val.problem}</strong>
                                        <br/>
                                        Comentário: <strong>{val.comment}</strong>
                                    </p>

                                    <hr/>
                                    
                                    <p style={{textAlign:"left", margin:'0px'}}>
                                        Autorização: <strong>Secretaria Municipal de Educação e Cultura de Teresina</strong>
                                        <br/><br/>
                                        <p style={{border:'1px dashed black', borderRadius:'5px', padding:'5px'}}>
                                            Serviço executado por: <strong>{val.user_name}</strong>
                                            <br/>
                                            Data: ___/___/______
                                        </p>
                                        <p style={{border:'1px dashed black', borderRadius:'5px', padding:'5px'}}>
                                            Serviço recebido por: <line>____________________________________</line>
                                            <br/>
                                            Data: ___/___/______
                                        </p>
                                    </p>
                                </document>
                        </div>

                        <hr/>
                        <Button
                            title="Editar"
                            color="primary"
                            onClick={() => {goToUpdate(val.id)}}>
                                <BiEdit/>
                        </Button>
                        
                        <Button color="success"
                            onClick={() =>
                                pdfFromReact("#DocumentPDF", `OAE-${val.id}-RELATÓRIO`, "p", false, false)
                            }
                        >
                            Gerar PDF <GrDocumentDownload/>
                        </Button>

                        <Button color="secondary" onClick={goBack}>Voltar</Button>
                    </Form>
                )
            })}
        </div>
    );
}