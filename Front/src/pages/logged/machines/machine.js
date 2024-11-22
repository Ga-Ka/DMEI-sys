// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';

import { Alert, Button, Form, Label } from "reactstrap";
import { BiEdit } from 'react-icons/bi';
import { GrDocumentPdf } from 'react-icons/gr';

import '../../styles/read-one.css';

export default function Machine() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [machineId] = useState(id);
    const [machineData, setMachineData] = useState([]);

    const [deactivate_doc, setDeactivate_doc] = useState(null);

    //Get the user data
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/machines/${machineId}`)
        .then((res) => {
            //console.log(res);
            setMachineData(res.data);
            if (res.data[0].id_status_m === 0){
                axios.get(`http://10.10.135.100:3002/api/records/machines/${machineId}/deactivate/doc`)
                .then((res) => {
                    //console.log(res);
                    setDeactivate_doc(res.data[0].deactivate_doc);
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //Go to update
    const goToUpdate = (id) => {
        navigate(`/dmei-sys/machines/${id}/update`)
    };

    //Go to update
    const goToDeactivate = (id) => {
        navigate(`/dmei-sys/documents/deactivate/create`)
    };

    async function downloadDeadDoc(buffer) {
        console.log(buffer);
        const pdfDoc = await PDFDocument.load(new Uint8Array(buffer.data));
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `M-${id}-LAUDO(Assinado).pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    //Back to Entities Menu
    const goBack = () => {
        navigate(`/dmei-sys/machines`);
    };

    return(
        <div className="read-one">
            <h1>Máquina</h1>

            {machineData?.map((val, key) => {
                return (
                    <Form className="form-read-one" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
                        <hr/>

                        <div className="group-columns">
                            <div className="column">
                                <Label>Número de Série: 
                                    <Alert color="secondary">{val.num_serial}</Alert>
                                </Label>

                                <Label>Modelo: 
                                    <Alert color="secondary">{val.model}</Alert>
                                </Label>

                                <Label>Tipo: 
                                    <Alert color="secondary">{val.type_machine_name}</Alert>
                                </Label>
                            </div>

                            <br/>

                            <div className="column">
                                <Label>Entidade: 
                                    <Alert color="secondary">{val.entities_name}</Alert>
                                </Label>

                                <Label>Status: 
                                    <Alert color="secondary">{val.status_name}</Alert>
                                </Label>

                                <Label>Descrição: 
                                    <Alert color="secondary">{val.description}</Alert>
                                </Label>
                            </div>
                        </div>

                        {val.id_status_m !== 0 ? ("") : (
                            <Label style={{display:'block'}}>Laudo Assinado: 
                                <Alert style={{padding:'0px'}} color="secondary">
                                    <Button
                                        title="Laudo Assinado"
                                        color="warning"
                                        style={{fontFamily:'FontAll'}}
                                        onClick={() => {downloadDeadDoc(deactivate_doc)}}
                                    >
                                        DOWNLOAD <GrDocumentPdf/>
                                    </Button>
                                </Alert>
                            </Label>
                        )}

                        <hr/>
                        <Button
                            title="Editar"
                            color="primary"
                            onClick={() => {goToUpdate(val.id)}}>
                                <BiEdit/>
                        </Button>

                        {val.id_status_m !== 0 ? (
                            <Button
                                title="Desativar"
                                color="danger"
                                onClick={() => {goToDeactivate(val.id)}}>
                                    Desativar
                            </Button>
                        ) : ("")}

                        <Button color="secondary" onClick={goBack}>Voltar</Button>
                    </Form>
                )
            })}
        </div>
    );
};