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

export default function Loan() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [loan, setLoan] = useState([]);
    const [loan_itens, setLoan_itens] = useState([]);
    const [machines, setMachines] = useState([]);
    const [entity, setEntity] = useState([]);

    useEffect(() => {
        //Get Loan Data
        axios.get(`http://10.10.135.100:3002/api/loans/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setLoan(res.data);
        });
        //Get Loan Itens
        axios.get(`http://10.10.135.100:3002/api/loans/${id}/${year}/itens`)
        .then((res) => {
            //console.log(res.data);
            setLoan_itens(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Entity data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/entities/${loan[0]?.id_entities_loan}`)
        .then((res) => {
            //console.log(res.data);
            setEntity(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loan]);

    //Get the Machine data
    useEffect(() => {
        Promise.all(
            loan_itens?.map((obj) => {
              return axios.get(`http://10.10.135.100:3002/api/machines/${obj?.id_machine_loan}`)
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
    }, [loan_itens]);

    //Print Document
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //Go Back
    const goBack = () => {
        navigate(`/dmei-sys/documents/loans`);
    };

    return(
        <div className="read-one">
            <h1>Empréstimo</h1>
            <h5>Termo</h5>

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

                            <Card><strong>{loan[0]?.id}</strong></Card>

                            <p><strong>Termo de Empréstimo</strong></p>

                            <hr/>

                            <p style={{textAlign:"justify", margin:'0px'}}>
                                Eu declaro que recebi da GA/DMEI/SEMEC, o&#40;s&#41; sequinte&#40;s&#41; equipamento&#40;s&#41;:
                                <Container style={{padding:'0px'}}>
                                    <br/>
                                    {machines.length > 0 ? (
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
                                    ) : ('')}
                                    
                                    {loan[0]?.text_machines !== null ? (
                                        <Card style={{textAlign:"left", margin:'0px'}}><strong>{loan[0]?.text_machines}</strong></Card>
                                    ) : ('')}
                                    <br/>
                                </Container>
                                O&#40;s&#41; mesmo&#40;s&#41; sendo emprestado&#40;s&#41; para <strong>{entity[0]?.name} - {entity[0]?.code}</strong> em 
                                prol de atender as necessidades dos mesmos, assim, assumindo o compromisso
                                pela guarda e preservação do&#40;s&#41; equipamento&#40;s&#41;. Bem como por sua devolução nas 
                                condições de liberação, por data indeterminada.
                            </p>
                            <br/>
                            <p style={{textAlign:"left", margin:'0px'}}>
                                Responsável:
                                <Card style={{textAlign:"left", margin:'0px'}}><strong>{loan[0]?.responsible}</strong></Card>
                            </p>
                            <hr/>

                            Data de Emissão: <strong>
                                                {(() => {
                                                    const date = new Date(loan[0]?.date_loan);
                                                    return String(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                                                })()}
                                            </strong>
                            <hr/>
                            
                            <br/><br/>
                            <p>Teresina &#40;PI&#41;, ___ de _______________ de {loan[0]?.date_loan.slice(0,4)}
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