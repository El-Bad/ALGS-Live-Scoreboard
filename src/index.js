import { join } from "ramda";
import "./algsLiveStats.scss";
import dt from "datatables.net";
import "datatables.net-dt/css/jquery.datatables.css";

$("body").append(
  `<div id="maincontainer">
      <table id="dataTable" />
    </div>`
);

var pollCount = 0;
var pollSpeed = 1000;
var pollInterval = undefined;

window.DEV = true;

window.DEV && $("#maincontainer").prepend(`<h1>DEVELOPMENT MODE</h1`);

if (!window.DEV) pollInterval = setInterval(pollData, pollSpeed);

function pollData() {
  pollCount++;
  datatable.ajax.reload();
}

function getData(_, callback) {
  const API_URL = `https://discover.flowics.com/discover/public/datasources/company/1584/integration_sink/apex-prod-twitch-live/payload/graphics_match`;
  console.log("getdata");
  $.ajax({
    method: "GET",
    url: API_URL,
  }).done((response) => {
    callback({ data: response.teams_iterable });
  });
}

console.log("here");
let datatable = $("#dataTable").DataTable({
  ajax: getData,
  paging: false,
  columns: [
    { title: "P", data: "placement", width: "0%", className: "place" },
    {
      title: "Name",
      render: function (data, type, row) {
        return `<span><img src=${row?.logo} /> ${
          row?.displayName ?? row?.name
        }</span>`;
      },
      width: "0%",
    },
    { title: "Kills", data: "kills", width: "0%" },
    { title: "Damage", data: "damage", width: "0%" },
    { title: "Status", data: "status", visible: false, width: "0%" },
    {
      title: "Match Pt",
      data: "matchPoint",
      visible: false,
      className: "matchPoint",
    },
    { title: "Pts", data: "tournamentPoints" },
    { title: "#", data: "tournamentPlace", className: "tournamentPlace" },
  ],
  order: [
    [4, "asc"],
    [0, "asc"],
    [5, "desc"],
    [7, "asc"],
    [2, "desc"],
    [3, "desc"],
  ],
  bInfo: false,
  createdRow: function (row, data, dataIndex) {
    if (data?.status === "alive") $(row).addClass("alive");
    if (parseInt(data?.tournamentPlace) <= 10) $(row).addClass("top10");
    if (data?.matchPoint) $(row).addClass("onMatchPoint");
  },
});

//sleep(1000).then(() => $("tr").eq(4).addClass("fighting"));
