import { createElement } from "../../jsx-without-react";

import "./algsLiveStats.scss";
import { sleep } from "./utils";
import { defaultOrder, defineDatatable } from "./algsTable";

export const ALGSLiveStats = () => {
  $("body").append(
    <div id="maincontainer">
      {DEVELOPMENT ? <h1>DEVELOPMENT MODE</h1> : ""}
      <button id="resetsort">Reset Sorting</button>
      <table id="dataTable" />
    </div>
  );

  let datatable = defineDatatable();

  $("#resetsort").on("click", function () {
    datatable.order(defaultOrder).ajax.reload();
  });

  var pollCount = 0;
  var pollSpeed = 2000;
  if (!DEVELOPMENT) setInterval(pollData, pollSpeed);

  function pollData() {
    pollCount++;
    datatable.ajax.reload();
  }

  sleep(1000).then(() => $("tr").eq(4).addClass("fighting"));

  $("#dataTable").on("click", "tr", function () {
    var row = datatable.row($(this).closest("tr"));
    row.child.isShown() ? row.child.hide() : row.child.show();
  });
};
