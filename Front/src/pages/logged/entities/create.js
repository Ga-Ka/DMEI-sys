// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import Select from 'react-select';
import { IMaskInput } from 'react-imask';

import '../../styles/create-update.css';

export default function CreateEntity() {
    //Verificação de Carregamento Único
    const [ver] = useState(true);

    const navigate = useNavigate();

    const [code, setCode ] = useState(null);
    const [name, setName ] = useState(null);
    const [phone, setPhone ] = useState(null);
    const [zone_adress, setZone_adress ] = useState(null);
    const [name_manager, setName_manager ] = useState(null);
    const [phone_manager, setPhone_manager] = useState(null);
    const [district_adress, setDistrict_adress] = useState(null);
    const [cep_adress, setCep_adress] = useState(null);
    const [number_adress, setNumber_adress] = useState(null);
    const [street_adress, setStreet_adress] = useState(null);

    const [zonesList, setZonesList] = useState([]);

    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/zones/all').then((res) => {
            setZonesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.name
                }
            }));
        });
    },[ver]);

    const addEntity = () => {
        axios.post("http://10.10.135.100:3002/api/entities/create", {
            code: code,
            name: name,
            phone: phone,
            name_manager: name_manager,
            phone_manager: phone_manager,
            cep_adress: cep_adress,
            street_adress: street_adress,
            number_adress: number_adress,
            district_adress: district_adress,
            zone_adress: zone_adress.value
        })
        .then(function (r) {
            if (r.data.code === 'ER_DUP_ENTRY') {
                alert('Erro, Código já cadastrado!');
            }
            else if(r.data.code === 'ER_BAD_NULL_ERROR') {
                const column = r.data.sqlMessage.split(' ');
                let field = ("");
                switch (column[1]) {
                    case `'code'`:
                        field = "Código"
                        break;
                    case `'name'`:
                        field = "Nome"
                        break;
                    case `'phone'`:
                        field = "Telefone"
                        break;
                    case `'name_manager'`:
                        field = "Nome do Diretor"
                        break;
                    case `'phone_manager'`:
                        field = "Telefone do Diretor"
                        break;
                    case `'district_adress'`:
                        field = "Bairro"
                        break;
                    case `'cep_adress'`:
                        field = "CEP"
                        break;
                    case `'number_adress'`:
                        field = "Número"
                        break;
                    case `'street_adress'`:
                        field = "Logradouro"
                        break;
                    case `'id_zone_adress'`:
                        field = "Zona"
                        break;
                    default:
                        break;
                }
                alert('Erro, o campo ' + field + ' está vazio!');
            }
            else {
                alert('Adicionado!');
                navigate(`/dmei-sys/entities`);
            }
        })
        .catch(function (e) {
            alert('Erro de conexão!');
        });
    };

    //Search CEP
    const searchCEP = (cep) => {
        axios.get(`http://viacep.com.br/ws/${cep}/json/`)
        .then((res) => {
            setDistrict_adress(res.data.bairro);
            setStreet_adress(res.data.logradouro);
        })
    };

    const cancelAdd = () => {
        navigate(`/dmei-sys/entities`);
    }

    return(
        <div className="create-update">
            <h1>Adicionar</h1>
            <h4>Entidade</h4>
            
            <Form className="form-create-update"> 
                <hr/>
                <div className="columns">
                    <FormGroup>
                        <Label>Código:</Label>
                        <Input
                            placeholder="Código..."
                            type='text'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setCode(null);
                                } else {
                                    setCode(event.target.value);
                                }
                            }}
                        />

                        <Label>Nome:</Label>
                        <Input
                            placeholder="Nome..."
                            type='text'
                            onChange={(event) =>{
                                if (!event.target.value === true) {
                                    setName(null);
                                } else {
                                    setName(event.target.value);
                                }
                            }}
                        />

                        <Label>Telefone:</Label>
                        <Input
                            placeholder="00 00000-0000"
                            type='text'
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setPhone(null);
                                } else {
                                    setPhone(event.target.value);
                                }
                            }}
                        />

                        <Label>Nome do Diretor(a):</Label>
                        <Input
                            placeholder="Nome do Diretor(a)..."
                            type='text'
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setName_manager(null);
                                } else {
                                    setName_manager(event.target.value);
                                }
                            }}
                        />
                        
                        <Label>Telefone do Diretor(a):</Label>
                        <Input
                            placeholder="00 00000-0000"
                            type='text'
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setPhone_manager(null);
                                } else {
                                    setPhone_manager(event.target.value);
                                }
                            }}
                        />
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <Label>CEP:</Label>
                        <Input
                            placeholder="00000-000"
                            type='text'
                            mask="00000-000"
                            tag={IMaskInput}
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setCep_adress(null);
                                } else {
                                    setCep_adress(event.target.value);
                                    if(event.target.value.replace("-","").length === 8){
                                        searchCEP(event.target.value.replace("-",""));
                                    };
                                }
                            }}
                        />

                        <Label>Logradouro:</Label>
                        <Input
                            placeholder="Logradouro..."
                            value={street_adress === null ? "" : street_adress}
                            type='text'
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setStreet_adress(null);
                                } else {
                                    setStreet_adress(event.target.value);
                                }
                            }}
                        />

                        <Label>Bairro:</Label>
                        <Input
                            placeholder="Bairro..."
                            value={district_adress === null ? "" : district_adress}
                            type='text'
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setDistrict_adress(null);
                                } else {
                                    setDistrict_adress(event.target.value);
                                }
                            }}
                        />

                        <Label>Número:</Label>
                        <Input
                            placeholder="Número..."
                            type='text'
                            onChange={(event) => {
                                if (!event.target.value === true) {
                                    setNumber_adress(null);
                                } else {
                                    setNumber_adress(event.target.value);
                                }
                            }}
                        />

                        <Label>Zona:</Label>
                        <Select
                            placeholder="Zona..."
                            defaultValue={zone_adress}
                            onChange={setZone_adress}
                            options={zonesList}
                        />
                    </FormGroup>
                </div>
                <hr/>
                
                <Button color="primary" onClick={addEntity}>Adicionar</Button>
                <Button color="danger" onClick={cancelAdd}>Cancelar</Button>
            </Form>
        </div>
    );
};