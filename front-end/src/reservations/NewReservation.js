import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

export default function NewReservation() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  let history = useHistory();
  const [reservationError, setReservationError] = useState(null);
  

    function handleSubmit(event) {
      event.preventDefault();
      const abortController = new AbortController();
      setReservationError(null)
      createReservation(formData)
          .then(() => history.push(`/dashboard/?date=${formData.reservation_date}`) 
      )
      .catch(setReservationError)
      return () => abortController.abort();

    // setFormData({
    //   first_name: "",
    //   last_name: "",
    //   mobile_number: "",
    //   reservation_date: "",
    //   reservation_time: "",
    //   people: "",
    // });
  }
  function handleChange({ target: { name, value } }) {
    setFormData((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }
  return (
    <main className="container-fluid mt-3">
      <form className="reservation-form" onSubmit={handleSubmit}>
      <h1 className="mx-2 mt-4">New Reservation</h1>
      {reservationError &&
        reservationError.message.map((err, i) => (
          <p key={i} className="alert alert-danger">
            {err}
          </p>
        ))}
      <label>
        First Name:
        <input
          name="first_name"
          type="text"
          id="first_name"
          placeholder="John"
          required={true}
          value={formData.first_name}
          onChange={handleChange}
        />
      </label>
      <label>
        Last Name:
        <input
          name="last_name"
          type="text"
          id="last_name"
          placeholder="Smith"
          required={true}
          value={formData.last_name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Mobile Number:
        <input
          name="mobile_number"
          type="tel"
          id="mobile_number"
          placeholder="xxx-xxx-xxx"
          // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required={true}
          value={formData.mobile_number}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Date of Reservation:
        <input
          name="reservation_date"
          type="date"
          id="reservation_date"
          required={true}
          value={formData.reservation_date}
          onChange={handleChange}
        />
      </label>
      <label>
        Time of Reservation:
        <input
          name="reservation_time"
          type="time"
          id="reservation_time"
          required={true}
          value={formData.reservation_time}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Number of People in Party:
        <input
          name="people"
          type="number"
          id="people"
          placeholder="minimum 1 person"
          min="1"
          required={true}
          value={formData.people}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <button className="btn btn-danger" onClick={history.goBack}>
        Cancel
      </button>
    </form>
    </main>
    
  );
}
