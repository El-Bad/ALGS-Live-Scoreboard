import { createElement } from "../../jsx-without-react";

import "./algsLiveStats.scss";
import { sleep } from "./utils";
import { defaultOrder, defineDatatable, reloadTable } from "./algsTable";

export const ALGSLiveStats = () => {
  $("body").append(
    <div id="maincontainer">
      {DEVELOPMENT ? <h1>DEVELOPMENT MODE</h1> : ""}
      <table id="dataTable" /> <button id="resetsort">Reset Sorting</button>
      <div id="liveDiv">
        <input type="checkbox" id="live" name="live" value="live" />
        <label for="live">Live (no delay)</label>
      </div>
    </div>
  );

  let datatable = defineDatatable();

  //reload table without resetting children
  const reloadTable = (datatable) => {
    childRows = datatable.rows($(".shown"));
    datatable.ajax.reload();
  };

  $("#resetsort").on("click", function () {
    datatable.order(defaultOrder).ajax.reload();
  });

  var pollCount = 0;
  var childRows = null;
  var pollSpeed = 300;
  if (!DEVELOPMENT)
    setInterval(() => {
      pollCount++;
      reloadTable(datatable);
    }, pollSpeed);

  datatable.on("draw", function () {
    if (childRows) {
      childRows.every(function (rowIdx, tableLoop, rowLoop) {
        this.child.show();
        $(this.node()).addClass("shown");
      });

      childRows = null;
    }
  });

  $("#dataTable").on("click", "tr", function () {
    var tr = $(this).closest("tr");
    var row = datatable.row(tr);
    if (row.child.isShown()) {
      row.child.hide();
      $(tr).removeClass("shown");
    } else {
      row.child.show();
      $(tr).addClass("shown");
    }
  });
};
