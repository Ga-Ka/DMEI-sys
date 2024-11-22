// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";
import Select from 'react-select';
import { TfiReload } from 'react-icons/tfi';

import '../../styles/create-update.css';

export default function UpdateMachine() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [machineId] = useState(id);
    const [machineData, setMachineData] = useState([]);

    const [entity, setEntity ] = useState({value:null, name:"Nome da Escola...", code:"Código da Escola..."});
    const [num_serial, setNum_serial ] = useState(null);
    const [model, setModel ] = useState(null);
    const [description, setDescription ] = useState(null);
    const [type, setType ] = useState({value:null, label:"Tipo..."});
    const [status, setStatus ] = useState({value:null, label:"Status..."});
    const [observation, setObservation ] = useState(null);

    const statusList = [{value: 0, label: 'INATIVO', isDisabled: true},
                        {value: 1, label: 'ATIVO'},
                        {value: 2, label: 'AGUARDANDO'}];
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
            setNumSerialList(res.data?.map((obj) => {
                return {
                    serial: obj.num_serial,
                }
            }));
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
        axios.get(`http://10.10.135.100:3002/api/machines/${machineId}`).then((res) => {
            setMachineData(res.data);

            setNum_serial(res.data[0].num_serial);
            setModel(res.data[0].model);
            setDescription(res.data[0].description);
            setType({value: res.data[0].id_type_m, label: res.data[0].type_machine_name});
            setEntity({value: res.data[0].id_entities_m, name: res.data[0].entities_name, code: res.data[0].entities_code});
            setStatus({value: res.data[0].id_status_m});
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id, machineId])

    //Confirm update
    const updateMachine = () => {
        //Alert if there is Empty Fields
        if (num_serial === null) {
            alert('Erro, o campo Número de Série está vazio!');
        }
        else if (model === null) {
            alert('Erro, o campo Modelo está vazio!');
        }
        else if (description === null) {
            alert('Erro, o campo Descrição está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/machines/${id}/update`, {
                num_serial: num_serial,
                model: model,
                description: description,
                id_type_m: type.value,
                id_entities_m: entity.value,
                status: status.value,
            })
            .then(function (r) {
                if (r.data.code === 'ER_DUP_ENTRY') {
                    alert('Erro, Número de Série já cadastrado!');
                } else {
                    alert('Atulizado!');
                    navigate(`/dmei-sys/machines`);

                    //Registra mudança de Entidade
                    if (entity.value !== machineData[0].id_entities_m || status.value !== machineData[0].id_status_m){
                        let action = "";
                        if (status.value !== machineData[0].id_status_m && status.value === 1) {
                            action = "Reativado";
                        } else if (status.value !== machineData[0].id_status_m && status.value === 2) {
                            action = "Aguardando";
                        } else {
                            action = "Atualizado";
                        };
                        axios.post("http://10.10.135.100:3002/api/records/create", {
                            id_machine: machineId,
                            id_entity: entity.value,
                            action: action,
                            deactivate_doc: null,
                            observation: observation,
                        }).then(function (r) {
                            //console.log(r);
                        }).catch(function (e) {
                            //console.log(e);
                        })
                    }
                }
            })
            .catch(function (e) {
                alert('Erro de Conexão com o Banco!');
            });
        };
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
            for (let counter = 0; counter < numSerialList.length; counter++) {
                if (numSerialList[counter].serial !== result) {
                    state = 0;
                } else {
                    state = 1;
                    result = '';
                    break;
                }
            }
        }
        setNum_serial(result);
    }

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/machines`);
    }

    return(
        <div className="create-update">
            <h1>Atualizar</h1>
            <h4>Máquina</h4>

            {machineData?.map((val, key) => {
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
                                        placeholder="Número de série..."
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
                            defaultValue={val.model}
                            placeholder="Modelo"
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
                            options={typesList}
                            defaultValue={type}
                            onChange={setType}
                        />

                        <Label>Descrição:</Label>
                        <Input
                            defaultValue={val.description}
                            placeholder="Descrição"
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
                            options={statusList}
                            defaultValue={statusList[status.value]}
                            onChange={setStatus}
                        />

                        {status.value === 2 ? (
                        <>
                        <Label>Observação:</Label>
                        <Input
                            defaultValue={val.observation}
                            value={observation}
                            placeholder="Observação"
                            type='textarea'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setObservation(null);
                                } else {
                                    setObservation(event.target.value);
                                }
                            }}
                        />
                        </>
                        ) : ("")}

                        <hr/>
                        
                        <Button color="primary" onClick={updateMachine}>Atualizar</Button>
                        <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
                    </Form>
                )
            })}
        </div>
    );
};