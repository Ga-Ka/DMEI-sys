// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";
import Select from 'react-select';

import '../../styles/create-update.css';

export default function UpdateInput() {
    const navigate = useNavigate();
    const location = useLocation();

    const {id} = useParams();
    const [inputId] = useState(id);
    const [inputData, setInputData] = useState([]);

    const [entity, setEntity ] = useState("");

    const [oldMachine, setOldMachine ] = useState(null);
    const [newMachine, setNewMachine ] = useState(null);

    const [responsable, setResponsable ] = useState(null);
    const [phone_responsable, setPhone_Responsable ] = useState(null);
    const [user, setUser ] = useState(null);
    const [problem, setProblem ] = useState(null);
    const [comment, setComment ] = useState(null);
    const [peripheral, setPeripheral ] = useState(null);
    const [day, setDay] = useState(null);
    const [hour, setHour] = useState(null);
    const [date_input, setDate_input] = useState(null);

    const peripheralsList = [{value: 'NÃO', label: 'NÃO'},
                            {value: 'SIM', label: 'SIM'}];
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
        axios.get(`http://10.10.135.100:3002/api/inputs/${inputId}`).then((res) => {
            setInputData(res.data);

            setEntity({value: res.data[0].id_entity_ie, name: res.data[0].entity_name, code:res.data[0].entity_code});

            setOldMachine({value: res.data[0].id_machine_ie, label: `${res.data[0].machine_model} - - ${res.data[0].machine_num}`});
            setNewMachine({value: res.data[0].id_machine_ie, label: `${res.data[0].machine_model} - - ${res.data[0].machine_num}`});

            setResponsable(res.data[0].responsable);
            setPhone_Responsable(res.data[0].phone_responsable);
            setUser({value: res.data[0].id_user_ie, label: res.data[0].user_name});
            setProblem(res.data[0].problem);
            setComment(res.data[0].comment);
            setPeripheral({value: res.data[0].peripheral, label: res.data[0].peripheral});
            setDate_input(res.data[0].date_input);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id, inputId])

    useEffect(() => {        
        axios.get(`http://10.10.135.100:3002/api/machines/entity/${entity.value}`)
        .then((res) => {
            setMachinesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: `${obj.model} - - ${obj.num_serial}`
                }
            }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[entity])

    //On Change Entity
    const onChangeEntity = () => {
        setNewMachine({value: null, label: 'Código da Máquina...'});
    }

    //Confirm Update
    const updateInput = () => {
        //Alert if there is Empty Fields
        if (newMachine.value === null) {
            alert('Erro, o campo Máquina está vazio!');
        }
        else if (problem === null) {
            alert('Erro, o campo Problema está vazio!');
        }
        else if (date_input === null) {
            alert('Erro, o campo Data de Entrada está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/inputs/${id}/update`, {
                entity: entity.value,
                machine: newMachine.value,
                responsable: responsable,
                phone_responsable: phone_responsable,
                user: user.value,
                problem: problem,
                comment: comment,
                peripheral: peripheral.value,
                date_input: date_input,
            })
            .then(function (r) {
                if (oldMachine !== newMachine) {
                    axios.patch(`http://10.10.135.100:3002/api/machines/${oldMachine.value}/update/maintenance`, {
                        maintenance: 0,
                    });
                    axios.patch(`http://10.10.135.100:3002/api/machines/${newMachine.value}/update/maintenance`, {
                        maintenance: 1,
                    })
                }
                //Alert if the Update was Successful
                alert('Atulizado!');
                navigate(`/dmei-sys/inputs`);
            })
            .catch(function (e) {
                alert('Erro de Conexão com o Banco!');
            });
        };
    };

    //Cancel Update and Go Back to Input
    const cancelUpdate = () => {
        if (location.pathname.slice(0,20) === '/inputs/terminateds/') {
            navigate(`/dmei-sys/inputs/terminateds/${id}`);
        } else {
            navigate(`/dmei-sys/inputs/${id}`);
        }
    };

    return(
        <div className="create-update">
            <h1>Atualizar</h1>
            <h4>Entrada de Equipamento</h4>

            {inputData?.map((val, key) => {
                return (
                    <Form className="form-create-update" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
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
                                    placeholder='Código da Máquina...'
                                    options={machinesList}
                                    defaultValue={newMachine}
                                    value={newMachine}
                                    onChange={setNewMachine}
                                />

                                <Label>Responsável:</Label>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    <Input 
                                        placeholder="Nome do Responsável..."
                                        defaultValue={val.responsable}
                                        type='text'
                                        onChange={(event) =>{
                                            if (!event.target.value === true) {
                                                setResponsable(null);
                                            } else {
                                                setResponsable(event.target.value);
                                            }
                                        }}
                                    />
                                    <p>&nbsp;&nbsp;</p>
                                    <Input 
                                        placeholder="(00) 00000-0000"
                                        defaultValue={val.phone_responsable}
                                        type='text'
                                        onChange={(event) =>{
                                            if (!event.target.value === true) {
                                                setPhone_Responsable(null);
                                            } else {
                                                setPhone_Responsable(event.target.value);
                                            }
                                        }}
                                    />
                                </div>
                                <br/>
                            </CardBody>
                        </Card>

                        <Label>Técnico Primário:</Label>
                        <Select
                            placeholder='Nome do Técnico...'
                            options={usersList}
                            defaultValue={user}
                            onChange={setUser}
                        />

                        <Label>Problema:</Label>
                        <Input
                            placeholder="Problema..."
                            defaultValue={val.problem}
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
                            placeholder="Comentário..."
                            defaultValue={val.comment}
                            type='textarea'
                            onChange={(event) =>{
                                setComment(event.target.value);
                            }}
                        />

                        <Label>Possui Periféricos?</Label>
                        <Select
                            defaultValue={peripheral}
                            onChange={setPeripheral}
                            options={peripheralsList}
                        />

                        <Label>Data de Entrada:</Label>
                        <div style={{display:'flex', justifyContent:'center', width:'50%', margin:'auto'}}>
                            <Input
                                defaultValue={date_input?.slice(0,10)}
                                type='date'
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setDay(null);
                                        setDate_input(null);
                                    } else {
                                        setDay(event.target.value);
                                        if (hour !== null) {
                                            let ymd = event.target.value.split("-");
                                            console.log(ymd[0], ymd[1], ymd[2])
                                            let hm = hour.split(":");
                                            let date = new Date(Date.UTC(ymd[0], ymd[1]-1, ymd[2], hm[0], hm[1], 0)).toISOString();
                                            setDate_input(date);
                                        }
                                    }
                                }}
                            />
                            <p>&nbsp;&nbsp;</p>
                            <Input
                                defaultValue={date_input?.slice(11,16)}
                                type="time"
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setHour(null);
                                        setDate_input(null);
                                    } else {
                                        setHour(event.target.value);
                                        if (day !== null) {
                                            let ymd = day.split("-");
                                            let hm = event.target.value.split(":");
                                            let date = new Date(Date.UTC(ymd[0], ymd[1]-1, ymd[2], hm[0], hm[1], 0)).toISOString();
                                            setDate_input(date);
                                        }
                                    }
                                }}
                            />
                        </div>

                        <hr/>
                        
                        <Button color="primary" onClick={updateInput}>Atualizar</Button>
                        <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
                    </Form>
                )
            })}
        </div>
    );
};