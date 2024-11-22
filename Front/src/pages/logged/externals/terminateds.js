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

export default function ExternalsTerminateds() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [externalsList, setExternalsList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting users
    useEffect(() => {
        //console.log('page = ',page-1, '\nperPage = ',perPage, '\ntotalRows = ', totalRows);

        axios.get(`http://10.10.135.100:3002/api/externals/terminateds/page=${(page-1)}/perPage=${perPage}`,)
        .then((res) => {
            setExternalsList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/externals/terminateds/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);


    //Open External
    const openExternal = (id) => {
        navigate(`/dmei-sys/externals/terminateds/${id}`);
    }

    //Add user
    const goToTerminate = () => {
        navigate(`/dmei-sys/externals/terminate`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'OSE',
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
            name: 'Saída',
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
                                onClick={() => openExternal(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Serviço',
            selector: row => <>
                            <Button id={`Popover${row.id}`} type="button" title="Serviço">
                                <GrTextAlignCenter/>
                            </Button>
                            <br></br>
                            <UncontrolledPopover
                                placement="left"
                                target={`Popover${row.id}`}
                                trigger="click">
                                <PopoverHeader>Serviço</PopoverHeader>
                                <PopoverBody>{row.service}</PopoverBody>
                            </UncontrolledPopover>
                            </>,
            width: '10%',
            center: 'yes'
        },
    ];
    const tableData = externalsList?.map((external) => {
        return {
            id: external.id,
            text_machines: external.text_machines,
            zone_name: external.zone_name,
            zone_color: external.zone_color,
            entity_name: external.entity_name,
            date_input: external.date_input,
            problem: external.problem,
            comment: external.comment,
            service: external.service_performed
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
                <h1>Agendamento Externo</h1>
                <Button color='success' onClick={goToTerminate}>Finalizar</Button>
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
                paginationRowsPerPageOptions={[10,50,100]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};