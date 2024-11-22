// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";
import Select from 'react-select';

import '../../styles/create-update.css';

export default function UpdateInternal() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [internalId] = useState(id);
    const [internalData, setInternalData] = useState([]);

    const [entity, setEntity ] = useState("");

    const [oldMachines, setOldMachines] = useState([]);
    const [newMachines, setNewMachines] = useState([]);

    const [text_machines, setText_machines ] = useState(null);
    const [requester, setRequester] = useState(null);
    
    const [oldUsers, setOldUsers] = useState([]);
    const [newUsers, setNewUsers] = useState([]);

    const [problem, setProblem ] = useState(null);
    const [comment, setComment] = useState(null);
    const [service, setService ] = useState(null);

    const [entitiesNameList, setEntitiesNameList] = useState([]);
    const [entitiesCodeList, setEntitiesCodeList] = useState([]);
    const [machinesList, setMachinesList] = useState([]);
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/entities').then((res) => {
            setEntitiesNameList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.name,
                    code: obj.code,
                    name: obj.name
                }
            }));
            setEntitiesCodeList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.code,
                    code: obj.code,
                    name: obj.name
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

        axios.get(`http://10.10.135.100:3002/api/internals/${internalId}`).then((res) => {
            setInternalData(res.data);

            setRequester(res.data[0].requester);
            setEntity({value: res.data[0].id_entity_si, name: res.data[0].entity_name, code: res.data[0].entity_code});
            setProblem(res.data[0].problem);
            setComment(res.data[0].comment);
            setService(res.data[0].service_performed);
        });

        axios.get(`http://10.10.135.100:3002/api/internals/${internalId}/machines`)
        .then((res) => {
            setOldMachines(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.num_serial
                }
            }));
            setNewMachines(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.num_serial
                }
            }));
        });
        axios.get(`http://10.10.135.100:3002/api/internals/${internalId}/users`)
        .then((res) => {
            setOldUsers(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.nickname
                }
            }));
            setNewUsers(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.nickname
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id, internalId])

    useEffect(() => {        
        axios.get(`http://10.10.135.100:3002/api/machines/entity/${entity.value}`).then((res) => {
            setMachinesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.num_serial
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[entity])

    //On Change Entity
    const onChangeEntity = () => {
        setNewMachines([]);
    }

    //Confirm Update
    const updateInternal = () => {
        //Alert if there is Empty Fields
        if (problem === null) {
            alert('Erro, o campo Problema está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/internals/${id}/update`, {
                entity: entity.value,
                text_machines: text_machines,
                requester: requester,
                problem: problem,
                comment: comment,
                service: service,
            })
            .then(function (r) {
                if (oldMachines !== newMachines && newMachines !== null) {
                    axios.delete(`http://10.10.135.100:3002/api/internals/${id}/delete/itens-machine`)
                    .then((res) => {
                        for (let count = 0; count < newMachines.length; count++) {
                            axios.post("http://10.10.135.100:3002/api/internals/create/item-machine", {
                                id_service: id,
                                id_machine: newMachines[count].value
                            })
                            .then((res)=>{
                                //console.log(res);
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                        }
                    })
                    .catch((e)=>{
                        alert('Erro de Conexão com o Banco!');
                        //console.log(e);
                    });
                }

                if (oldUsers !== newUsers && newUsers !== null) {
                    axios.delete(`http://10.10.135.100:3002/api/internals/${id}/delete/itens-user`)
                    .then((res) => {
                        for (let count = 0; count < newUsers.length; count++) {
                            axios.post("http://10.10.135.100:3002/api/internals/create/item-user", {
                                id_service: id,
                                id_user: newUsers[count].value
                            })
                            .then((res)=>{
                                //console.log(res);
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                        }
                    })
                    .catch((e)=>{
                        alert('Erro de Conexão com o Banco!');
                        //console.log(e);
                    });
                }
                //Alert if the Update was Successful
                alert('Atulizado!');
                navigate(`/dmei-sys/internals/${id}`);
            })
            .catch(function (e) {
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/internals/${id}`);
    }

    return(
        <div className="create-update">
            <h1>Atualizar</h1>
            <h4>Serviço Interno</h4>

            {internalData?.map((val, key) => {
                return (
                    <Form className="form-create-update" key={key}>
                        <hr/>
                        <h5>OSI: <strong>{val.id}</strong></h5>
                        <hr/>

                        <Card color="light" outline>
                            <CardBody>
                                <Label>Entidade:</Label>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    <Select
                                        options={entitiesNameList}
                                        placeholder='Nome da Escola...'
                                        defaultValue={{value:entity.value, label:entity.name}}
                                        value={{value:entity.value, label:entity.name}}
                                        onChange={setEntity}
                                        onInputChange={(null, onChangeEntity)}
                                    />
                                    <p>&nbsp;&nbsp;</p>
                                    <Select
                                        options={entitiesCodeList}
                                        placeholder='Código da Escola...'
                                        defaultValue={{value:entity.value, label:entity.code}}
                                        value={{value:entity.value, label:entity.code}}
                                        onChange={setEntity}
                                        onInputChange={(null, onChangeEntity)}
                                    />
                                </div>
                                
                                <Label>Máquina:</Label>
                                <Select
                                    options={machinesList}
                                    defaultValue={newMachines}
                                    value={newMachines}
                                    onChange={setNewMachines}
                                    isMulti
                                />
                                
                                <br/>

                                <Input
                                    defaultValue={val.text_machines}
                                    placeholder='Equipamentos...'
                                    type='textarea'
                                    onChange={(event) =>{
                                        if (!event.target.value === true) {
                                            setText_machines(null);
                                        } else {
                                            setText_machines(event.target.value);
                                        }
                                    }}
                                />

                                <br/>

                                <Label>Solicitante:</Label>
                                <Input
                                    defaultValue={val.requester}
                                    placeholder="Solicitante..."
                                    type="text"
                                    onChange={(event) => {
                                        if (!event.target.value === true) {
                                            setRequester(null);
                                        } else {
                                            setRequester(event.target.value);
                                        }
                                    }}
                                />

                            </CardBody>
                        </Card>

                        <Label>Técnico:</Label>
                        <Select
                            options={usersList}
                            defaultValue={newUsers}
                            value={newUsers}
                            onChange={setNewUsers}
                            isMulti
                        />

                        <Label>Problema:</Label>
                        <Input
                            defaultValue={val.problem}
                            placeholder="Problema"
                            type='textarea'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setProblem(null);
                                } else {
                                    setProblem(event.target.value);
                                }
                            }}
                        />

                        <Label>Comentário:</Label>
                        <Input
                            defaultValue={val.comment}
                            placeholder="Comentário"
                            type='textarea'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setComment(null);
                                } else {
                                    setComment(event.target.value);
                                }
                            }}
                        />

                        {val.date_exit ? (
                            <>
                                <Label>Serviço Realizado:</Label>
                                <Input
                                    defaultValue={val.service_performed}
                                    placeholder="Serviço Realizado..."
                                    type='textarea'
                                    onChange={(event) =>{
                                        if (!event.target.value === true) {
                                            setService(null);
                                        } else {
                                            setService(event.target.value);
                                        }
                                    }}
                                />
                            </>
                        ) : ('')}
                        

                        <hr/>
                        
                        <Button color="primary" onClick={updateInternal}>Atualizar</Button>
                        <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
                    </Form>
                )
            })}
        </div>
    );
};