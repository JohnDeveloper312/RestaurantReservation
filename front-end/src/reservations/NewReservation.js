import React, { useState} from "react";
import { useHistory} from "react-router-dom";
import { createReservation} from "../utils/api";

export default function NewReservation() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: '',
  });


  let history = useHistory();

  function handleSubmit(event) {
    event.preventDefault();
    createReservation(formData).then(() => {
      history.push(`/dashboard/?date=${formData.reservation_date}`);
    });
    setFormData({
      first_name: '',
      last_name: '',
      mobile_number: '',
      reservation_date: '',
      reservation_time: '',
      people: '',
    });
  }
  function handleChange({ target: { name, value } }) {
    setFormData((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }
  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          name="first_name"
          type="text"
          placeholder="John"
          required
          value={formData.first_name}
          onChange={handleChange}
        />
      </label>
      <label>
        Last Name:
        <input
          name="last_name"
          type="text"
          placeholder="Smith"
          required
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
          placeholder="xxx-xxx-xxx"
          // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
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
          required
          value={formData.reservation_date}
          onChange={handleChange}
        />
      </label>
      <label>
        Time of Reservation:
        <input
          name="reservation_time"
          type="time"
          required
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
          placeholder="minimum 1 person"
          min="1"
          required
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
  );
}