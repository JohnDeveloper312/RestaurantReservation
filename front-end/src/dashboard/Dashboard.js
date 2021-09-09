import React, { useEffect, useState } from "react";
import { listReservations, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ViewTable from "../tables/ViewTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  const history = useHistory();

  const handlePreviousDateClick = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDateClick = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const todaysDate = () => {
    history.push(`dashboard?date=${today(date)}`);
  };

  // function clickHandler(reservation, newStatus) {
  //   updateReservation(reservation, newStatus)
  //     .then(loadDashboard)
  //     .catch(setReservationsError);

  // }

  async function handleCancel(reservation_id) {
    
    if (
      window.confirm(
        "Do you want to cancel this reservation? \n \n \nThis cannot be undone."
      )
    ) {
      try{
      await updateReservation({reservation_id}, "cancelled")
      await loadDashboard();
    }catch(error){
      console.log(error);
    }
    }
  }

  const content = reservations.map((res, i) => (
    <div key={i}>
      {res.status !== "finished" && (
        <>
          <div className="d-flex align-items-center">
            <div className="col-2">
              <p>{res.first_name}</p>
            </div>
            <div className="col-2">
              <p>{res.last_name}</p>
            </div>
            <div className="col-2">
              <p>{res.mobile_number}</p>
            </div>
            <div className="col-2">
              <p>{res.reservation_time}</p>
            </div>
            <div className="col-2">
              <p>{res.people}</p>
            </div>
            <div className="col-2">
              {res.status === "booked" && (
                <>
                  <p data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </p>
                  <a href={`/reservations/${res.reservation_id}/seat`}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      // onClick={() => clickHandler(res, "seated")}
                    >
                      Seat
                    </button>
                  </a>
                </>
              )}
              {res.status === "seated" && (
                <>
                  <p data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </p>
                  {/* <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      if (window.confirm("Is this reservation finished?"))
                        clickHandler(res, "finished");
                    }}
                  >
                    Finish
                  </button> */}
                </>
              )}
              {res.status === "booked" && (
                    <a href={`/reservations/${res.reservation_id}/edit`}>
                    <button type="button" className="btn btn-secondary btn-sm ml-2">
                      Edit
                    </button>
                  </a>
                  )}
              <button
                data-reservation-id-cancel={res.reservation_id}
                className="btn btn-danger btn-sm ml-2"
                onClick={()=> handleCancel(res.reservation_id)}
              >
                Cancel
              </button>
            </div>
          </div>
          <hr />
        </>
      )}
    </div>
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: </h4>
        <h4>{date}</h4>
      </div>
      <div className="mb-3">
        <button
          className="btn btn-secondary mr-2"
          type="button"
          onClick={handlePreviousDateClick}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary mr-2"
          type="button"
          onClick={handleNextDateClick}
        >
          Next
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={todaysDate}
        >
          Today
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="d-flex">
        <div className="col-2">
          <h5>First Name</h5>
        </div>
        <div className="col-2">
          <h5>Last Name</h5>
        </div>
        <div className="col-2">
          <h5>Mobile Number</h5>
        </div>
        <div className="col-2">
          <h5>Reservation Time</h5>
        </div>
        <div className="col-2">
          <h5>People</h5>
        </div>
        <div className="col-2">
          <h5>Status</h5>
        </div>
      </div>
      <div>{content}</div>
      {/* {JSON.stringify(reservations)} */}
      <div className="col-4">
        <ViewTable loadDashboard={loadDashboard} />
      </div>
    </main>
  );
}

export default Dashboard;
