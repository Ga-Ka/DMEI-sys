// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import axios from 'axios';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ZonesGraph(){
    const [ver, setVer] = useState(true);
    const [zones, setZones] = useState(null);

    //Getting users
    useEffect(() => {
        axios.get(`http://10.10.135.100:3002/api/zones`,)
        .then((res) => {
            if (res.data.length !== 0){
                setZones(res.data);
            } else {
                setZones([{zonename:'Aguardando Atendimentos', zonecolor:'#378', score:1}])
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ver]);

    //Reload after 5 seconds
    setTimeout(() => {
        setVer(!ver);
    }, 5000);

    const zonesData = zones?.map((obj) => {
        return {
            name: String(obj.zonename.charAt(0).toUpperCase() + obj.zonename.slice(1).toLowerCase()),
            fill: obj.zonecolor,
            value: obj.score,
        };
    });

    const renderLabel = ({ percent }) => {
        return (`${(percent * 100).toFixed(1)}%`);
    };

    return (
        <ResponsiveContainer width={'100%'} height={300}>
            <PieChart>
            <Pie
                dataKey="value"
                data={zonesData}
                outerRadius={100}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderLabel}
            />
                <Legend />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}