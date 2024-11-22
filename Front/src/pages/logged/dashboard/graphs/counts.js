// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row } from "reactstrap";

export default function Counts() {
  const [ver, setVer] = useState(true);
  const [users, setUsers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [entities, setEntities] = useState([]);

  //Getting users
  useEffect(() => {
    axios.get(`http://10.10.135.100:3002/api/count-users`,)
    .then((res) => {
      setUsers(res.data);
      console.log(res.data);
    });

    axios.get(`http://10.10.135.100:3002/api/count-machines`,)
    .then((res) => {
      setMachines(res.data);
    });

    axios.get(`http://10.10.135.100:3002/api/count-entities`,)
    .then((res) => {
      setEntities(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ver]);

  //Reload after 5 seconds
  setTimeout(() => {
    setVer(!ver);
  }, 5000);

  return (
    <Container>
        <Row xs={2}>
            <Col>
                <Card>
                <CardHeader>
                    Máquinas
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                    {machines[0]?.count}
                    </CardTitle>
                </CardBody>
                </Card>
            </Col>

            <Col>
                <Card>
                <CardHeader>
                    Entidades
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                    {entities[0]?.count}
                    </CardTitle>
                </CardBody>
                </Card>
            </Col>
        </Row>

        <br/>

        <Row>
            <Col>
                <Card>
                <CardHeader>
                    Técnicos
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                    {users[0]?.count}
                    </CardTitle>
                </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
  );
}
