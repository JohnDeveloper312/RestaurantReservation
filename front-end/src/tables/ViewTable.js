import React, { useState } from "react";
import { useEffect } from "react";
import { listTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TablesView() {
    const [tablesError, setTablesError] = useState(null);
    const [tables, setTables] = useState([]);
  
    useEffect(loadTables, [tables]);
  
    function loadTables() {
      const abortController = new AbortController();
      setTablesError(null);
      listTable(abortController.signal).then(setTables).catch(setTablesError);
      return () => abortController.abort();
    }
  
    return (
      <div>
        <ErrorAlert error={tablesError} />
        <h2>Tables</h2>
        {tables &&
          tables.map((table, i) => (
            <div className="row mb-2">
              <div className="col-6">
                <h5 key={i}>{`${table.table_name}`}</h5>
                <p>capacity: {table.capacity}</p>
              </div>
              <div data-table-id-status={table.table_id} className="col-6">
                <p>{table.occupied ? "Occupied" : "Free"}</p>
              </div>
            </div>
          ))}
      </div>
    );
  }