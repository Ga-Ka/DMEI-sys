// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import '../../../styles/create-update.css';

export default function SubstitutionUpload() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const {id,year} = useParams();
    const [substitution, setSubstitution] = useState([]);

    const [substitution_doc, setSubstitution_doc] = useState(null);
    const [docSelected, setDocSelected] = useState(null);

    //Get the Substitution data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/substitutions/${id}/${year}`)
        .then((res) => {
            //console.log(res.data);
            setSubstitution(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Confirm Substitution
    const substitutionMachine = () => {
        //Alert if there is Empty Fields
        if (substitution_doc === null) {
            alert('Erro, o campo Documento está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/substitutions/create/doc/${id}/${year}`, substitution_doc, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                axios.patch(`http://10.10.135.100:3002/api/machines/${substitution[0]?.id_machine_in_sub}/substitute`,{
                    id_entity: substitution[0]?.id_entities_sub
                })
                .then((res) => {
                    //console.log(res);
                    axios.patch(`http://10.10.135.100:3002/api/machines/${substitution[0]?.id_machine_out_sub}/substitute`,{
                        id_entity: 339
                    })
                    .then((r) => {
                        //console.log(r);
                    })
                    .catch((e) => {
                        alert('Erro de Conexão com o Banco!');
                    });
                })
                .catch((err) => {
                    alert('Erro de Conexão com o Banco!');
                });

                alert('Substituído com sucesso!');
                navigate(`/dmei-sys/documents/substitutions`)
            })
            .catch((error) => {
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel Substitution
    const cancelSubstitution = () => {
        navigate(`/dmei-sys/documents/substitutions`);
    }

    return(
        <div className="read-one">
            <h1>Substituíção</h1>
            <h4>Guardar Laudo</h4>

            <hr/>

            {substitution !== null ? (
                <Form className="form-create-update">
                    <hr/>
                    <h5><strong>{substitution[0]?.id}</strong></h5>
                    <hr/>
                    
                    <Card color="light" outline>
                        <CardBody>
                            <Label>Laudo de Substituição:</Label>
                            <Input
                                placeholder="Laudo de Substituíção"
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setSubstitution_doc(null);
                                        setDocSelected(null);
                                    } else {
                                        const file = event.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        setSubstitution_doc(formData);
                                        setDocSelected(event.target.value);
                                    }
                                }}
                            />

                            <hr/>

                            {docSelected ? (
                                <p>Documento carregado! Finalize para substituir a Máquina</p>
                            ) : (
                                <p>Carregue o Laudo de Substituição para substituir a Máquina</p>
                            )}
                        </CardBody>
                        <br/>
                    </Card>

                    <hr/>
                    
                    {docSelected ? (
                        <Button color="success" onClick={substitutionMachine}>Finalizar</Button>
                    ) : ("")}
                </Form>
            ) : ('')}

            <hr/>

            <Form className="form-read-one">
                <Button color="secondary" onClick={cancelSubstitution}>Cancelar</Button>
            </Form>
        </div>
    );
};