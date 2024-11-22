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
import { GrDocumentUpload, GrDocumentVerified } from 'react-icons/gr';
import { RiDeleteBin2Line } from 'react-icons/ri';

import '../../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Substitutions() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [substitutionsList, setSubstitutionsList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting Machines
    useEffect(() => {
        //console.log('page = ',page-1, '\nperPage = ',perPage, '\ntotalRows = ', totalRows);
        let search = "";
        if (filterText === "" || filterText === " ") {
            search = 'null';
        } else {
            search = filterText;
        }
        axios.get(`http://10.10.135.100:3002/api/substitutions/page=${(page-1)}/perPage=${perPage}/search=${search}`,)
        .then((res) => {
            setSubstitutionsList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/substitutions/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);


    //Delete Substitution Doc
    const dialogDeleteDoc = (cod) => {
        confirmAlert({
            title: 'Confirme a remoção',
            message: `Tem certeza que quer remover o Documento de Substituição ${cod}?`,
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                        deleteDoc(cod);
                        setFilterText(" ");
                    }
                },
                {
                label: 'Não'
                }
            ]
        });
    };
    const deleteDoc = (cod) => {
        let id = cod.split(' ')[2];
        let year = cod.split(' ')[4];
        axios.delete(`http://10.10.135.100:3002/api/substitutions/delete/doc/${id}/${year}`)
        .then((res) => {
            //console.log(res);
            alert('Documento de Substituição removido!');
            setFilterText("");
        })
        .catch((e)=>{
            alert('Erro de Conexão com o Banco!');
            //console.log(e);
        });
    }

     //Delete Substitution
     const dialogDelete = (cod) => {
        confirmAlert({
            title: 'Confirme a remoção',
            message: 'Você tem certeza?',
            buttons: [
                {
                label: 'Sim',
                onClick: () => {
                        deleteSubstitution(cod);
                        setFilterText(" ");
                    }
                },
                {
                label: 'Não'
                }
            ]
        });
    };
    const deleteSubstitution = (cod) => {
        let id = cod.split(' ')[2];
        let year = cod.split(' ')[4];
        axios.delete(`http://10.10.135.100:3002/api/substitutions/${id}/${year}/delete`)
        .then((res) => {
            alert('Substituíção removida!');
            setFilterText("");
        })
        .catch((e)=>{
            alert('Erro de Conexão com o Banco!');
            //console.log(e);
        });
    }


    //Download Report
    async function downloadDoc(documentPath) {
        const documentName = documentPath.split('/')[3];

        axios.get(`http://10.10.135.100:3002/api/substitutions/document/?fileName=${encodeURIComponent(documentName)}`, {
            responseType: 'blob',
        })
        .then((res) => {
            console.log(res);
    
            const blob = new Blob([res.data], { type: 'application/pdf' });
            
            const url = document.createElement('a');
            url.href = URL.createObjectURL(blob);
            //console.log(url);
            window.open(url, '_blank');

            URL.revokeObjectURL(url.href);
        })
        .catch((err) => {
            console.error('Erro ao fazer o download do arquivo:', err);
            alert('Erro de Conexão com o Banco!');
        })
    };

    //Open Substitution Upload
    const openSubstitutionUpload = (cod) => {
        const id = cod.split(' ')[2];
        const year = cod.split(' ')[4];
        navigate(`/dmei-sys/documents/substitutions/upload/${id}/${year}`);
    }

    //Open Substitution
    const openSubstitution = (cod) => {
        const id = cod.split(' ')[2];
        const year = cod.split(' ')[4];
        navigate(`/dmei-sys/documents/substitutions/${id}/${year}`);
    }

    //Add Machine
    const goToAdd = () => {
        navigate(`/dmei-sys/documents/substitutions/create`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'Id',
            selector: row => row.id,
            width: '20%',
            sortable: true,
            center: 'yes'
        },
        {
            name: 'Substituído 🠗',
            selector: row => ' - - - - - ',
            width: '20%',
            center: 'yes'
        },
        {
            name: 'Substituto 🠕',
            selector: row => ' - - - - - ',
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Data',
            selector: row => {
                const date = new Date(row.date);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                return String(date.toLocaleString('pt-BR', { timeZone: 'UTC' })).slice(0,10);
            },
            width: '20%',
            center: 'yes'
        },
        {
            name: 'Documento',
            selector: row => {
                if (row.document){
                    return (
                        <InputGroup>
                            <Button
                                color="warning"
                                onClick={() => downloadDoc(row.document)}
                            >
                                <GrDocumentVerified/>
                            </Button>
                            <Button
                                color="danger"
                                onClick={() => dialogDeleteDoc(row.id)}
                            >
                                <MdClear/>
                            </Button>
                        </InputGroup>
                    )
                } else {
                    return (
                        <InputGroup>
                            <Button
                                color="warning"
                                onClick={() => openSubstitutionUpload(row.id)}
                            >
                                <GrDocumentUpload/>
                            </Button>
                            <Button
                                color="danger"
                                disabled
                            >
                                <MdClear/>
                            </Button>
                        </InputGroup>
                    )
                }},
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Abrir',
            selector: row => <Button
                                color="primary"
                                onClick={() => openSubstitution(row.id)}
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
                    return (
                        <Button
                            color="danger"
                            onClick={() => dialogDelete(row.id)}
                        >
                            <RiDeleteBin2Line/>
                        </Button>
                    )
                } else {
                    return (
                        <Button
                            color="danger"
                            disabled
                        >
                            <RiDeleteBin2Line/>
                        </Button>
                    )
                }
            },
        }    
    ];
    const tableData = substitutionsList?.map((obj) => {
      return {
        id: obj.id,
        date: obj.date,
        document: obj.document,
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
                <h1>Substituição</h1>
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