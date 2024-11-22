// Projeto realizado por
// Gabriel Oliveira -> https://github.com/gabriel-codart
// Kaylanne Santos -> https://github.com/kaylannesantos

import { React, useEffect, useState } from "react";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Select from "react-select";

export default function HistoryGraph() {
  const [ver, setVer] = useState(true);
  const [yearsList, setYearsList] = useState([]);
  const [year, setYear] = useState({
    value: String(new Date().getFullYear()),label: String(new Date().getFullYear())
  });
  const [historic, setHistoric] = useState([]);

  //Month Names
  const months = [
    {name:'Jan'},
    {name:'Fev'},
    {name:'Mar'},
    {name:'Abr'},
    {name:'Mai'},
    {name:'Jun'},
    {name:'Jul'},
    {name:'Ago'},
    {name:'Set'},
    {name:'Out'},
    {name:'Nov'},
    {name:'Dez'},
  ]
  //Getting Historic
  useEffect(() => {
    axios.get(`http://10.10.135.100:3002/api/historic-years`)
    .then((res) => {
      setYearsList(res.data?.map((obj) => {
        return {
          value: obj.year,
          label: obj.year,
        }}));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ver]);

  //Reload after 5 seconds
  setTimeout(() => {
    setVer(!ver);
  }, 5000);

  //Getting Historic
  useEffect(() => {
    axios.get(`http://10.10.135.100:3002/api/historic/${year.value}`)
    .then((res) => {
      setHistoric(res.data?.map((obj) => {
        return {
          name: months[obj.month-1].name,
          Saída: obj.exits,
          Entrada: obj.inputs,
        }}));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  return (
    <>
      <div style={{display:'flex', justifyContent:'center'}}>
        <Select
          options={yearsList}
          defaultValue={year}
          value={year}
          onChange={setYear}
        />
      </div>
      
      <ResponsiveContainer width={'100%'} height={400}>
        <div>
          <LineChart
            width={950}
            height={400}
            data={historic}
            margin={{
              top: 30,
              right: 50,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Saída" stroke="#85d" />
            <Line type="monotone" dataKey="Entrada" stroke="#826" />
          </LineChart>
        </div>
      </ResponsiveContainer>
    </>
  );
}