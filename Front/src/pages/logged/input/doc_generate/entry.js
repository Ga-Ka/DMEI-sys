// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Form, Card, Row, Col } from "reactstrap";
import { BiEdit } from 'react-icons/bi';
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function InputGenerateEntry() {
    const navigate = useNavigate();
    const location = useLocation();

    const {id} = useParams();
    const [inputId] = useState(id);
    const [inputData, setInputData] = useState([]);

    //Get the user data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/inputs/${inputId}`)
        .then((res) => {
            setInputData(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //Print Document
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //Go to update
    const goToUpdate = (id) => {
        navigate(`/dmei-sys/inputs/${id}/update`)
    };

    //Go Back to Input
    const goBack = () => {
        if (location.pathname.slice(0,20) === '/inputs/terminateds/') {
            navigate(`/dmei-sys/inputs/terminateds/${id}`);
        } else {
            navigate(`/dmei-sys/inputs/${id}`);
        }
    };

    return(
        <div className="read-one">
            <h1>Entrada de Equipamento</h1>
            <h5>Documento de Entrada</h5>

            {inputData?.map((val, key) => {
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
                                fontSize:'12px',
                                justifyContent:'center',
                                textAlign:'center'
                            }}>
                                <document>
                                    <DocumentHeader/>

                                    <Card><strong>OS: {val.id}</strong></Card>

                                    <p><strong>Comprovante de Recebimento de Equipamento</strong></p>

                                    <p>
                                        Equipamento Recebido: <strong>{val.machine_model} </strong>
                                        . . . . . .
                                        N/S: <strong>{val.machine_num}</strong>
                                        <br/>
                                        Entidade Possuidora: <strong>{val.entity_name}</strong>
                                        . . . . . .
                                        Cod.: <strong>{val.entity_code}</strong>
                                        <br/>
                                        Data de Emissão: <strong>
                                                            {(() => {
                                                                let date = new Date(Date.now());
                                                                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
                                                            })()}
                                                        </strong>
                                    </p>

                                    <br/>
                                    <line>____________________________________</line>
                                    <p>Assinatura do Responsável</p>

                                    <br/>
                                    <line>____________________________________</line>
                                    <p>Assinatura Setor DMEI</p>
                                </document>

                                <hr style={{marginTop:'60px', marginBottom:'40px'}}/>

                                <document>
                                    <DocumentHeader/>

                                    <Card><strong>OS: {val.id}</strong></Card>

                                    <p><strong>Comprovante de Recebimento de Equipamento</strong></p>

                                    <p>
                                        Equipamento Recebido: <strong>{val.machine_model} </strong>
                                        . . . . . .
                                        N/S: <strong>{val.machine_num}</strong>
                                        <br/>
                                        Entidade possuidora: <strong>{val.entity_name}</strong>
                                        . . . . . .
                                        Cod.: <strong>{val.entity_code}</strong>
                                        <br/>
                                        Data de Emissão: <strong>
                                                            {(() => {
                                                                let date = new Date(Date.now());
                                                                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
                                                            })()}
                                                        </strong>
                                    </p>

                                    <br/>
                                    <line>____________________________________</line>
                                    <p>Assinatura do Responsável</p>

                                    <br/>
                                    <line>____________________________________</line>
                                    <p>Assinatura Setor DMEI</p>
                                </document>
                                
                                <hr style={{marginTop:'60px', marginBottom:'20px'}}/>

                                <Card style={{padding: '15px'}}>                                    
                                    <Row>
                                        <Col style={{textAlign:'right'}}>
                                            <strong>- - - OS: {val.id} - - -</strong>
                                            <br/>
                                            Entidade: {val.entity_name}
                                            <br/>
                                            Cod.: {val.entity_code} . . . Fone: {val.entity_phone}
                                            <hr/>
                                            Responsável: {val.responsable}
                                            <br/>
                                            Telefone: {val.phone_responsable}
                                        </Col>

                                        <Col style={{textAlign:'left'}}>
                                            Máquina: {val.machine_model}
                                            <br/>
                                            N/S: {val.machine_num}
                                            <br/>
                                            Periféricos? {val.peripheral}
                                            <hr/>
                                            Problema: {val.problem}
                                            <br/>
                                            Data de Entrada: {(() => {
                                                                const date = new Date(val.date_input);
                                                                const offset = date.getTimezoneOffset();
                                                                date.setMinutes(date.getMinutes() - offset);
                                                                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                            })()}
                                        </Col>
                                    </Row>
                                </Card>
                        </div>

                        <hr/>
                        <Button
                            title="Editar"
                            color="primary"
                            onClick={() => {goToUpdate(val.id)}}>
                                <BiEdit/>
                        </Button>

                        <Button color="success"
                            onClick={handlePrint}
                        >
                            Imprimir <GrDocumentDownload/>
                        </Button>

                        <Button color="secondary" onClick={goBack}>Voltar</Button>
                    </Form>
                )
            })}
        </div>
    );
}