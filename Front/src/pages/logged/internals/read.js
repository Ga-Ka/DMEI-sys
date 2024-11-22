// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import DataTable from 'react-data-table-component';

import { Button, Input, InputGroup, PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";
import { MdClear, MdOpenInNew } from 'react-icons/md';
import { GrTextAlignCenter } from 'react-icons/gr';

import '../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Internals() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [internalsList, setInternalsList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting users
    useEffect(() => {
        //console.log('page = ',page-1, '\nperPage = ',perPage, '\ntotalRows = ', totalRows);

        axios.get(`http://10.10.135.100:3002/api/internals/page=${(page-1)}/perPage=${perPage}`,)
        .then((res) => {
            setInternalsList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/internals/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);


    //Open Internal
    const openInternal = (id) => {
        navigate(`/dmei-sys/internals/${id}`);
    }

    //Add user
    const goToAdd = () => {
        navigate(`/dmei-sys/internals/create`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'OSI',
            id: 'id',
            selector: row => row.id,
            sortable: true,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Entidade',
            selector: row => row.entity_name,
            sortable: true,
            width: '25%',
            center: 'yes'
        },
        {
            name: 'Máquina(s)',
            selector: row => {if (row.text_machines) {
                                return(`${row.text_machines}`)
                            } else {
                                return(` - - - - - `)
                            }},
            width: '30%',
            center: 'yes'
        },
        {
            name: 'Entrada',
            selector: row => {
                const date = new Date(row.date_input);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' }));
            },
            width: '15%',
            center: 'yes'
        },
        {
            name: 'Abrir',
            selector: row => <Button
                                color="primary"
                                onClick={() => openInternal(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Problema',
            selector: row => <>
                            <Button id={`Popover${row.id}`} type="button" title="Problema">
                                <GrTextAlignCenter/>
                            </Button>
                            <br></br>
                            <UncontrolledPopover
                                placement="left"
                                target={`Popover${row.id}`}
                                trigger="click">
                                <PopoverHeader>Problema</PopoverHeader>
                                <PopoverBody>{row.problem}</PopoverBody>
                            </UncontrolledPopover>
                            </>,
            width: '10%',
            center: 'yes'
        },
    ];
    const tableData = internalsList?.map((internal) => {
        return {
            id: internal.id,
            text_machines: internal.text_machines,
            zone_name: internal.zone_name,
            zone_color: internal.zone_color,
            entity_name: internal.entity_name,
            date_input: internal.date_input,
            problem: internal.problem,
            comment: internal.comment
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
                <h1>Serviços Internos</h1>
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
                defaultSortFieldId={'id'}
                defaultSortAsc={false}
                paginationRowsPerPageOptions={[2,10,50,100]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};