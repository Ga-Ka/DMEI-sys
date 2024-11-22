// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Label, Alert, Card } from "reactstrap";

import '../../styles/read-one.css';

export default function AnonExternal() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [externalId] = useState(id);
    const [externalData, setExternalData] = useState([]);

    //Get the user data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/externals/${externalId}`)
        .then((res) => {
            console.log(res);
            setExternalData(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //Back to Entities Menu
    const goBack = () => {
        navigate(`/dmei-sys/anon/externals`);
    }

    return(
        <div className="read-one">
            <h1>External</h1>

            {externalData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
                        <hr/>

                        <div className="column">
                                <Card color="light" outline>
                                    <Label>Entidade: 
                                        <Alert color="secondary">{val.entity_name}</Alert>
                                    </Label>

                                    <Label>Máquina: 
                                        <Alert color="secondary">{val.machine_num}</Alert>
                                    </Label>
                                </Card>
                        </div>

                        <div className="group-columns">
                            <div className="column">
                                <Label>Técnico: 
                                    <Alert color="secondary">{val.user_name}</Alert>
                                </Label>

                                <Label>Problema: 
                                    <Alert color="secondary">{val.problem}</Alert>
                                </Label>
                            </div>
                            <br/>
                            <div className="column">
                                <Label>Data: 
                                    <Alert color="secondary">{val.date_scheduling.slice(0,10)}</Alert>
                                </Label>

                                <Label>Comentário: 
                                    <Alert color="secondary">{val.comment}</Alert>
                                </Label>
                            </div>
                        </div>
                        <hr/>
                        
                        <Button color="secondary" onClick={goBack}>Voltar</Button>
                    </Form>
                )
            })}
        </div>
    );
};