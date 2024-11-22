// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Form, Card, Container, Row, Col } from "reactstrap";
import { GrDocumentDownload } from 'react-icons/gr';

import { useReactToPrint } from 'react-to-print';

import '../../../styles/read-one.css';
import DocumentHeader from "../../doc_itens/header";

export default function Delivery() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [delivery, setDelivery] = useState([]);
    const [delivery_itens, setDelivery_itens] = useState([]);
    const [machines, setMachines] = useState([]);
    const [entity, setEntity] = useState([]);

    useEffect(() => {
        //Get Delivery Data
        axios.get(`http://10.10.135.100:3002/api/deliveries/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDelivery(res.data);
        });
        //Get Delivery Itens
        axios.get(`http://10.10.135.100:3002/api/deliveries/${id}/${year}/itens`)
        .then((res) => {
            //console.log(res.data);
            setDelivery_itens(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Entity data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/entities/${delivery[0]?.id_entities_del}`)
        .then((res) => {
            //console.log(res.data);
            setEntity(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delivery]);

    //Get the Machine data
    useEffect(() => {
        Promise.all(
            delivery_itens?.map((obj) => {
              return axios.get(`http://10.10.135.100:3002/api/machines/${obj?.id_machine_del}`)
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
    }, [delivery_itens]);

    //Print Document
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //Go Back
    const goBack = () => {
        navigate(`/dmei-sys/documents/deliveries`);
    };

    return(
        <div className="read-one">
            <h1>Entrega</h1>
            <h5>Recibo</h5>

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

                            <Card><strong>{delivery[0]?.id}</strong></Card>

                            <p><strong>Recibo de Entrega de Equipamento</strong></p>

                            <hr/>

                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Declaro que recebi da GA/DMEI/SEMEC, o&#40;s&#41; sequinte&#40;s&#41; equipamento&#40;s&#41;:
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

                                    <Card style={{textAlign:"left", margin:'0px'}}><strong>{delivery[0]?.text_machines}</strong></Card>
                                </Container>
                                O&#40;s&#41; mesmo&#40;s&#41; sendo doado&#40;s&#41; para <strong>{entity[0]?.name} - {entity[0]?.code}</strong> em 
                                prol de atender as necessidades dos mesmos assim assumindo o compromisso
                                pela guarda e preservação do&#40;s&#41; equipamento&#40;s&#41;.
                            </p>
                            <br/>
                            <p style={{textAlign:"left", margin:'0px'}}>
                                Observação:
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{delivery[0]?.observation}</strong></Card>
                            </p>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(delivery[0]?.date);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>
                            <hr/>
                            
                            <br/><br/>
                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {delivery[0]?.date.slice(0,4)}
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