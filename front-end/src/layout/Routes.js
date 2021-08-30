import React from "react";
import NewReservation from "../reservations/NewReservation";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import NewTable from "../tables/NewTable"
import Seating from "../reservations/ReservationSeating";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
//  const content = reservations.map((res, i) => <p>{res.reservation_date}</p>);
function Routes() {
  const query = useQuery()
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation/>
        </Route>
        <Route exact={true} path="/tables/new">
          <NewTable/>
          </Route>
          <Route exact={true} path="/reservations/:reservation_id/seat">
            <Seating />
            </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
      <Dashboard date={query.get("date") || today()} />
      {/* <Dashboard /> */}
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
