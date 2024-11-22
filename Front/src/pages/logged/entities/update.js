// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import Select from 'react-select';
import { IMaskInput } from 'react-imask';

import '../../styles/create-update.css';

export default function UpdateEntity() {
    const navigate = useNavigate();

    const {id} = useParams();
    const [entityId] = useState(id);
    const [entityData, setEntityData] = useState([]);

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

    //Get the user data
    useEffect(() => {
        axios.get('http://10.10.135.100:3002/api/zones/all').then((res) => {
            setZonesList(res.data?.map((obj) => {
                return {
                    value: obj.id,
                    label: obj.name
                }
            }));
        });
        axios.get(`http://10.10.135.100:3002/api/entities/${entityId}`)
        .then((res) => {
            setEntityData(res.data);

            setCode(res.data[0].code);
            setName(res.data[0].name);
            setPhone(res.data[0].phone);
            setName_manager(res.data[0].name_manager);
            setPhone_manager(res.data[0].phone_manager);
            setCep_adress(res.data[0].cep_adress);
            setDistrict_adress(res.data[0].district_adress);
            setStreet_adress(res.data[0].street_adress);
            setNumber_adress(res.data[0].number_adress);
            setZone_adress({value: res.data[0].id_zone_adress, label: res.data[0].zone_name});
        });
    }, [entityId]);

    //Confirm update
    const updateEntity = () => {
        //Alert if there is Empty Fields
        if (code === null) {
            alert('Erro, o campo Código está vazio!');
        }
        else if (name === null) {
            alert('Erro, o campo Nome está vazio!');
        }
        else if (phone === null) {
            alert('Erro, o campo Telefone está vazio!');
        }
        else if (name_manager === null) {
            alert('Erro, o campo Nome do Diretor está vazio!');
        }
        else if (phone_manager === null) {
            alert('Erro, o campo Telefone do Diretor está vazio!');
        }
        else if (cep_adress === null) {
            alert('Erro, o campo CEP está vazio!');
        }
        else if (street_adress === null) {
            alert('Erro, o campo Logradouro está vazio!');
        }
        else if (number_adress === null) {
            alert('Erro, o campo Número está vazio!');
        }
        else if (district_adress === null) {
            alert('Erro, o campo Bairro está vazio!');
        }
        else if (zone_adress === null) {
            alert('Erro, o campo Zona está vazio!');
        }
        else{
            axios.patch(`http://10.10.135.100:3002/api/entities/${id}/update`,{
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
                    console.log(r.data)
                    alert('Erro, Código já cadastrado!');
                } else {
                    console.log(r)
                    alert('Atulizado!');
                    navigate(`/dmei-sys/entities`);
                }
            })
            .catch(function (e) {
                alert('Erro!');
            });
        };
    };

    //Search CEP
    const searchCEP = (cep) => {
        axios.get(`http://viacep.com.br/ws/${cep}/json/`)
        .then((res) => {
            setDistrict_adress(res.data.bairro);
            setStreet_adress(res.data.logradouro);
        })
    };

    //Cancel update
    const cancelUpdate = () => {
        navigate(`/dmei-sys/entities`);
    }

    return(
        <div className="create-update">
            <h1>Atualizar</h1>
            <h4>Entidade</h4>

            {entityData?.map((val, key) => {
                return (
                    <Form className="form-create-update" key={key}>
                        <hr/>
                        <h5>Id: <strong>{val.id}</strong></h5>
                        <hr/>

                        <div className="columns">
                            <FormGroup>
                                <Label>Código:</Label>
                                <Input
                                    placeholder="Código..."
                                    defaultValue={val.code}
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
                                    defaultValue={val.name}
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
                                    placeholder="(00) 00000-0000"
                                    defaultValue={val.phone}
                                    type='text'
                                    onChange={(event) => {
                                        if (!event.target.value === true) {
                                            setPhone(null);
                                        } else {
                                            setPhone(event.target.value);
                                        }
                                    }}
                                />

                                <Label>Nome do Diretor:</Label>
                                <Input
                                    placeholder="Nome do Diretor..."
                                    defaultValue={val.name_manager}
                                    type='text'
                                    onChange={(event) => {
                                        if (!event.target.value === true) {
                                            setName_manager(null);
                                        } else {
                                            setName_manager(event.target.value);
                                        }
                                    }}
                                />
                                
                                <Label>Telefone do Diretor:</Label>
                                <Input
                                    placeholder="(00) 00000-0000"
                                    defaultValue={val.phone_manager}
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
                                    defaultValue={val.cep_adress}
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
                                    placeholder="Avenida Frei Serafim"
                                    defaultValue={val.street_adress}
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
                                    defaultValue={val.district_adress}
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
                                    defaultValue={val.number_adress}
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
                        
                        <Button color="primary" onClick={updateEntity}>Atualizar</Button>
                        <Button color="danger" onClick={cancelUpdate}>Cancelar</Button>
                    </Form>
                )
            })}
        </div>
    );
};