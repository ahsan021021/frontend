import React, { useContext, useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Guid from "guid";
import axios from "axios";
import "../css files/EventModal.scss";
import EventCalendar from "./EventCalendar";
import GlobalContext from "../context/GlobalContext";
import "simplebar";
import "simplebar/dist/simplebar.css";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faClock, faBookmark, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

const labelsClasses = ["blue", "gray", "green", "indigo", "red", "purple"];

let useClickOutside = (handler) => {
  let domNode = useRef();
  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", maybeHandler);
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });
  return domNode;
};

export default function EventModal() {
  const modalRef = useRef();
  const delteConfirmationModalRef = useRef();
  const {
    savedEvents,
    startDateTime,
    endDateTime,
    setStartDateTime,
    setEndDateTime,
    setDayViewLabel,
    title,
    setTitle,
    addTime,
    setAddTime,
    daySelected,
    dispatchCallEvent,
    selectedEvent,
    setShowEventModal,
    setTrackLabel,
    timeSlots,
  } = useContext(GlobalContext);

  const [addDescription, setAddDescription] = useState(
    selectedEvent ? selectedEvent.addDescription : ""
  );

  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((labelClass) => labelClass === selectedEvent.label)
      : labelsClasses[0]
  );

  function handleSubmit(e) {
    const appointment = {
      eventId: selectedEvent ? selectedEvent.eventId : Guid.EMPTY,
      title: title,
      addDescription: addDescription,
      startTime: moment(daySelected.format("YYYY-MM-DD") + " " + startDateTime, "YYYY-MM-DD HH:mm").format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      endTime: moment(daySelected.format("YYYY-MM-DD") + " " + endDateTime, "YYYY-MM-DD HH:mm").format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      label: selectedLabel,
      status: "Scheduled",
    };

    if (selectedEvent) {
      // Update an existing appointment
      axios
        .put(`https://lead-savvy-backend-in-progress.onrender.com/api/appointments/${selectedEvent.eventId}`, appointment, {
          withCredentials: true,
        })
        .then((response) => {
          dispatchCallEvent({
            type: "update",
            payload: savedEvents.map((evt) =>
              evt.eventId === response.data.eventId ? response.data : evt
            ),
          });
        });
    } else {
      // Add a new appointment
      axios
        .post("https://lead-savvy-backend-in-progress.onrender.com/api/appointments", appointment, { withCredentials: true })
        .then((response) => {
          dispatchCallEvent({ type: "push", payload: response.data });
        })
        .catch((error) => {
          alert("The event already exists in this time slot");
        });
    }

    setShowEventModal(false);
    setDayViewLabel("blue");
    setAddTime(true);
    setStartDateTime("");
    setEndDateTime("");
    setTitle("");
  }

  let domNode = useClickOutside(() => {
    setShowEventModal(false);
  });

  function handleDelete() {
    if (selectedEvent) {
      axios
        .delete(`https://lead-savvy-backend-in-progress.onrender.com/api/appointments/${selectedEvent.eventId}`, {
          withCredentials: true,
        })
        .then((response) => {
          dispatchCallEvent({
            type: "delete",
            payload: savedEvents.filter((evt) => evt.eventId !== selectedEvent.eventId),
          });
        })
        .catch((err) => {
          console.error("Failed to delete the event:", err);
        });
    }
    setShowEventModal(false);
  }

  useEffect(() => {
    setTrackLabel(selectedLabel);
  }, [selectedLabel]);

  return (
    <div className="event-modal-container">
      <div className="event-modal" ref={domNode}>
        <Modal ref={modalRef}>
          <div className="modal-flex">
            <div className="modal-text">Discard unsaved changes?</div>
            <div className="modal-button-flex">
              <button
                className="modal-button"
                style={{ backgroundColor: "blue" }}
                onClick={() => {
                  modalRef.current.close();
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button"
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  setShowEventModal(false);
                  modalRef.current.close();
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </Modal>
        <header className="event-modal-header">
          {selectedEvent && (
            <button className="event-modal-delete" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          <button
            className="event-modal-close"
            onClick={() => {
              if (selectedEvent || title !== "") {
                modalRef.current.open();
              } else {
                setShowEventModal(false);
              }
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>
        <div className="event-modal-content">
          <input
            type="text"
            placeholder="Add title and time"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="event-modal-input-field"
          />
          {/* Add more fields and controls as necessary */}
          <footer className="save-event">
            <button type="submit" className="save" onClick={handleSubmit}>
              Save
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
