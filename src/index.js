import "datatables.net";
import "datatables.net-dt/css/jquery.datatables.css";
import "./algsLiveStats.scss";

$("body").append(
  `<div id="maincontainer">
      <table id="dataTable" />
    </div>`
);

var pollCount = 0;
var pollSpeed = 1000;
var pollInterval = undefined;

window.DEV = false;

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

let datatable = $("#dataTable").DataTable({
  ajax: getData,
  paging: false,
  columns: [
    { title: "", data: "placement", width: "0%", className: "place" },
    {
      title: "",
      className: "logo",
      render: function (data, type, row) {
        return `<img src=${row?.logo} />`;
      },
      width: "0%",
      sortable: false,
    },
    {
      title: "Name",
      className: "name",
      render: function (data, type, row) {
        return row?.displayName ?? row?.name;
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
    {
      title: "",
      data: "tournamentPlace",
      className: "tournamentPlace",
    },
    {
      title: "",
      data: "tournamentPlace",
      className: "placementMarker",
      render: function (data, type, row) {
        let brightMult = 1 / Number(data);
        return `<span style="filter:brightness(${brightMult})" class="placementMarker" />`;
      },
      sortable: false,
    },
  ],
  order: [
    [5, "asc"],
    [0, "asc"],
    [6, "desc"],
    [8, "asc"],
    [3, "desc"],
    [4, "desc"],
  ],
  bInfo: false,
  createdRow: function (row, data, dataIndex) {
    if (data?.status === "alive") $(row).addClass("alive");
    if (parseInt(data?.tournamentPlace) <= 10) $(row).addClass("top10");
    if (data?.matchPoint) $(row).addClass("onMatchPoint");
    window.DEV && $(row).addClass("alive");
  },
});

//sleep(1000).then(() => $("tr").eq(4).addClass("fighting"));
