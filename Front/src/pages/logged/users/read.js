// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import useAuth from '../../../contexts/useAuth.js';

import { confirmAlert } from "react-confirm-alert";
import { Button, InputGroup, Input } from "reactstrap";
import { MdClear, MdOpenInNew } from 'react-icons/md';
import { RiDeleteBin2Line } from 'react-icons/ri';

import '../../styles/read.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Users() {
    const { signed, signout } = useAuth();
    const navigate = useNavigate();

    const userPassword = JSON.parse(localStorage.getItem("user")).password;

    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [usersList, setUsersList] = useState([]);
    const [filterText, setFilterText] = useState("");


    //Getting users
    useEffect(() => {
        let search = "";
        if (filterText === "") {
            search = 'null';
        } else {
            search = filterText;
        }
        axios.get(`http://10.10.135.100:3002/api/users/page=${(page-1)}/perPage=${perPage}/search=${search}`,)
        .then((res) => {
            setUsersList(res.data);
        });

        axios.get('http://10.10.135.100:3002/api/users/')
        .then((res) => {
            setTotalRows(res.data.length);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, page, perPage]);

    //Delete user
    const dialogDelete = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                  <div className='react-confirm-alert-body'>
                    <h1>Confirme a Remoção</h1>
                    <p>Para deletar dados sensíveis, confirme sua senha:</p>
                    <Input
                        id="password"
                        placeholder="Senha"
                        type="text"
                    />
                    <hr/>
                    <p>Você tem certeza que quer deletar?</p>
                    <div className="react-confirm-alert-button-group">
                        <button
                        onClick={() => {
                            if (document.getElementById('password').value === userPassword) {
                                setFilterText("1");
                                deleteUser(id);
                                onClose();
                            } else {
                                alert('Senha Incorreta!');
                                onClose();
                            }
                        }}
                        >
                        Sim, Deletar
                        </button>
                        <button onClick={onClose}>Não, Cancelar</button>
                    </div>
                  </div>
                );
            }
        });
    };
    const deleteUser = (id) => {
        if (id === signed.id) {
            axios.delete(`http://10.10.135.100:3002/api/users/${id}/delete`)
            .then((res) => {
                alert('Seu Usuário foi Deletado!');
                signout();
            });
        } else {
            axios.delete(`http://10.10.135.100:3002/api/users/${id}/delete`)
            .then((res) => {
                alert('Usuário Deletado!');
                setFilterText("");
            });
        }
    }

    //Update user
    const openUser = (id) => {
        navigate(`/dmei-sys/users/${id}`);
    }

    //Add user
    const goToAdd = () => {
        navigate(`/dmei-sys/users/create`);
    }

    //Config Table and Search
    const columns = [
        {
            name: 'Id',
            selector: row => row.id,
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Nome de Usuário',
            selector: row => row.nickname,
            width: '20%',
            sortable: true,
            center: 'yes'
        },
        {
            name: 'Senha',
            selector: row => "• • • • • • • • • •",
            width: '20%',
            center: 'yes'
        },
        {
            name: 'Nome Completo',
            selector: row => row.realname,
            width: '30%',
            sortable: true,
            center: 'yes'
        },
        {
            name: 'Abrir',
            selector: row => {
                if (JSON.parse(localStorage.getItem("user")).type === 1) {
                    return (<Button
                                color="primary"
                                onClick={() => openUser(row.id)}
                            >
                                <MdOpenInNew/>
                            </Button>)
                } else {
                    if (row.id === JSON.parse(localStorage.getItem("user")).id) {
                        return (<Button
                                    color="primary"
                                    onClick={() => openUser(row.id)}
                                >
                                    <MdOpenInNew/>
                                </Button>)
                    } else {
                        return (<Button
                                    color="primary"
                                    disabled
                                >
                                    <MdOpenInNew/>
                                </Button>)
                    }
                }},
            width: '10%',
            center: 'yes'
        },
        {
            name: 'Remover',
            selector: row => {
                if (row.id === 1) {
                    return (<Button
                                color="danger"
                                disabled
                            >
                                <RiDeleteBin2Line/>
                            </Button>)
                } else {
                    if (JSON.parse(localStorage.getItem("user")).type === 1) {
                        return (
                        <Button
                            color="danger"
                            onClick={() => dialogDelete(row.id)}
                        >
                            <RiDeleteBin2Line/>
                        </Button>)
                    } else {
                        return (
                        <Button
                            color="danger"
                            disabled
                        >
                            <RiDeleteBin2Line/>
                        </Button>)
                    }
                }},
            width: '10%',
            center: 'yes'
        },
    ];
    const tableData = usersList?.map((user) => {
      return {
        id: user.id,
        nickname: user.nickname,
        password: user.password,
        realname: user.realname,
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
                <h1>Usuários</h1>
                {JSON.parse(localStorage.getItem("user")).type === 1 ? (
                    <Button color='primary' onClick={goToAdd}>Adicionar</Button>
                ) : (
                    <Button color='primary' disabled>Adicionar</Button>
                )}
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
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
};