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

export default function InputGenerateExit() {
    const navigate = useNavigate();
    const location = useLocation();

    const {id} = useParams();
    const [inputId] = useState(id);
    const [inputData, setInputData] = useState([]);

    //Get the user data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/inputs/${inputId}`)
        .then((res) => {
            console.log(res.data);
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
                                padding:'30px',
                                fontFamily:'Times',
                                fontSize:'12px',
                                justifyContent:'center',
                                textAlign:'center'
                            }}>
                                <document>
                                    <DocumentHeader/>

                                    <Card><strong>OS: {val.id}</strong></Card>

                                    <p><strong>Comprovante de Saída de Equipamento</strong></p>

                                    <Row>
                                        <Col style={{margin:'0px'}}>
                                            <p style={{textAlign:"left", margin:'0px'}}>
                                                Equipamento Recebido: <strong>{val.machine_model} </strong>
                                                <br/>
                                                N/S: <strong>{val.machine_num}</strong>

                                                <hr style={{margin:'5px 0px'}}/>
                                                
                                                Cod.: <strong>{val.entity_code}</strong> 
                                                . . . Fone: <strong>{val.entity_phone}</strong>
                                                <br/>
                                                Entidade Possuidora: <strong>{val.entity_name}</strong> 
                                                <br/>
                                                Endereço: <strong>{val.entity_street_adress}, {val.entity_number_adress} - {val.entity_district_adress}</strong>
                                                <br/>
                                                Zona: <strong>{val.zone_name}</strong>
                                            </p>
                                        </Col>
                                        <Col style={{margin:'0px'}}>
                                            <p style={{textAlign:"left", margin:'0px'}}>
                                                Responsável: <strong>{val.responsable}</strong>
                                                <br/>
                                                Fone do Responsável: <strong>{val.phone_responsable}</strong>

                                                <hr style={{margin:'5px 0px'}}/>

                                                
                                                Data de Entrada: <strong>
                                                                    {(() => {
                                                                        const date = new Date(val.date_input);
                                                                        const offset = date.getTimezoneOffset();
                                                                        date.setMinutes(date.getMinutes() - offset);
                                                                        return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                                    })()}
                                                                </strong> 
                                                <br/>
                                                Data de Saída: <strong>
                                                                    {(() => {
                                                                        const date = new Date(val.date_exit);
                                                                        const offset = date.getTimezoneOffset();
                                                                        date.setMinutes(date.getMinutes() - offset);
                                                                        return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                                    })()}
                                                                </strong>
                                                
                                                <hr style={{margin:'5px 0px'}}/>

                                                Data de Emissão: <strong>
                                                                    {(() => {
                                                                        let date = new Date(Date.now());
                                                                        return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
                                                                    })()}
                                                                </strong>
                                            </p>
                                        </Col>
                                    </Row>

                                    <p style={{textAlign:"left"}}>
                                        <hr style={{margin:'5px 0px'}}/>
                                        Problema: {val.problem}
                                        <hr style={{margin:'5px 0px'}}/>
                                        Serviço Realizado: {val.service_performed}
                                        <hr style={{margin:'5px 0px'}}/>
                                        OBS: {val.comment}
                                        <hr style={{margin:'5px 0px'}}/>
                                    </p>

                                    <Row>
                                        <Col>
                                            {val.second_user_name ? (
                                                <p>
                                                    Técnico Primário: <strong>{val.user_name}</strong>
                                                    &nbsp;&nbsp;/&nbsp;&nbsp;
                                                    Técnico Secundário: <strong>{val.second_user_name}</strong>
                                                </p>
                                            ) : (
                                                <p>Técnico: <strong>{val.user_name} - {val.registration}</strong></p>
                                            )}
                                            <br/>
                                            <line>____________________________________</line>
                                            <p>Assinatura Setor DMEI</p>
                                        </Col>
                                        <Col>
                                            <p>Data: ___/___/______</p>
                                            <br/>
                                            <line>____________________________________</line>
                                            <p>Assinatura do Responsável</p>
                                        </Col>
                                    </Row>
                                </document>
                                
                                <hr style={{marginTop:'0px', marginBottom:'25px'}}/>

                                <document>
                                    <DocumentHeader/>

                                    <Card><strong>OS: {val.id}</strong></Card>

                                    <p><strong>Comprovante de Saída de Equipamento</strong></p>

                                    <Row>
                                        <Col style={{margin:'0px'}}>
                                            <p style={{textAlign:"left", margin:'0px'}}>
                                                Equipamento Recebido: <strong>{val.machine_model} </strong>
                                                <br/>
                                                N/S: <strong>{val.machine_num}</strong>

                                                <hr style={{margin:'5px 0px'}}/>
                                                
                                                Cod.: <strong>{val.entity_code}</strong> 
                                                . . . Fone: <strong>{val.entity_phone}</strong>
                                                <br/>
                                                Entidade Possuidora: <strong>{val.entity_name}</strong> 
                                                <br/>
                                                Endereço: <strong>{val.entity_street_adress}, {val.entity_number_adress} - {val.entity_district_adress}</strong>
                                                <br/>
                                                Zona: <strong>{val.zone_name}</strong>
                                            </p>
                                        </Col>
                                        <Col style={{margin:'0px'}}>
                                            <p style={{textAlign:"left", margin:'0px'}}>
                                                Responsável: <strong>{val.responsable}</strong>
                                                <br/>
                                                Fone do Responsável: <strong>{val.phone_responsable}</strong>

                                                <hr style={{margin:'5px 0px'}}/>

                                                
                                                Data de Entrada: <strong>
                                                                    {(() => {
                                                                        const date = new Date(val.date_input);
                                                                        const offset = date.getTimezoneOffset();
                                                                        date.setMinutes(date.getMinutes() - offset);
                                                                        return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                                    })()}
                                                                </strong> 
                                                <br/>
                                                Data de Saída: <strong>
                                                                    {(() => {
                                                                        const date = new Date(val.date_exit);
                                                                        const offset = date.getTimezoneOffset();
                                                                        date.setMinutes(date.getMinutes() - offset);
                                                                        return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
                                                                    })()}
                                                                </strong>
                                                
                                                <hr style={{margin:'5px 0px'}}/>

                                                Data de Emissão: <strong>
                                                                    {(() => {
                                                                        let date = new Date(Date.now());
                                                                        return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
                                                                    })()}
                                                                </strong>
                                            </p>
                                        </Col>
                                    </Row>

                                    <p style={{textAlign:"left"}}>
                                        <hr style={{margin:'5px 0px'}}/>
                                        Problema: {val.problem}
                                        <hr style={{margin:'5px 0px'}}/>
                                        Serviço Realizado: {val.service_performed}
                                        <hr style={{margin:'5px 0px'}}/>
                                        OBS: {val.comment}
                                        <hr style={{margin:'5px 0px'}}/>
                                    </p>

                                    <Row>
                                        <Col>
                                            {val.second_user_name ? (
                                                <p>
                                                    Técnico Primário: <strong>{val.user_name}</strong>
                                                    &nbsp;&nbsp;/&nbsp;&nbsp;
                                                    Técnico Secundário: <strong>{val.second_user_name}</strong>
                                                </p>
                                            ) : (
                                                <p>Técnico: <strong>{val.user_name} - {val.registration}</strong></p>
                                            )}
                                            <br/>
                                            <line>____________________________________</line>
                                            <p>Assinatura Setor DMEI</p>
                                        </Col>
                                        <Col>
                                            <p>Data: ___/___/______</p>
                                            <br/>
                                            <line>____________________________________</line>
                                            <p>Assinatura do Responsável</p>
                                        </Col>
                                    </Row>
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