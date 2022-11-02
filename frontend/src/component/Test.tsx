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
    console.log(moment(date2).add(-7, "days").format("YYYY-MM-DD"));
  };
  const getAccident = async (date1?: String, date2?: String) => {
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
  useEffect(() => {
    getAccident(date1?.toISOString(), date2?.toISOString());
  }, [date1, date2]);
  return (
    <div>
      <br />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="เริ่มต้น"
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
          value={date2}
          minDate={date1}
          maxDate={moment()}
          onChange={(newValue) => {
            setDate2(newValue);
          }}
        />
      </LocalizationProvider>

      {accidents.map((e) => (
        <p>{moment(e.Time).format("YYYY-MM-DD hh:mm:SS a")}</p>
      ))}

      <p>{result}</p>
      <button onClick={comparedate}>click</button>
    </div>
  );
}
