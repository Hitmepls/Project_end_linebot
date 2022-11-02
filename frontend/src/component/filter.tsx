import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Container from "@material-ui/core/Container";
import moment, { Moment } from "moment";
import { AccidentsInterface } from "../models/Iacident";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
const levelText = ["ระดับ 1", "ระดับ 2", "ระดับ 3"];
const acidentStatus = [
  "รอดำเนินการ",
  "กำลังดำเนินการ",
  "ได้รับการช่วยเหลือแล้ว",
];
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body1,
  padding: theme.spacing(1),
  textAlign: "center",
}));
type Dataprops = {
  filter: boolean;
  setfilter: (item: boolean) => void;
  level1: (item: boolean) => void;
  level2: (item: boolean) => void;
  level3: (item: boolean) => void;
  state1: (item: boolean) => void;
  state2: (item: boolean) => void;
  state3: (item: boolean) => void;
  levelacident: boolean[];
  stateAcident: boolean[];
};

export default function Filter(props: Dataprops) {
  const [date1, setDate1] = useState<Moment | null>(moment().add(-7, "days"));
  const [date2, setDate2] = useState<Moment | null>(moment());
  const handleLevelChange = (
    event: React.ChangeEvent<{ id?: string; checked: any }>
  ) => {
    if (event.target.id === levelText[0]) props.level1(event.target.checked);
    if (event.target.id === levelText[1]) props.level2(event.target.checked);
    if (event.target.id === levelText[2]) props.level3(event.target.checked);
  };

  const handleStateChange = (
    event: React.ChangeEvent<{ id?: string; checked: any }>
  ) => {
    if (event.target.id === acidentStatus[0])
      props.state1(event.target.checked);
    if (event.target.id === acidentStatus[1])
      props.state2(event.target.checked);
    if (event.target.id === acidentStatus[2])
      props.state3(event.target.checked);
  };
  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0} alignItems="stretch">
          <Grid xs={12}>
            <Item elevation={0}>
              <Typography variant="h5" color="primary">
                ตัวกรองข้อมูล
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={3} md={3} padding={1}>
            <Item elevation={0}>
              <Typography>แสดงระดับความรุนแรง</Typography>
              {levelText.map((e) => (
                <FormControlLabel
                  key={e}
                  control={
                    <Checkbox
                      id={e}
                      checked={props.levelacident[levelText.indexOf(e)]}
                      onChange={handleLevelChange}
                    />
                  }
                  label={e}
                />
              ))}
            </Item>
          </Grid>
          <Grid item xs={3} md={2} padding={1}>
            <Item elevation={0}>
              <Typography>สถานะการดำเนินการ</Typography>
              <FormGroup>
                {acidentStatus.map((e) => (
                  <FormControlLabel
                    key={e}
                    control={
                      <Checkbox
                        id={e}
                        checked={props.stateAcident[acidentStatus.indexOf(e)]}
                        onChange={handleStateChange}
                      />
                    }
                    label={e}
                  />
                ))}
              </FormGroup>
            </Item>
          </Grid>
          <Grid item xs={3} md={2} padding={1}>
            <Item elevation={0}>
              <Typography>สถานที่</Typography>
            </Item>
          </Grid>
          <Grid item xs={3} md={5} padding={1}>
            <Item elevation={1}>
              <Typography>วันที่</Typography>
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
            </Item>
            <Item elevation={0}>
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
            </Item>
          </Grid>
          <Grid item xs={12} padding={1}>
            <Item elevation={0}>
              <Button
                variant="contained"
                color="error"
                onClick={() => props.setfilter(false)}
              >
                ปิด
              </Button>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
