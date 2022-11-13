import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { AccidentsInterface } from "../models/Iacident";
import l1 from "../Icon/level1.png";
import l2 from "../Icon/level2.png";
import l3 from "../Icon/level3.png";
import FilterBar from "./filter";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Dialog from "@mui/material/Dialog";
import moment, { Moment } from "moment";
const apikey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
const asscessToken = process.env.REACT_APP_ACCESS_TOKEN;

type Dataprops = {
  filter: boolean;
  setfilter: (item: boolean) => void;
};

function MapsHere(props: Dataprops) {
  const [accidents, setAccident] = useState<AccidentsInterface[]>([]);
  const [selected, setSelected] = useState<AccidentsInterface>();
  const [imgUrl, setImgUrl] = useState(String);
  const [lat, setLat] = useState(13.752547578244073);
  const [lng, setLng] = useState(100.49271903050739);
  const [zoom, setZoom] = useState(7);

  const [date1, setDate1] = useState<Moment | null>(
    moment("00:00:00", "HH:mm:ss").add(-7, "days")
  );
  const [date2, setDate2] = useState<Moment | null>(
    moment("23:59:59", "HH:mm:ss")
  );
  const [today, setToday] = useState(false);
  const [sevenago, setSevenago] = useState(true);
  const [dateoption, setDateoption] = useState(false);
  const [level1, setLevel1] = useState(true);
  const [level2, setLevel2] = useState(true);
  const [level3, setLevel3] = useState(true);
  const [state1, setState1] = useState(true);
  const [state2, setState2] = useState(true);
  const [state3, setState3] = useState(false);
  const [imgpop, setImgpop] = useState(false);
  const levelacident = [level1, level2, level3];
  const level = [l1, l2, l3];
  const stateAcident = [state1, state2, state3];

  // async function getImg(imgID: String) {
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${asscessToken}`,
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   console.log(requestOptions);
  //   const response = await fetch(
  //     `https://api-data.line.me/v2/bot/message/${imgID}/content`,
  //     requestOptions
  //   );
  //   const imageBlob = await response.blob();
  //   const reader = new FileReader();
  //   reader.readAsDataURL(imageBlob);
  //   reader.onloadend = () => {
  //     const base64data = reader.result;
  //     setImgUrl(String(base64data));
  //   };
  // }
  const handleimg = () => {
    setImgpop(!imgpop);
  };
  // const getAccident = async () => {
  //   const apiUrl = "http://localhost:8080/accidents";
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   fetch(apiUrl, requestOptions)
  //     .then((response) => response.json())
  //     .then((res) => {
  //       if (res.data) {
  //         setAccident(res.data);
  //       } else {
  //         console.log("else");
  //       }
  //     });
  // };
  const getAccidentDate = async (date1: String, date2: String) => {
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
        console.log(res.data);
        setAccident(res.data);
      });
  };
  useEffect(() => {
    let startdate =
      date1?.toISOString().split("T")[0] +
      " " +
      date1?.toISOString().split("T")[1];
    let endtdate =
      date2?.toISOString().split("T")[0] +
      " " +
      date2?.toISOString().split("T")[1];
    getAccidentDate(startdate, endtdate);
  }, [date1, date2]);

  const mapContainerStyle = {
    width: "auto",
    height: "90vh",
  };

  const option = {
    disableDefaultUI: true,
    zoomControl: true,
  };
  const mapRef = React.useRef();
  const onMapload = React.useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: String(apikey),
    libraries: ["places"],
  });
  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded)
    return (
      <p>
        loading maps
        <CircularProgress color="success" />
      </p>
    );

  return (
    <div>
      <Drawer anchor={"top"} open={props.filter}>
        <FilterBar
          filter={props.filter}
          setfilter={props.setfilter}
          today={today}
          sevenago={sevenago}
          dateoption={dateoption}
          level1={(item: boolean) => setLevel1(item)}
          level2={(item: boolean) => setLevel2(item)}
          level3={(item: boolean) => setLevel3(item)}
          state1={(item: boolean) => setState1(item)}
          state2={(item: boolean) => setState2(item)}
          state3={(item: boolean) => setState3(item)}
          setToday={(item: boolean) => setToday(item)}
          setSevenago={(item: boolean) => setSevenago(item)}
          setDateoption={(item: boolean) => setDateoption(item)}
          levelacident={levelacident}
          stateAcident={stateAcident}
          date1={date1}
          date2={date2}
          setDate1={(item: Moment | null) => setDate1(item)}
          setDate2={(item: Moment | null) => setDate2(item)}
        />
        <Search
          panTo={(lat: number, lng: number) => {
            setLat(lat);
            setLng(lng);
            setZoom(11);
          }}
        />
      </Drawer>
      <div className="alevel">
        <Typography variant="h5">รายละเอียด</Typography>
        <br />
        <Stack direction="column">
          <Stack direction="row">
            <img src={l1} alt="level1" />
            <Typography variant="subtitle1">
              หมายถึง อุบัติเหตุระดับที่ 1 ไม่สร้างความบาดเจ็บ
            </Typography>
          </Stack>
          <Stack direction="row">
            <img src={l2} alt="level2" />
            <Typography variant="subtitle1">
              หมายถึง อุบัติเหตุระดับที่ 2 สร้างความบาดเจ็บเล็กน้อย
            </Typography>
          </Stack>
          <Stack direction="row">
            <img src={l3} alt="level3" />
            <Typography variant="subtitle1">
              หมายถึง อุบัติเหตุระดับที่ 3 สร้างความบาดเจ็บรุนแรง เช่น
              บาดเจ็บสาหัส พิการ หรือเสียชีวิต
            </Typography>
          </Stack>
        </Stack>
      </div>
      {imgpop && (
        <Dialog style={{ position: "absolute" }} open onClick={handleimg}>
          <img
            src={`data:image/jpeg;base64,${imgUrl}`}
            onClick={handleimg}
            alt="no image"
          />
        </Dialog>
      )}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={{ lat: lat, lng: lng }}
        options={option}
        onLoad={onMapload}
        // onZoomChanged={() => setZoom(zoom)}
      >
        {accidents
          .filter(
            (e) =>
              levelacident[e.LevelID - 1] && stateAcident[e.ProcessStatusID - 1]
          )
          .map((item: AccidentsInterface) => (
            <MarkerF
              zIndex={item.LevelID}
              key={String(item.ID)}
              position={
                new google.maps.LatLng(
                  Number(item.Latitude),
                  Number(item.Longitude)
                )
              }
              animation={google.maps.Animation.BOUNCE}
              icon={{
                url: level[Number(item.Level.ID) - 1],
                scaledSize: new window.google.maps.Size(60, 60),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(30, 13),
              }}
              onClick={() => {
                setSelected(item);
                setLat(Number(item.Latitude));
                setLng(Number(item.Longitude));

                setZoom(10);
              }}
            />
          ))}

        {selected ? (
          <InfoWindowF
            position={
              new google.maps.LatLng(
                Number(selected?.Latitude),
                Number(selected?.Longitude)
              )
            }
            onCloseClick={() => {
              setSelected(undefined);
            }}
          >
            <div className="Description">
              <h2>{selected.Level?.Name}</h2>
              <br />
              <div>
                <p>
                  รายละเอียดเหตุการณ์: {selected?.Description}
                  <br />
                  วันที่แจ้งเหตุ: {moment(selected.Time).format("DD MMMM YYYY")}
                  <br />
                  เวลาแจ้งเหตุ: {moment(selected.Time).format("HH:mm:ss")}
                  <br />
                  เบอร์ผู้แจ้งเหตุ: {selected.Contact}
                  <br />
                  สถานะการดำเนินการ: {selected.ProcessStatus.Name}
                </p>
                <img
                  src={`data:image/jpeg;base64,${selected.ImageID}`}
                  onClick={() => {
                    setImgUrl(selected.ImageID);
                    setImgpop(!imgpop);
                  }}
                  alt="รูปอุบัติเหตุ"
                />
              </div>
            </div>
          </InfoWindowF>
        ) : undefined}
      </GoogleMap>
    </div>
  );
}
export default MapsHere;

function Search(props: { panTo: (lat: number, lng: number) => void }) {
  const {
    ready,
    // value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new google.maps.LatLng(14.9798997, 102.0977693),
      radius: 200 * 1000,
    },
  });

  const defaultProps = {
    options: data,
    getOptionLabel: (option: google.maps.places.AutocompletePrediction) =>
      option.description,
  };

  return (
    <div className="search">
      <Autocomplete
        {...defaultProps}
        disabled={!ready}
        onChange={async (e, value) => {
          const address = value?.description;
          setValue(String(address), false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            props.panTo(lat, lng);
          } catch (error) {
            console.log("😱 Error: ", error);
          }
        }}
        onInputChange={(e, value) => {
          setValue(value);
        }}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="ค้นหาสถานที่" />}
      />
    </div>
  );
}
