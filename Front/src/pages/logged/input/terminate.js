// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert";
import { Button, Card, CardBody, Form, FormGroup, Input, Label } from "reactstrap";
import { MdClear } from 'react-icons/md';
import Select from 'react-select';

import '../../styles/create-update.css';

export default function TerminateInput() {
    const navigate = useNavigate();

    const [ver] = useState("");

    const [input, setInput] = useState(null);
    const [inputData, setInputData] = useState([]);

    const [machine, setMachine ] = useState(null);
    const [user, setUser ] = useState(null);
    const [secondUser, setSecondUser ] = useState({value: null, label: 'Nome do Técnico...'});
    const [service, setService ] = useState(null);
    const [comment, setComment ] = useState(null);

    const [inputsList, setInputsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [secondaryUsersList, setSecondaryUsersList] = useState([]);

    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/inputs/not/terminateds').then((res) => {
            setInputsList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: 'OS-' + obj.id + '  .  .  .  N/S:' + obj.machine_num
                }
            }));
        });

        axios.get('http://10.10.135.100:3002/api/users').then((res) => {
            setUsersList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.realname
                }
            }));
        });

    },[ver])

    useEffect(() => {
        if (user != null) {
            axios.get(`http://10.10.135.100:3002/api/users/not=${user.value}`).then((res) => {
                setSecondaryUsersList(res.data?.map((obj) => {
                    return {
                        value: obj.id,
                        label: obj.realname
                    }
                }));
            });   
        }
    }, [user])

    useEffect(() => {
        if (input !== null) {
            axios.get(`http://10.10.135.100:3002/api/inputs/${input.value}`).then((res) => {
                console.log(res)
                setInputData(res.data);

                setUser({value: res.data[0].id_user_ie, label: res.data[0].user_name});
                setMachine(res.data[0].id_machine_ie);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[input])

    //Generate PDF?
    const generatePDF = (insertId) => {
        confirmAlert({
            title: 'Documento de Saída',
            message: 'Você deseja gerar o PDF?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                    navigate(`/dmei-sys/inputs/terminateds/${insertId}/exit`);
                    }
                },
                {
                label: 'Não',
                onClick: () => {
                    navigate(`/dmei-sys/inputs/terminateds`);
                    }
                },
            ]
        });
    };

    //Confirm Update
    const updateInput = () => {
        if (user.value === null) {
            alert("Erro, o campo Técnico está vazio!");
        }
        else if (service === null) {
            alert("Erro, o campo Serviço Realizado está vazio!");
        }
        else {
            axios.patch(`http://10.10.135.100:3002/api/inputs/${input.value}/terminate`, {
                user: user.value,
                secondUser: secondUser.value,
                service: service,
                comment: comment,
            })
            .then((r) => {
                axios.patch(`http://10.10.135.100:3002/api/machines/${machine}/update/maintenance`, {
                    maintenance: 0,
                })
                generatePDF(input.value);
            })
            .catch((e) => {
                alert('Erro de Conexão com o Banco!');
            });
        }
    };

    //On Change User
    const onChangeUser = () => {
        if (secondUser != null) {
            if (user.value === secondUser.value) {
                setSecondUser({value: null, label: 'Nome do Técnico...'})
            }   
        }
    }

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/inputs/terminateds`);
    }

    return(
        <div className="create-update">
            <h1>Finalizar</h1>
            <h4>Entrada de Equipamento</h4>
            
            <Form className="form-create-update">
                <hr/>
                <Card color="light" outline>
                    <CardBody>
                        <Label>Ordem de Serviço:</Label>
                        <Select
                            options={inputsList}
                            defaultValue={input}
                            value={input}
                            onChange={setInput}
                        />
                        <br/>
                    </CardBody>
                </Card>

                {inputData?.map((val, key) => {
                    return (
                        <FormGroup key={key}>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <div className="column">
                                    <Label>Técnico Primário:</Label>
                                    <Select
                                        placeholder="Nome do Técnico..."
                                        options={usersList}
                                        defaultValue={user}
                                        value={user}
                                        onChange={setUser}
                                        onInputChange={(null, onChangeUser())}
                                    />
                                </div>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <div className="column">
                                    <Label>Técnico Secundário:</Label>
                                    <div style={{display:'flex'}}>
                                        <Select
                                            placeholder="Nome do Técnico..."
                                            options={secondaryUsersList}
                                            defaultValue={secondUser}
                                            value={secondUser}
                                            onChange={setSecondUser}
                                        />
                                        <Button
                                            style={{margin:'0px 0px 0px 5px', padding:'0px 5px 5px 5px', borderRadius:'5px'}}
                                            onClick={() => setSecondUser({value: null, label: 'Nome do Técnico...'})}
                                        >
                                            <MdClear/>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Label>Serviço Realizado:</Label>
                            <Input
                                defaultValue={val.service_performed}
                                placeholder="Serviço Finalizado..."
                                type='textarea'
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setService(null);
                                    } else {
                                        setService(event.target.value);
                                    }
                                }}
                            />

                            <Label>Comentário:</Label>
                            <Input
                                defaultValue={val.comment}
                                placeholder="Comentário..."
                                type='textarea'
                                onChange={(event) =>{
                                    setComment(event.target.value);
                                }}
                            />
                        </FormGroup>
                    )
                })}
                <hr/>
                
                <Button color="success" onClick={updateInput}>Finalizar</Button>
                <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
            </Form>
        </div>
    );
};