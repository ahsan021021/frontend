import React, { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import EventModal from "./EventModal";
import axios from "axios";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { getMonth } from "./Month";
import { getDate } from "./Date";
import Calendar from "./Calendar";
import DayViewCalendar from "./DayViewCalendar";
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import "../css files/Calendar.scss";
import ViewEvents from "../components/ViewEvents";

export default function UserCalendar() {
  let navigate = useNavigate();

  // Fetch appointments from backend
  const getCalendarEvents = async () => {
    try {
      console.log("before authentication");
      const response = await axios.get("https://lead-savvy-backend-in-progress.onrender.com/api/appointments", { withCredentials: true });

      response.data.map((event) => {
        dispatchCallEvent({ type: "get", payload: event });
        console.log("after success authentication");
      });
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        console.log("failed authentication - navigating to signin");
        navigate("/signin");
      } else {
        console.error("Error fetching appointments:", err);
      }
    }
  };

  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentDate, setCurrentDate] = useState(getDate());
  const {
    monthIndex,
    showEventModal,
    viewEvents,
    showDayViewCalendar,
    showMonthViewCalendar,
    dateIndex,
    dispatchCallEvent,
  } = useContext(GlobalContext);

  // Fetch calendar events on component mount
  useEffect(() => {
    getCalendarEvents();
  }, []);

  // Update month or date views when the index changes
  useEffect(() => {
    if (showMonthViewCalendar) {
      setCurrentMonth(getMonth(monthIndex, dayjs().year()));
    }
    if (showDayViewCalendar) {
      setCurrentDate(getDate(monthIndex, dateIndex));
      const month = dayjs(new Date(dayjs().year(), monthIndex, dateIndex)).month();
      const year = dayjs(new Date(dayjs().year(), monthIndex, dateIndex)).year();
      setCurrentMonth(getMonth(month, year));
    }
  }, [monthIndex, dateIndex, showMonthViewCalendar, showDayViewCalendar]);

  return (
    <div>
      {viewEvents && <ViewEvents />}
      {showEventModal && <EventModal />}
      <NavBar date={currentDate} />
      <div className="main-container">
        <SideBar />
        {showMonthViewCalendar && <Calendar month={currentMonth} />}
        {showDayViewCalendar && <DayViewCalendar date={currentDate} />}
      </div>
    </div>
  );
}
