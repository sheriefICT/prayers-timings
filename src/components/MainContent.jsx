import "../App.css";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "../components/Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";

moment.locale = "ar";
export default function MainContent() {
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Sunset: "18:03",
    Isha: "19:33",
  });

  const [selictedcety, setselictedcety] = useState({
    displayName: "القاهره",
    apiName: "Cairo",
  });

  const availableCities = [
    {
      displayName: "القاهره",
      apiName: "Cairo",
    },
    {
      displayName: "الاسكندريه",
      apiName: "Alexandria",
    },
    {
      displayName: "المنيا ",
      apiName: "Al Minya",
    },
  ];
  const prayergArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const [today, setToday] = useState("");

  // const [timer, setTimer] = useState(10);
  const [remainingTime, setRemainingTime] = useState(""); 

  const handleCtyChange = (event) => {
    const cityobject = availableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    setselictedcety(cityobject);
  };

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selictedcety.apiName}`
    );
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, [selictedcety]);

  useEffect(() => {
    const to = moment();
    setToday(to.format("MMM Do YYYY | h:mm"));

    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayergArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDiffernce = midnightDiff + fajrToMidnightDiff;
      remainingTime = totalDiffernce;
    }
    console.log(remainingTime);
    const durationRemainingTime = moment.duration(remainingTime);
    setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}` )
    console.log(
      "duration issss ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );

    const Isha = timings["Isha"];
    const IshaMoment = moment(Isha, "hh:mm");
    console.Log(momentNow.isBefore(IshaMoment));
  };

  return (
    <>
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{selictedcety.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2> متبقي حتي صلاه {prayergArray[nextPrayerIndex].displayName}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider
        style={{ borderColor: "white", opacity: "0.1", marginTop: "25px" }}
      />

      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "15px" }}
      >
        <Prayer name="الفجر" time={timings.Fajr} image="fajer" />
        <Prayer name="الظهر" time={timings.Dhuhr} image="fajer" />
        <Prayer name="العصر" time={timings.Asr} image="fajer" />
        <Prayer name="المغرب" time={timings.Sunset} image="fajer" />
        <Prayer name="العشاء" time={timings.Isha} image="fajer" />
      </Stack>

      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "25px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينه</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCtyChange}
          >
            {availableCities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
