import { useState } from "react";
import { searchReservation, updateReservation } from "../utils/api";

export default function FindByNumber() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [mobile_number, setMobile_number] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [found, setFound] = useState([]);

  function loadSearch() {
    const abortController = new AbortController();
    setErrorMessage(null);
    console.log("about to search")
    searchReservation(mobile_number, abortController.signal)
      .then((response) => {
          console.log("search successful")
          console.log(response)
        if (response.length > 0) {
          setFound(response);
          setNotFound(false);
        } else {
          setNotFound(true);
          setFound([]);
        }
      })
      .catch(setErrorMessage);
    return () => abortController.abort();
  }

  function changeHandler({ target: { value } }) {
    setMobile_number(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    console.log("button clicked")
    loadSearch();
  }

  function clickHandler(reservation, newStatus) {
    updateReservation(reservation, newStatus)
      .then(loadSearch)
      .catch(setErrorMessage);
  }

  return (
    <main className="container-fluid mt-3">
      <form onSubmit={submitHandler}>
        <h1 className="mx-2 mt-4">Search for Reservation</h1>
        {errorMessage && (
          <div className="alert alert-danger">
            <h4>Please fix the following errors: </h4>
            <p>{errorMessage.message}</p>
          </div>
        )}
        <fieldset className="mt-3">
          <div className="form-group">
            <label htmlFor="mobile_number" className="m-2">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="000-000-0000"
              name="mobile_number"
              id="mobile_number"
              required={true}
              value={mobile_number}
              onChange={changeHandler}
            />
            <button type="submit" className="btn btn-primary mx-2">
              Find
            </button>
          </div>
        </fieldset>
        <div className="d-flex">
          <div className="col-2">
            <h5>First Name</h5>
          </div>
          <div className="col-2">
            <h5>Last Name</h5>
          </div>
          <div className="col-2">
            <h5>Mobile #</h5>
          </div>
          <div className="col-2">
            <h5>Time</h5>
          </div>
          <div className="col-2">
            <h5>Seats</h5>
          </div>
          <div className="col-2">
            <h5>Status</h5>
          </div>
        </div>
        <hr />
        {notFound && <h4>No reservations found</h4>}
        {found.length > 0 &&
          found.map((res, i) => (
            <div key={i}>
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
                          className="btn btn-primary"
                          onClick={() => clickHandler(res, "seated")}
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
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => {
                          if (window.confirm("Finish reservation?"))
                            clickHandler(res, "finished");
                        }}
                      >
                        Finish
                      </button>
                    </>
                  )}
                  {res.status === "finished" && <p>{res.status}</p>}
                  <a href={`/reservations/${res.reservation_id}/edit`}>
                    <button type="button" className="btn btn-secondary ml-2">
                      Edit
                    </button>
                  </a>
                </div>
              </div>
              <hr />
            </div>
          ))}
      </form>
    </main>
  );
}
