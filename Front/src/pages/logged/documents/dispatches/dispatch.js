// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Form, Card, Container, Row, Col, Input } from "reactstrap";
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function Dispatch() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [dispatch, setDispatch] = useState([]);
    const [dispatch_itens, setDispatch_itens] = useState([]);
    const [machines, setMachines] = useState([]);

    useEffect(() => {
        //Get Dispatch Data
        axios.get(`http://10.10.135.100:3002/api/dispatches/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDispatch(res.data);
        });
        //Get Dispatch Itens
        axios.get(`http://10.10.135.100:3002/api/dispatches/${id}/${year}/itens`)
        .then((res) => {
            //console.log(res.data);
            setDispatch_itens(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machine data
    useEffect(() => {
        Promise.all(
            dispatch_itens?.map((obj) => {
              return axios.get(`http://10.10.135.100:3002/api/machines/${obj?.id_machine_dis}`)
                .then((res) => {
                  return {
                    num_serial: res.data[0].num_serial,
                    model: res.data[0].model
                  };
                });
            })
        ).then((results) => {
            setMachines(results);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch_itens]);

    //Print Document
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //Go Back
    const goBack = () => {
        navigate(`/dmei-sys/documents/dispatches`);
    };

    return(
        <div className="read-one">
            <h1>Despacho</h1>
            <h5>Memorando</h5>

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
                        fontSize:'16px',
                        justifyContent:'center',
                        textAlign:'center'
                    }}>
                        <document>
                            <DocumentHeader/>

                            <Card><strong>{dispatch[0]?.id}</strong></Card>

                            <p><strong>Memorando</strong></p>

                            <hr/>

                            <p style={{textAlign:"left", margin:'0px'}}>
                                Da: Gerência de Administração - GA
                                <br/>
                                Para: <Input />
                                <br/>
                                Assunto: Material em desuso
                            </p>

                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Estamos encaminhando os materiais abaixo, para armazenamento ou outros fins neste depósito.
                                <Container style={{padding:'0px'}}>
                                    <Row xs={3}>
                                        {machines?.map((val, key) => {
                                            return (
                                                <Col style={{padding:'1px'}}>
                                                    <Card key={key}
                                                        style={{fontSize:'12px'}}
                                                    >
                                                        <strong>
                                                        {val.model}
                                                        <br/>
                                                        N/S: {val.num_serial}
                                                        </strong>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Container>
                            </p>
                            <br/>
                            <p style={{textAlign:"left", margin:'0px'}}>
                                Observação:
                                <Card><strong>{dispatch[0]?.observation}</strong></Card>
                            </p>
                            <br/>
                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Segue devolução dos mesmos materiais que está&#40;ão&#41; 
                                em desuso, e não terão mais utilidade para o setor DMEI.
                            </p>
                            <br/>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(dispatch[0]?.date);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>
                            <hr/>
                            
                            <br/><br/>
                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {dispatch[0]?.date.slice(0,4)}
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