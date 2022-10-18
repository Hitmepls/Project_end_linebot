import { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
type Dataprops = {
  data: string;
  setfilter: (item: boolean) => void;
};

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export default function Nav(props: Dataprops) {
  const [countAcident, setCountAcident] = useState(0);

  const getCountAccident = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${apiUrl}/accidents/count`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setCountAcident(res.data);
        } else {
          console.log("else");
        }
      });
  };
  useEffect(() => {
    getCountAccident();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <IconButton href="/" edge="start" color="inherit" aria-label="menu">
            <HomeIcon color="primary" />
          </IconButton>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
            {props.data}
          </Typography>

          {window.location.pathname === "/" && (
            <Button onClick={() => props.setfilter(true)} variant="outlined">
              <FilterListIcon color="primary" />
              ตัวกรอง
            </Button>
          )}
          <Button href="/Test" variant="outlined">
            Test
          </Button>
          <Badge badgeContent={countAcident} color="info">
            <MailIcon color="info" />
          </Badge>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
