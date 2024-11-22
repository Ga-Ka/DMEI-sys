// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import DataTable from 'react-data-table-component';

import { confirmAlert } from "react-confirm-alert";
import { Button, Input, InputGroup } from "reactstrap";
import { MdClear, MdOpenInNew } from 'react-icons/md';
import { RiDeleteBin2Line } from 'react-icons/ri';

import '../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Entities() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [entitiesList, setEntitiesList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting users
    useEffect(() => {
        let search = "";
        if (filterText === "") {
            search = 'null';
        } else {
            search = filterText;
        }
        axios.get(`http://10.10.135.100:3002/api/entities/page=${(page-1)}/perPage=${perPage}/search=${search}`,)
        .then((res) => {
            setEntitiesList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/entities/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);

    //Delete user
    const dialogDelete = (id) => {
        confirmAlert({
            title: 'Confirme a remoção',
            message: 'Você tem certeza?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                        deleteEntity(id);
                        setFilterText("");
                    }
                },
                {
                label: 'Não'
                }
            ]
        });
    };
    const deleteEntity = (id) => {
        axios.delete(`http://10.10.135.100:3002/api/entities/${id}/delete`)
        .then((res) => {
            alert('Entidade removida!');
        });
    }

    //Open Entity
    const goToEntity = (id) => {
        navigate(`/dmei-sys/entities/${id}`);
    }

    //Add user
    const goToAdd = () => {
        navigate(`/dmei-sys/entities/create`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'Código',
            selector: row => row.code,
            width: '15%',
            center: 'yes'
        },
        {
            name: 'Nome',
            selector: row => row.name,
            width: '25%',
            sortable: true,
            center: 'yes'
        },
        {
            name: 'Telefone',
            selector: row => row.phone,
            width: '15%',
            center: 'yes'
        },
        {
            name: 'Zona',
            selector: row => <button
                                className="zone-box"
                                style={{background: row.zone_color, cursor:'default'}}>
                                {row.zone_name}
                            </button>,
            width: '25%',
            center: 'yes'
        },
        {
            name: 'Abrir',
            selector: row => <Button
                                color="primary"
                                onClick={() => goToEntity(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Remover',
            selector: row => {
                if (JSON.parse(localStorage.getItem("user")).type === 1) {
                    return(
                        <Button
                            color="danger"
                            onClick={() => dialogDelete(row.id)}
                        >
                            <RiDeleteBin2Line/>
                        </Button>)
                } else {
                    return(
                        <Button
                            color="danger"
                            disabled
                        >
                            <RiDeleteBin2Line/>
                        </Button>)
                }
            },
            width: '10%x',
            center: 'yes'
        },
    ];

    const tableData = entitiesList?.map((entities) => {
      return {
        id: entities.id,
        code: entities.code,
        name: entities.name,
        phone: entities.phone,
        zone_name: entities.zone_name,
        zone_color: entities.zone_color,
      };
    });

    const handleClear = () => {
        if (filterText) {
        setFilterText("");
        }
    };

    const handlePerRowsChange = (newPerPage) => {
        setPerPage(newPerPage);
    };

    const handlePageChange = (page) => {
        setPage(page);
    };

    return(
        <div className="read">
            <div className='read-title'>
                <h1>Entidades</h1>
                <Button color='primary' onClick={goToAdd}>Adicionar</Button>
            </div>

            <InputGroup className="read-search">
                <Input
                    placeholder='Pesquise aqui'
                    type="text"
                    value={filterText}
                    onChange={(event) => {
                        setFilterText(event.target.value);
                    }}
                />
                <Button onClick={handleClear}>
                    <MdClear/>
                </Button>
            </InputGroup>

            <hr/>
            
            <DataTable
                columns={columns}
                data={tableData}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationComponentOptions={{
                    rowsPerPageText: 'Filas por página',
                    rangeSeparatorText: 'de',
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Todos',
                }}
                paginationRowsPerPageOptions={[5,10,50,100]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};