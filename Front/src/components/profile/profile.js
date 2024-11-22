// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React, { useState, useEffect } from 'react';

import useAuth from '../../contexts/useAuth';

import { MdLogout } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Input, Label } from 'reactstrap';

import './profile.css';

export default function Profile() {
    const { signed, signout } = useAuth();

    const [theme, setTheme] = useState(false);
    useEffect(() => {
        if (theme === true) {
            document.getElementById('root').className = 'light';
            if (document.getElementById('theme-color') !== null) document.getElementById('theme-color').textContent = 'Claro';
        } else {
            document.getElementById('root').className = 'dark';
            if (document.getElementById('theme-color') !== null) document.getElementById('theme-color').textContent = 'Escuro';
        }
    },[theme])

    const logout = () => {
        signout();
    };
    if (signed === null) {
        return ('');
    }
    else {
        const userName = JSON.parse(localStorage.getItem("user")).nickname;

        return(
            <UncontrolledDropdown className='profile'>
                <DropdownToggle
                    caret
                    color="light"
                >
                    <FaUser/>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem text>
                        @{userName}
                    </DropdownItem>
                    <hr/>
                    <FormGroup switch style={{textAlign:'left', padding:'0px 10px', alignContent:'center'}}>
                        <Input
                            style={{
                                marginTop:'4px',
                                marginBottom:'4px',
                                marginLeft:'4px',
                                marginRight:'8px'
                            }}
                            type="switch"
                            defaultChecked={false}
                            onClick={() => {
                                setTheme(!theme);
                            }}
                        />
                        <Label id='theme-color'>Tema</Label>
                    </FormGroup>
                    <hr/>
                    <DropdownItem
                        onClick={logout}>
                        Sair <MdLogout />
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }
};