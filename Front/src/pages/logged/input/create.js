// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";
import Select from 'react-select';

import '../../styles/create-update.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function CreateInput() {
    //Verificação de Carregamento Único
    const [ver] = useState(1);

    const navigate = useNavigate();

    const [entity, setEntity ] = useState({value:null, name:"Nome da Escola...", code:"Código da Escola..."});
    const [machine, setMachine ] = useState("");
    const [responsable, setResponsable ] = useState(null);
    const [phone_responsable, setPhone_Responsable ] = useState(null);
    const [user, setUser ] = useState({value: 1, label: "DMEI"});
    const [problem, setProblem ] = useState(null);
    const [comment, setComment] = useState("");
    const [peripheral, setPeripheral] = useState({value:null, label:"Sim ou Não..."});
    const [day, setDay] = useState(null);
    const [hour, setHour] = useState(null);
    const [date_input, setDate_input] = useState(null);

    const peripheralsList = [{value: 'NÃO', label: 'NÃO'},
                            {value: 'SIM', label: 'SIM'}];
    const [entitiesNameList, setEntitiesNameList] = useState([]);
    const [entitiesCodeList, setEntitiesCodeList] = useState([]);
    const [machinesList, setMachinesList] = useState([]);
    const [usersList, setUsersList] = useState([]);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
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
                    label: obj.nickname
                }
            }));
        });
    },[ver])
    useEffect(() => {
        if (entity !== '') {
        axios.get(`http://10.10.135.100:3002/api/machines/entity/${entity.value}`).then((res) => {
            setMachinesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: `${obj.model} - - ${obj.num_serial}`
                }
            }));
        });
        }
    },[entity])

    //On Change Entity
    const onChangeEntity = () => {
        setMachine({value: null, label: 'Código da Máquina...'});
    }

    //Generate PDF?
    const generatePDF = (insertId) => {
        confirmAlert({
            title: 'Documento de Entrada',
            message: 'Você deseja gerar o PDF?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                    navigate(`/dmei-sys/inputs/${insertId}/entry`);
                    }
                },
                {
                label: 'Não',
                onClick: () => {
                    navigate(`/dmei-sys/inputs`);
                    }
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
        });
    };

    //Confirm ADD
    const addInput = () => {
        if (!isButtonDisabled) {
            setIsButtonDisabled(true);
      
            // Lógica de adicionar o registro ao banco de dados
            // Simulando um setTimeout de 5 segundos para reabilitar o botão (substitua pelo código de adição ao banco de dados)
            setTimeout(() => {
              setIsButtonDisabled(false);
            }, 5000);
        }

        //Do the Post Create
        axios.post("http://10.10.135.100:3002/api/inputs/create", {
            machine: machine.value,
            entity: entity.value,
            responsable: responsable,
            phone_responsable: phone_responsable,
            user: user.value,
            problem: problem,
            comment: comment,
            peripheral: peripheral.value,
            date_input: date_input,
        })
        .then(function (r) {
            //Alert if there is Empty Fields
            if(r.data.code === 'ER_BAD_NULL_ERROR') {
                const column = r.data.sqlMessage.split(' ');
                let field = ("");
                switch (column[1]) {
                    case `'id_entity_ie'`:
                        field = "Entidade"
                        break;
                    case `'id_machine_ie'`:
                        field = "Máquina"
                        break;
                    case `'problem'`:
                        field = "Problema"
                        break;
                    case `'date_input'`:
                        field = "Data de Entrada"
                        break;
                    case `'peripheral'`:
                        field = "Periféricos"
                        break;
                    default:
                        break;
                }
                alert('Erro, o campo ' + field + ' está vazio!');
            }
            //Alert if the Post was Successful
            else {
                axios.patch(`http://10.10.135.100:3002/api/machines/${machine.value}/update/maintenance`, {
                    maintenance: 1,
                })
                generatePDF(r.data.insertId);
            }
        })
        //Alert if there is an Connection Error with the Database
        .catch(function (e) {
            alert('Erro na conexão!');
        });
    };

    const cancelAdd = () => {
        navigate(`/dmei-sys/inputs`);
    };

    return(
        <div className="create-update">
            <h1>Adicionar</h1>
            <h4>Entrada de Equipamento</h4>

            <Form className="form-create-update">
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
                            defaultValue={machine}
                            value={machine}
                            onChange={setMachine}
                        />

                        <Label>Responsável:</Label>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <Input 
                                placeholder="Nome do Responsável..."
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
                    </CardBody>
                    <br/>
                </Card>

                <Label>Técnico Primário:</Label>
                <Select
                    placeholder='Nome do Técnico...'
                    defaultValue={user}
                    onChange={setUser}
                    options={usersList}
                />
                <Label>Problema:</Label>
                <Input 
                    placeholder="Problema..."
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
                
                <Button color="primary" onClick={addInput} disabled={isButtonDisabled}>Adicionar</Button>
                <Button color="danger" onClick={cancelAdd}>Cancelar</Button>
            </Form>
        </div>
    );
};