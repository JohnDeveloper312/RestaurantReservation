import React, { useState } from "react";
import { useEffect } from "react";
import { listTable, unseatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TablesView(props) {
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTable(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function deleteHandler(table_id, reservation_id) {
    unseatTable(table_id, reservation_id)
      .then(props.loadDashboard)
      .then(loadTables)
      .catch(setTablesError);
  }


  return (
    <div>
      <ErrorAlert error={tablesError} />
      <h2>Tables</h2>
      {/* <div data-table-id-status= "5" className="col-3">
              "occupied"
            </div> */}
      {tables &&
        tables.map((table, i) => (
          <div key={i} className="row mb-2">
            <div className="col-6">
              <h5>{`${table.table_name}`}</h5>
              <p>capacity: {table.capacity}</p>
            </div>
                <div data-table-id-status= {table.table_id} className="col-3">
                {table.reservation_id ? "occupied" : "free"}
            </div>
            {/* <div data-table-id-status={table.table_id} className="col-3">
              {table.occupied ? "occupied" : "free"}
            </div> */}
            <div className="col-3">
              {table.reservation_id && (
                <button data-table-id-finish={table.table_id}
                  className="btn btn-warning"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Is this table ready to seat new guests? This cannot be undone."
                      )
                    )
                      deleteHandler(table.table_id, table.reservation_id);
                  }}
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
