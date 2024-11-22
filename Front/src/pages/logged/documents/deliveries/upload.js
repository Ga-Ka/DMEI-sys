// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import '../../../styles/create-update.css';

export default function DeliveryUpload() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [delivery, setDelivery] = useState("");

    const [machines, setMachines] = useState(null);

    const [delivery_doc, setDelivery_doc] = useState(null);
    const [docSelected, setDocSelected] = useState(null);

    //Get the Delivery data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/deliveries/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setDelivery(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Get the Machines data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/deliveries/${id}/${year}/itens`)
        .then((res) => {
            setMachines(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delivery]);

    //Confirm Delivery
    const deliveryMachine = () => {
        //Alert if there is Empty Fields
        if (delivery_doc === null) {
            alert('Erro, o campo Documento está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/deliveries/create/doc/${id}/${year}`, delivery_doc, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((r) => {
                for (let count = 0; count < machines.length; count++) {
                    axios.patch(`http://10.10.135.100:3002/api/machines/${machines[count]?.id_machine_del}/delivery`, {
                        id_entity: delivery[0]?.id_entities_del
                    })
                    .then((r) => {
                        //console.log(r);
                    })
                    .catch((e) => {
                        alert('Erro de Conexão com o Banco!');
                    });
                }
                alert('Entrega Liberada com sucesso!');
                navigate(`/dmei-sys/documents/deliveries`)
            })
            .catch((e) => {
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel Delivery
    const cancelDelivery = () => {
        navigate(`/dmei-sys/documents/deliveries`);
    }

    return(
        <div className="read-one">
            <h1>Entrega</h1>
            <h4>Guardar Recibo</h4>

            <hr/>

            {delivery !== null ? (
                <Form className="form-create-update">
                    <hr/>
                    <h5><strong>{delivery[0]?.id}</strong></h5>
                    <hr/>
                    
                    <Card color="light" outline>
                        <CardBody>
                            <Label>Recibo de Entrega:</Label>
                            <Input
                                placeholder="Recibo de Entrega"
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setDelivery_doc(null);
                                        setDocSelected(null);
                                    } else {
                                        const file = event.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        setDelivery_doc(formData);
                                        setDocSelected(event.target.value);
                                    }
                                }}
                            />

                            <hr/>

                            {docSelected ? (
                                <p>Documento carregado! Finalize para entregar a Máquina</p>
                            ) : (
                                <p>Carregue o Recibo para entregar a Máquina</p>
                            )}
                        </CardBody>
                        <br/>
                    </Card>

                    <hr/>
                    
                    {docSelected ? (
                        <Button color="success" onClick={deliveryMachine}>Finalizar</Button>
                    ) : ("")}
                </Form>
            ) : ('')}

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={cancelDelivery}>Cancelar</Button>
            </Form>
        </div>
    );
};