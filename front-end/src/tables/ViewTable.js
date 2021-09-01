import React, { useState } from "react";
import { useEffect } from "react";
import { listTable, unseatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TablesView() {
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTable(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

    function deleteHandler(table_id) {
      if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
        unseatTable(table_id).then(loadTables).catch(setTablesError);
      }
    }


  return (
    <div>
      <ErrorAlert error={tablesError} />
      <h2>Tables</h2>
      {tables &&
        tables.map((table, i) => (
          <div className="row mb-2">
            <div className="col-6">
              <h5 key={table.id}>{`${table.table_name}`}</h5>
              <p>capacity: {table.capacity}</p>
            </div>
            <div data-table-id-status={table.table_id} className="col-3">
              <p>{table.occupied ? "Occupied" : "Free"}</p>
            </div>
            <div data-table-id-finish={table.table_id} className="col-3">
            <button 
            type="button"
            className="btn btn-warning"
            data-table-id-finish={table.table_id}
            onClick={()=> deleteHandler(table.table_id)}>
              Finish
            </button>
            </div>
          </div>
        ))}
    </div>
  );
}
