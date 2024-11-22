// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";
import Select from 'react-select';
import { TfiReload } from 'react-icons/tfi';

import '../../styles/create-update.css';

export default function CreateMachine() {
    //Verificação de Carregamento Único
    const [ver] = useState(true);

    const navigate = useNavigate();

    const [entity, setEntity ] = useState({value:null, name:"Nome da Escola...", code:"Código da Escola..."});
    const [num_serial, setNum_serial ] = useState(null);
    const [model, setModel ] = useState(null);
    const [description, setDescription ] = useState(null);
    const [type, setType ] = useState({value:null, label:"Tipo..."});
    const [status, setStatus ] = useState({value:null, label:"Status..."});

    const statusList = [{value: 0, label: 'INATIVO', isDisabled: true},
                        {value: 1, label: 'ATIVO'},
                        {value: 2, label: 'AGUARDANDO', isDisabled: true}];
    const [typesList, setTypesList] = useState([]);
    const [entitiesNameList, setEntitiesNameList] = useState([]);
    const [entitiesCodeList, setEntitiesCodeList] = useState([]);
    const [numSerialList, setNumSerialList] = useState([]);

    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/machines-types').then((res) => {
            setTypesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.name
                }
            }));
        });
        axios.get('http://10.10.135.100:3002/api/machines').then((res) => {
            if (res.data.length !== 0) {
                setNumSerialList(res.data?.map((obj) => {
                    return {
                        serial: obj.num_serial,
                    }
                }));
            } else {
                setNumSerialList([]);
            }
        });
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
    },[ver]);

    //Confirm ADD
    const addMachine = () => {
        axios.post("http://10.10.135.100:3002/api/machines/create", {
            num_serial: num_serial,
            model: model,
            description: description,
            id_type: type.value,
            id_entity: entity.value,
            status: status.value,
        })
        .then(function (r) {
            console.log(r.data.insertId);
            if (r.data.code === 'ER_DUP_ENTRY') {
                alert('Erro, Número de Série já cadastrado!');
            }
            else if(r.data.code === 'ER_BAD_NULL_ERROR') {
                const column = r.data.sqlMessage.split(' ');
                let field = ("");
                switch (column[1]) {
                    case `'id_entities_m'`:
                        field = "Entidade"
                        break;
                    case `'num_serial'`:
                        field = "Número de Série"
                        break;
                    case `'model'`:
                        field = "Modelo"
                        break;
                    case `'id_type_m'`:
                        field = "Tipo"
                        break;
                    case `'description'`:
                        field = "Descrição"
                        break;
                    case `'id_status_m'`:
                        field = "Status"
                        break;
                    default:
                        break;
                }
                alert('Erro, o campo ' + field + ' está vazio!');
            }
            else {
                alert('Adicionado!');
                navigate(`/dmei-sys/machines`);
                axios.post("http://10.10.135.100:3002/api/records/create", {
                    id_machine: r.data.insertId,
                    id_entity: entity.value,
                    action: 'Adicionado',
                }).then(function (r) {
                    //console.log(r);
                }).catch(function (e) {
                    //console.log(e);
                })
            }
        })
        .catch(function (e) {
            alert('Erro!');
        });
    };

    //Generate NumSerial
    const generateNum_Serial = () => {
        let result = '';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        let state = 1;
        while (state === 1) {
            //Letters
            for (let counter = 0; counter < 3; counter++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            //Add A Separation
            result += '-';
            //Numbers
            for (let counter = 0; counter < 7; counter++) {
                result += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }
            //Check If There's A Duplicated Serial Num
            if (numSerialList.length !== 0) {
                for (let counter = 0; counter < numSerialList.length; counter++) {
                    if (numSerialList[counter].serial !== result) {
                        state = 0;
                    } else {
                        state = 1;
                        result = '';
                        break;
                    }
                }
            } else {
                state = 0;
            }
        }
        setNum_serial(result);
    }

    //Cancel
    const cancelAdd = () => {
        navigate(`/dmei-sys/machines`);
    };

    return(
        <div className="create-update">
            <h1>Adicionar</h1>
            <h4>Máquina</h4>

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
                            />
                            <p>&nbsp;&nbsp;</p>
                            <Select
                                options={entitiesCodeList}
                                placeholder='Código da Escola...'
                                defaultValue={{value:entity.value, label:entity.code}}
                                value={{value:entity.value, label:entity.code}}
                                onChange={setEntity}
                            />
                        </div>

                        <hr/>

                        <Label>Número de série:</Label>
                            <Input
                                placeholder="Número de Série..."
                                value={num_serial === null ? "" : num_serial}
                                type='text'
                                onChange={(event) =>{
                                    if (!event.target.value === true) {
                                        setNum_serial(null);
                                    } else {
                                        setNum_serial(event.target.value);
                                    }
                                }}
                            />
                            <Button title="Gerar Número Randômico" onClick={generateNum_Serial}>
                                Gerar&nbsp;&nbsp;<TfiReload/>
                            </Button>
                    </CardBody>
                    <br/>
                </Card>                

                <Label>Modelo:</Label>
                <Input 
                    placeholder="Modelo..."
                    type='text'
                    onChange={(event) =>{
                        if (!event.target.value === true) {
                            setModel(null);
                        } else {
                            setModel(event.target.value);
                        }
                    }}
                />
                <Label>Tipo:</Label>
                <Select
                    placeholder="Tipo..."
                    defaultValue={type}
                    onChange={setType}
                    options={typesList}
                />

                <Label>Descrição:</Label>
                <Input 
                    placeholder="Descrição..."
                    type='textarea'
                    onChange={(event) =>{
                        if (!event.target.value === true) {
                            setDescription(null);
                        } else {
                            setDescription(event.target.value);
                        }
                    }}
                /> 
                
                <Label>Status:</Label>
                <Select
                    placeholder="Status..."
                    defaultValue={status}
                    onChange={setStatus}
                    options={statusList}
                />
                <hr/>
                
                <Button color="primary" onClick={addMachine}>Adicionar</Button>
                <Button color="danger" onClick={cancelAdd}>Cancelar</Button>
            </Form>
        </div>
    );
};