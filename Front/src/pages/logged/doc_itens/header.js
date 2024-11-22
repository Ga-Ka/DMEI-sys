// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import React from "react";
import SEMEC from "./SEMEC.png";

import '../../styles/read-one.css';

export default function DocumentHeader() {
    return(
        <div style={{display:'flex', justifyContent:'center'}}>
            <img alt="" src={SEMEC} width='175px' height='85px'/>

            <p style={{fontSize: "12px", textAlign:"left", marginLeft:'10px', marginBottom:'5px'}}>
                PREFEITURA MUNICIPAL DE TERESINA
                <br/>
                SECRETARIA MUNICIPAL DA EDUCAÇÃO E CULTURA - SEMEC
                <br/>
                DIVISÃO DE MANUTENÇÃO EM EQUIPAMENTOS DE INFORMÁTICA - DMEI
                <br/>
                RUA: LISANDRO NOGUEIRA,1790 CENTRO-NORTE
                <br/>
                TEL: (86)3221-9044 / 3215-7975 / 218
            </p>
        </div>
    );
};