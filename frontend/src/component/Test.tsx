import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { AccidentsInterface } from "../models/Iacident";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
export default function Test() {
  const [date1, setDate1] = useState<Moment | null>(moment().add(-7, "days"));
  const [accidents, setAccident] = useState<AccidentsInterface[]>([]);
  const [date2, setDate2] = useState<Moment | null>(moment());
  const [result, setResult] = useState("คลิกเลย");

  const comparedate = () => {
    let startdate =
      date1?.toISOString().split("T")[0] +
      " " +
      date1?.toISOString().split("T")[1];
    let endtdate =
      date2?.toISOString().split("T")[0] +
      " " +
      date2?.toISOString().split("T")[1];
    getAccident(startdate, endtdate);
  };
  const getAccident = async (date1: String, date2: String) => {
    const apiUrl = `http://localhost:8080/accidentsFromDate/${date1}/${date2}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setAccident(res.data);
      });
  };

  return (
    <div>
      <br />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="เริ่มต้น"
          ampm={false}
          inputFormat="DD-MM-YYYY HH:mm:ss"
          value={date1}
          maxDate={date2}
          onChange={(newValue) => {
            setDate1(newValue);
          }}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="สิ้นสุด"
          inputFormat="DD-MM-YYYY HH:mm:ss"
          disableFuture={true}
          ampm={false}
          value={date2}
          minDate={date1}
          onChange={(newValue) => {
            setDate2(newValue);
          }}
        />
      </LocalizationProvider>

      {accidents.map((e) => (
        <div>
          <p>{moment(e.Time).format("DD-MM-YYYY HH:mm:ss ")}</p>
        </div>
      ))}

      <p>{result}</p>
      <button onClick={comparedate}>click</button>
    </div>
  );
}
