import React from "react";
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
    if (event.target.id === acidentStatus[1])
      props.state2(event.target.checked);
  };
  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid xs={12}>
            <Item elevation={0}>
              <Typography variant="h5" color="primary">
                ตัวกรองข้อมูล
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={4} padding={1}>
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
          <Grid item xs={4} padding={1}>
            <Item elevation={0}>
              <Typography>สถานะการดำเนินการ</Typography>
              <FormGroup>
                {acidentStatus.map((e) => (
                  <FormControlLabel
                    key={e}
                    disabled={acidentStatus.indexOf(e) == 2 ? true : false}
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
          <Grid item xs={4} padding={1}>
            <Item elevation={0}>
              <Typography>สถานที่</Typography>
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
