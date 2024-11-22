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

export default function Externals() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [externalsList, setExternalsList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting users
    useEffect(() => {
        //console.log('page = ',page-1, '\nperPage = ',perPage, '\ntotalRows = ', totalRows);

        axios.get(`http://10.10.135.100:3002/api/externals/page=${(page-1)}/perPage=${perPage}`,)
        .then((res) => {
            console.log(res.data);
            setExternalsList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/externals/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);


    //Open External
    const openExternal = (id) => {
        navigate(`/dmei-sys/externals/${id}`);
    }

    //Add user
    const goToAdd = () => {
        navigate(`/dmei-sys/externals/create`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'Id',
            id: 'id',
            selector: row => row.id,
            sortable: true,
            width: '80px',
            center: 'yes'
        },
        {
            name: 'Entidade',
            selector: row => row.entity_name,
            center: 'yes'
        },
        {
            name: 'Zona',
            selector: row => <button
                                className="zone-box"
                                style={{background: row.zone_color, cursor:'default'}}>
                                {row.zone_name}
                            </button>,
            center: 'yes'
        },
        {
            name: 'Máquina',
            selector: row => {if (row.text_machines) {
                                return(`${row.text_machines}`)
                            } else {
                                return(` - - - - - `)
                            }},
            center: 'yes'
        },
        {
            name: 'Data',
            selector: row => {
                const date = new Date(row.date_input);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
            },
            center: 'yes'
        },
        {
            name: 'Abrir',
            selector: row => <Button
                                color="primary"
                                onClick={() => openExternal(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>,
            width: '100px',
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
    const tableData = externalsList?.filter(
      (external) =>
        (external.entity_name && external.entity_name.toLowerCase().includes(filterText.toLowerCase())) ||
        (external.machine_num && external.machine_num.toLowerCase().includes(filterText.toLowerCase())) ||
        (external.zone_name && external.zone_name.toLowerCase().includes(filterText.toLowerCase()))
    )
    .map((external) => {
      return {
        id: external.id,
        entity_name: external.entity_name,
        machine_num: external.machine_num,
        zone_name: external.zone_name,
        zone_color: external.zone_color,
        date_input: external.date_input,
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
                <h1>Chamados Externos</h1>
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
                paginationRowsPerPageOptions={[2,10,50,100]}
                defaultSortFieldId={'id'}
                defaultSortAsc={false}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};