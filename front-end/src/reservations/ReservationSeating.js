import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { seatTable } from "../utils/api";
import { useParams } from "react-router";
import { listTable } from "../utils/api";

export default function Seating() {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [table, setTable] = useState(null);
  const [tables, setTables] = useState([]);
  const { reservation_id } = useParams();

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setErrorMessage(null);
    listTable(abortController.signal).then(setTables).catch(setErrorMessage);
    return () => abortController.abort();
  }

  function changeHandler({ target: { value } }) {
    setTable(value);
  }

  function cancel() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    if (table === 0) return;
    seatTable(reservation_id, table)
      .then(() => history.push(`/dashboard`))
      .catch(setErrorMessage);
  }

  return (
    <main className="container-fluid mt-3">
      <form onSubmit={submitHandler}>
        <h1 className="mx-2 mt-4">Seat a Table</h1>
        {errorMessage && (
          <div className="alert alert-danger">
            {/* <h4>Please fix the following errors: </h4>
            <ul>
              {errorMessage.message.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul> */}
            <h4>Please fix the following errors: </h4>
            <ul>
              <li>{errorMessage.message}</li>
            </ul>
          </div>
        )}
        <fieldset className="mt-3">
          <div className="form-group">
            <h4>For reservation #{reservation_id}</h4>
            <label htmlFor="table_name" className="m-2">
              Table Name:
            </label>
            <select
              name="table_id"
              id="table_id"
              required={true}
              onChange={changeHandler}
            >
              <option value={0}>Please select a table</option>
              {tables &&
                tables.map((table, i) => (
                  <option
                    key={i}
                    value={table.table_id}
                  >{`${table.table_name} - ${table.capacity}`}</option>
                ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary mx-2">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger mx-2"
            onClick={cancel}
          >
            Cancel
          </button>
        </fieldset>
      </form>
    </main>
  );
}