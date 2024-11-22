// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import DataTable from 'react-data-table-component';

import { Button, Input, UncontrolledPopover, PopoverHeader, PopoverBody, InputGroup } from "reactstrap";
import { MdClear, MdOpenInNew } from 'react-icons/md';
import { GrTextAlignCenter } from 'react-icons/gr';

import '../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function InputsTerminateds() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [inputsList, setInputsList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting inputs
    useEffect(() => {
        let search = "";
        if (filterText === "") {
            search = 'null';
        } else {
            search = filterText;
        }
        axios.get(`http://10.10.135.100:3002/api/inputs/terminateds/page=${(page-1)}/perPage=${perPage}/search=${search}`,)
        .then((res) => {
            console.log('res.data');
            setInputsList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/inputs-terminateds/')
        .then((res) => {
            console.log(res);
            console.log(res.data.length);
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);


    //Open Input
    const openInput = (id) => {
        navigate(`/dmei-sys/inputs/terminateds/${id}`);
    }

    //Terminate input
    const goToTerminate = () => {
        navigate(`/dmei-sys/inputs/terminate`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'OS',
            id: 'id',
            selector: row => row.id,
            sortable: true,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Entidade',
            selector: row => row.entity_name,
            width: '25%',
            center: 'yes'
        },
        {
            name: 'Máquina',
            selector: row => `${row.machine_model} - - ${row.machine_num}`,
            width: '30%',
            center: 'yes'
        },
        {
            name: 'Saída',
            selector: row => {
                const date = new Date(row.date_exit);
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
                                onClick={() => openInput(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Detalhes',
            selector: row => <>
                            <Button id={`Popover${row.id}`} type="button" title="Detalhes">
                                <GrTextAlignCenter/>
                            </Button>
                            <br></br>
                            <UncontrolledPopover
                                placement="left"
                                target={`Popover${row.id}`}
                                trigger="click">
                                <PopoverHeader>Detalhes</PopoverHeader>
                                <PopoverBody>Técnico: {row.user_name}</PopoverBody>
                                <PopoverBody>Serviço: {row.service}</PopoverBody>
                            </UncontrolledPopover>
                            </>,
            width: '10%',
            center: 'yes'
        },
    ];
    const tableData = inputsList?.map((obj) => {
        return {
            id: obj.id,
            machine_model: obj.machine_model,
            machine_num: obj.machine_num,
            entity_name: obj.entity_name,
            service: obj.service_performed,
            date_exit: obj.date_exit,
            user_name: obj.user_name
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
                <h1>Equipamentos Finalizados</h1>
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
                paginationRowsPerPageOptions={[2,10,50,100]}
                defaultSortFieldId={'id'}
                defaultSortAsc={false}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};