// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React from 'react';
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { AiFillLayout } from 'react-icons/ai';
import { BsCpuFill, BsArrowRepeat, BsArrowRightCircle, BsArrowRightSquare, BsExclamationCircle } from 'react-icons/bs';
import { FaWarehouse, FaReceipt } from 'react-icons/fa';
import { GoTasklist, GoDiffAdded } from 'react-icons/go';
import { VscServerEnvironment, VscServer, VscServerProcess } from 'react-icons/vsc';
import { IoDocumentsSharp, IoReload } from 'react-icons/io5';
import { RiHistoryLine } from 'react-icons/ri';
import { FaUsers, FaBuilding, FaListUl, FaCheck } from 'react-icons/fa';
import { CgMoreR } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../contexts/useAuth';

import './side-menu.css';

export default function SideMenu() {
    const { signed } = useAuth();

    const navigate = useNavigate();

    if (signed === null) {
        return ('');
    }
    else if (signed.type === 1 || signed.type === 2) {
        return (
            <div className='side-menu'>
                <Sidebar className='side-bar'>
                    <Menu transitionDuration={1000}>
                        <h1 className='title'>DMEIsys</h1>
                        <hr/>

                        <MenuItem
                            icon={<AiFillLayout />}
                            onClick={()=>{navigate(`/dmei-sys/dashboard`)}}>
                            Dashboard
                        </MenuItem>

                        <hr/>
                        <SubMenu label="Entradas" icon={<VscServer />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/inputs`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/inputs/create`)}}>
                                Adicionar
                            </MenuItem>
                            <MenuItem
                                icon={<GoTasklist />}
                                onClick={()=>{navigate(`/dmei-sys/inputs/terminateds`)}}>
                                Concluídos
                            </MenuItem>
                            <MenuItem
                                icon={<FaCheck />}
                                onClick={()=>{navigate(`/dmei-sys/inputs/terminate`)}}>
                                Finalizar
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Agenda Externa" icon={<VscServerEnvironment />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/externals`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/externals/create`)}}>
                                Adicionar
                            </MenuItem>
                            <MenuItem
                                icon={<GoTasklist />}
                                onClick={()=>{navigate(`/dmei-sys/externals/terminateds`)}}>
                                Concluídos
                            </MenuItem>
                            <MenuItem
                                icon={<FaCheck />}
                                onClick={()=>{navigate(`/dmei-sys/externals/terminate`)}}>
                                Finalizar
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Agenda Interna" icon={<VscServerProcess />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/internals`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/internals/create`)}}>
                                Adicionar
                            </MenuItem>
                            <MenuItem
                                icon={<GoTasklist />}
                                onClick={()=>{navigate(`/dmei-sys/internals/terminateds`)}}>
                                Concluídos
                            </MenuItem>
                            <MenuItem
                                icon={<FaCheck />}
                                onClick={()=>{navigate(`/dmei-sys/internals/terminate`)}}>
                                Finalizar
                            </MenuItem>
                        </SubMenu>

                        <hr/>
                        <SubMenu label="Documentos" icon={<IoDocumentsSharp />}>
                            <MenuItem
                                icon={<BsArrowRepeat />}
                                onClick={()=>{navigate(`/dmei-sys/documents/substitutions`)}}>
                                Substituição
                            </MenuItem>
                            <MenuItem
                                icon={<BsArrowRightCircle />}
                                onClick={()=>{navigate(`/dmei-sys/documents/loans`)}}>
                                Empréstimo
                            </MenuItem>
                            <MenuItem
                                icon={<BsArrowRightSquare />}
                                onClick={()=>{navigate(`/dmei-sys/documents/deliveries`)}}>
                                Entrega
                            </MenuItem>
                            <MenuItem
                                icon={<FaWarehouse/>}
                                onClick={()=>{navigate(`/dmei-sys/documents/dispatches`)}}>
                                Despacho
                            </MenuItem>
                            <MenuItem
                                icon={<BsExclamationCircle/>}
                                onClick={()=>{navigate(`/dmei-sys/documents/deactivations`)}}>
                                Desativação
                            </MenuItem>
                            
                            <hr/>
                            <SubMenu label="Outros" icon={<CgMoreR />}>
                                <hr/>
                                <MenuItem
                                    icon={<FaReceipt/>}
                                    onClick={()=>{navigate(`/dmei-sys/documents/requests`)}}>
                                    Solicitação
                                </MenuItem>
                                <MenuItem
                                    icon={<IoReload/>}
                                    onClick={()=>{navigate(`/dmei-sys/documents/devolutions`)}}>
                                    Devolução
                                </MenuItem>
                            </SubMenu>
                        </SubMenu>

                        <SubMenu label="Máquinas" icon={<BsCpuFill />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/machines`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/machines/create`)}}>
                                Adicionar
                            </MenuItem>
                            <MenuItem
                                icon={<RiHistoryLine />}
                                onClick={()=>{navigate(`/dmei-sys/machines/records`)}}>
                                Registros
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Entidades" icon={<FaBuilding />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/entities`)}}>
                                Listar
                            </MenuItem>
                            <MenuItem
                                icon={<GoDiffAdded />}
                                onClick={()=>{navigate(`/dmei-sys/entities/create`)}}>
                                Adicionar
                            </MenuItem>
                        </SubMenu>

                        <SubMenu label="Usuários" icon={<FaUsers />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/users`)}}>
                                Listar
                            </MenuItem>
                            
                            {JSON.parse(localStorage.getItem("user")).type === 1 ? (
                                <MenuItem
                                    icon={<GoDiffAdded />}
                                    onClick={()=>{navigate(`/dmei-sys/users/create`)}}>
                                    Adicionar
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    icon={<GoDiffAdded />}
                                    disabled>
                                    Adicionar
                                </MenuItem>
                            )}
                        </SubMenu>

                        <hr/>
                    </Menu>
                </Sidebar>
            </div>
        )
    }
    else if (signed.type === 3) {
        return (
            <div className='side-menu'>
                <Sidebar className='side-bar'>
                    <Menu transitionDuration={1000}>
                        <h1 className='title'>DMEIsys</h1>
                        <hr/>

                        <MenuItem
                            icon={<AiFillLayout />}
                            onClick={()=>{navigate(`/dmei-sys/anon/dashboard`)}}>
                            Dashboard
                        </MenuItem>

                        <hr/>

                        <SubMenu label="Externos" icon={<VscServerEnvironment />}>
                            <MenuItem
                                icon={<FaListUl />}
                                onClick={()=>{navigate(`/dmei-sys/anon/externals`)}}>
                                Listar
                            </MenuItem>
                        </SubMenu>

                        <hr/>
                    </Menu>
                </Sidebar>
            </div>
        )
    }
};