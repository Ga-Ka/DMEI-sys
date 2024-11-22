// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth.js';

import Login from '../pages/login/login.js';

import Dashboard from '../pages/logged/dashboard/dashboard.js';
import Records from '../pages/logged/records/read.js';

import Users from '../pages/logged/users/read.js';
import CreateUser from '../pages/logged/users/create.js';
import UpdateUser from '../pages/logged/users/update.js';
import User from '../pages/logged/users/user.js';

import Entities from '../pages/logged/entities/read.js';
import CreateEntity from '../pages/logged/entities/create.js';
import UpdateEntity from '../pages/logged/entities/update.js';
import Entity from '../pages/logged/entities/entity.js';

import Machines from '../pages/logged/machines/read.js';
import CreateMachine from '../pages/logged/machines/create.js';
import UpdateMachine from '../pages/logged/machines/update.js';
import Machine from '../pages/logged/machines/machine.js';


import Substitutions from '../pages/logged/documents/substitutions/read.js';
import SubstitutionCreateDOC from '../pages/logged/documents/substitutions/create.js';
import SubstitutionUpload from '../pages/logged/documents/substitutions/upload.js';
import Substitution from '../pages/logged/documents/substitutions/substitution.js';

import Loans from '../pages/logged/documents/loans/read.js';
import LoanCreateDOC from '../pages/logged/documents/loans/create.js';
import LoanUpload from '../pages/logged/documents/loans/upload-loan.js';
import ReturnUpload from '../pages/logged/documents/loans/upload-return.js';
import Loan from '../pages/logged/documents/loans/loan.js';

import Deliveries from '../pages/logged/documents/deliveries/read.js';
import DeliveryCreateDOC from '../pages/logged/documents/deliveries/create.js';
import DeliveryUpload from '../pages/logged/documents/deliveries/upload.js';
import Delivery from '../pages/logged/documents/deliveries/delivery.js';

import Dispatches from '../pages/logged/documents/dispatches/read.js';
import DispatchCreateDOC from '../pages/logged/documents/dispatches/create.js';
import DispatchUpload from '../pages/logged/documents/dispatches/upload.js';
import Dispatch from '../pages/logged/documents/dispatches/dispatch.js';

import Deactivations from '../pages/logged/documents/deactivations/read.js';
import DeactivationCreateDOC from '../pages/logged/documents/deactivations/create.js';
import DeactivationUpload from '../pages/logged/documents/deactivations/upload.js';
import Deactivation from '../pages/logged/documents/deactivations/deactivation.js';

import Requests from '../pages/logged/documents/requests/read.js';
import RequestCreateDOC from '../pages/logged/documents/requests/create.js';
import Request from '../pages/logged/documents/requests/request.js';

import Devolutions from '../pages/logged/documents/devolutions/read.js';
import DevolutionCreateDOC from '../pages/logged/documents/devolutions/create.js';
import Devolution from '../pages/logged/documents/devolutions/devolution.js';
import DevolutionUpload from '../pages/logged/documents/devolutions/upload.js';


import Internals from '../pages/logged/internals/read.js';
import CreateInternal from '../pages/logged/internals/create.js';
import UpdateInternal from '../pages/logged/internals/update.js';
import Internal from '../pages/logged/internals/internal.js';
import InternalsTerminateds from '../pages/logged/internals/terminateds.js';
import TerminateInternal from '../pages/logged/internals/terminate.js';
import InternalGenerateDOC from '../pages/logged/internals/doc_generate/document.js';

import Externals from '../pages/logged/externals/read.js';
import CreateExternal from '../pages/logged/externals/create.js';
import UpdateExternal from '../pages/logged/externals/update.js';
import External from '../pages/logged/externals/external.js';
import ExternalReport from '../pages/logged/externals/doc_generate/report.js';

import Inputs from '../pages/logged/input/read.js';
import CreateInput from '../pages/logged/input/create.js';
import UpdateInput from '../pages/logged/input/update.js';
import InputEquip from '../pages/logged/input/input.js';
import InputsTerminateds from '../pages/logged/input/terminateds.js';
import TerminateInput from '../pages/logged/input/terminate.js';
import InputGenerateEntry from '../pages/logged/input/doc_generate/entry.js';
import InputGenerateExit from '../pages/logged/input/doc_generate/exit.js';

import AnonExternals from '../pages/anonymous/externals/read.js';
import AnonExternal from '../pages/anonymous/externals/external.js';

import NotFounded from '../components/not_founded/not_founded.js';


const Private = ({ Logged, Anonymous }) => {
    const { signed } = useAuth();
    const location = useLocation().pathname;
    const navigate = useNavigate();

    if (signed) {
        switch (signed.type) {
            case 1: case 2: // Usuário ADM ou Comum
                if (location.slice(0,15) === `/dmei-sys/anon/`) return navigate(`/dmei-sys/dashboard`);
                else return <Logged/>;
            case 3: // Usuário Anônimo
                if (location.slice(0,15) === `/dmei-sys/anon/`) return <Anonymous/>;
                else return navigate(`/dmei-sys/anon/dashboard`);
            default:
                break;
        }
    } else {
        const userSaved = JSON.parse(localStorage.getItem("user"))
        if(!userSaved === true) return <Login/>
    }
};

export default function UserRoutes() {
    return (
        <Routes basename='/dmei-sys'>
            <Route path="/dmei-sys" element={<Login/>}/>

            <Route path="/dmei-sys/dashboard" element={<Private Logged={Dashboard}/>}/>
            
            <Route path="/dmei-sys/users" element={<Private Logged={Users}/>}/>
            <Route path="/dmei-sys/users/create" element={<Private Logged={CreateUser}/>}/>
            <Route path="/dmei-sys/users/:id/update" element={<Private Logged={UpdateUser}/>}/>
            <Route path="/dmei-sys/users/:id" element={<Private Logged={User}/>}/>

            <Route path="/dmei-sys/entities" element={<Private Logged={Entities}/>}/>
            <Route path="/dmei-sys/entities/create" element={<Private Logged={CreateEntity}/>}/>
            <Route path="/dmei-sys/entities/:id/update" element={<Private Logged={UpdateEntity}/>}/>
            <Route path="/dmei-sys/entities/:id" element={<Private Logged={Entity}/>}/>

            <Route path="/dmei-sys/machines" element={<Private Logged={Machines}/>}/>
            <Route path="/dmei-sys/machines/create" element={<Private Logged={CreateMachine}/>}/>
            <Route path="/dmei-sys/machines/:id/update" element={<Private Logged={UpdateMachine}/>}/>
            <Route path="/dmei-sys/machines/:id" element={<Private Logged={Machine}/>}/>
            
            <Route path="/dmei-sys/machines/records" element={<Private Logged={Records}/>}/>


            <Route path="/dmei-sys/documents/deactivations/" element={<Private Logged={Deactivations}/>}/>
            <Route path="/dmei-sys/documents/deactivations/create" element={<Private Logged={DeactivationCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/deactivations/:id/:year" element={<Private Logged={Deactivation}/>}/>
            <Route path="/dmei-sys/documents/deactivations/upload/:id/:year" element={<Private Logged={DeactivationUpload}/>}/>

            <Route path="/dmei-sys/documents/dispatches/" element={<Private Logged={Dispatches}/>}/>
            <Route path="/dmei-sys/documents/dispatches/create" element={<Private Logged={DispatchCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/dispatches/:id/:year" element={<Private Logged={Dispatch}/>}/>
            <Route path="/dmei-sys/documents/dispatches/upload/:id/:year" element={<Private Logged={DispatchUpload}/>}/>
            
            <Route path="/dmei-sys/documents/deliveries/" element={<Private Logged={Deliveries}/>}/>
            <Route path="/dmei-sys/documents/deliveries/create" element={<Private Logged={DeliveryCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/deliveries/:id/:year" element={<Private Logged={Delivery}/>}/>
            <Route path="/dmei-sys/documents/deliveries/upload/:id/:year" element={<Private Logged={DeliveryUpload}/>}/>

            <Route path="/dmei-sys/documents/loans/" element={<Private Logged={Loans}/>}/>
            <Route path="/dmei-sys/documents/loans/create" element={<Private Logged={LoanCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/loans/:id/:year" element={<Private Logged={Loan}/>}/>
            <Route path="/dmei-sys/documents/loans/upload/:id/:year/loan" element={<Private Logged={LoanUpload}/>}/>
            <Route path="/dmei-sys/documents/loans/upload/:id/:year/return" element={<Private Logged={ReturnUpload}/>}/>

            <Route path="/dmei-sys/documents/substitutions/" element={<Private Logged={Substitutions}/>}/>
            <Route path="/dmei-sys/documents/substitutions/create" element={<Private Logged={SubstitutionCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/substitutions/:id/:year" element={<Private Logged={Substitution}/>}/>
            <Route path="/dmei-sys/documents/substitutions/upload/:id/:year" element={<Private Logged={SubstitutionUpload}/>}/>

            <Route path="/dmei-sys/documents/requests/" element={<Private Logged={Requests}/>}/>
            <Route path="/dmei-sys/documents/requests/create" element={<Private Logged={RequestCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/requests/:id/:year" element={<Private Logged={Request}/>}/>

            <Route path="/dmei-sys/documents/devolutions/" element={<Private Logged={Devolutions}/>}/>
            <Route path="/dmei-sys/documents/devolutions/create" element={<Private Logged={DevolutionCreateDOC}/>}/>
            <Route path="/dmei-sys/documents/devolutions/:id/:year" element={<Private Logged={Devolution}/>}/>
            <Route path="/dmei-sys/documents/devolutions/upload/:id/:year" element={<Private Logged={DevolutionUpload}/>}/>


            <Route path="/dmei-sys/internals" element={<Private Logged={Internals}/>}/>
            <Route path="/dmei-sys/internals/create" element={<Private Logged={CreateInternal}/>}/>
            <Route path="/dmei-sys/internals/:id/update" element={<Private Logged={UpdateInternal}/>}/>
            <Route path="/dmei-sys/internals/:id" element={<Private Logged={Internal}/>}/>
            <Route path="/dmei-sys/internals/:id/document" element={<Private Logged={InternalGenerateDOC}/>}/>

            <Route path="/dmei-sys/internals/terminate" element={<Private Logged={TerminateInternal}/>}/>
            <Route path="/dmei-sys/internals/terminateds" element={<Private Logged={InternalsTerminateds}/>}/>
            <Route path="/dmei-sys/internals/terminateds/:id/update" element={<Private Logged={UpdateInternal}/>}/>
            <Route path="/dmei-sys/internals/terminateds/:id" element={<Private Logged={Internal}/>}/>
            <Route path="/dmei-sys/internals/terminateds/:id/document" element={<Private Logged={InternalGenerateDOC}/>}/>

            <Route path="/dmei-sys/externals" element={<Private Logged={Externals}/>}/>
            <Route path="/dmei-sys/externals/create" element={<Private Logged={CreateExternal}/>}/>
            <Route path="/dmei-sys/externals/:id/update" element={<Private Logged={UpdateExternal}/>}/>
            <Route path="/dmei-sys/externals/:id" element={<Private Logged={External}/>}/>
            <Route path="/dmei-sys/externals/:id/report" element={<Private Logged={ExternalReport}/>}/>

            <Route path="/dmei-sys/inputs" element={<Private Logged={Inputs}/>}/>
            <Route path="/dmei-sys/inputs/create" element={<Private Logged={CreateInput}/>}/>
            <Route path="/dmei-sys/inputs/:id/update" element={<Private Logged={UpdateInput}/>}/>
            <Route path="/dmei-sys/inputs/:id" element={<Private Logged={InputEquip}/>}/>
            <Route path="/dmei-sys/inputs/:id/entry" element={<Private Logged={InputGenerateEntry}/>}/>
            <Route path="/dmei-sys/inputs/:id/exit" element={<Private Logged={InputGenerateExit}/>}/>

            <Route path="/dmei-sys/inputs/terminate" element={<Private Logged={TerminateInput}/>}/>
            <Route path="/dmei-sys/inputs/terminateds" element={<Private Logged={InputsTerminateds}/>}/>
            <Route path="/dmei-sys/inputs/terminateds/:id/update" element={<Private Logged={UpdateInput}/>}/>
            <Route path="/dmei-sys/inputs/terminateds/:id" element={<Private Logged={InputEquip}/>}/>
            <Route path="/dmei-sys/inputs/terminateds/:id/entry" element={<Private Logged={InputGenerateEntry}/>}/>
            <Route path="/dmei-sys/inputs/terminateds/:id/exit" element={<Private Logged={InputGenerateExit}/>}/>

            <Route path="/dmei-sys/anon/externals" element={<Private Anonymous={AnonExternals}/>}/>
            <Route path="/dmei-sys/anon/externals/:id" element={<Private Anonymous={AnonExternal}/>}/>
            <Route path="/dmei-sys/anon/dashboard" element={<Private Anonymous={Dashboard}/>}/>
            
            <Route path="*" element={<NotFounded/>}/>
        </Routes>
    )
};
