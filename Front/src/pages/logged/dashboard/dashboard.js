// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React from "react";
import { Col, Container, Row } from 'reactstrap';
import ZonesGraph from "./graphs/zones";
import Counts from "./graphs/counts";
import TechnicianGraph from "./graphs/technicians";
import HistoryGraph from "./graphs/history";

import '../../styles/read.css';
import './dashboard.css';

export default function Dashboard() {

    return(
        <div className="dashboard">
            <Container>
                <Row xs={2}>
                    <Col>
                        <h4>Atendimentos</h4>
                        <h5>Por Zona</h5>
                        <ZonesGraph/>
                    </Col>
                    
                    <Col>
                        <h4>Contagens</h4>
                        <h5>Registradas</h5>
                        <br/><br/>
                        <Counts/>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col>
                        <h4>Conclusões</h4>
                        <h5>Por Técnicos</h5>
                        <TechnicianGraph/>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <h3>Histórico de Entradas</h3>
                        <HistoryGraph/>
                    </Col>
                </Row>
            </Container>            
        </div>
    );
};