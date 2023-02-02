import { appendChild, createElement } from "../../jsx-without-react";
import "datatables.net";
import { getColorBetween } from "./utils";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";

function getData(_, callback) {
  const LIVE = true;
  const LIVE_API_URL = `https://algs-data.flowics.com/discover/public/datasources/company/1584/integration_sink/apex-prod-twitch-live/payload/graphics_match`;
  const API_URL = `https://algs-data.flowics.com/discover/public/datasources/company/1584/integration_sink/apex-prod-twitch-delay/payload/graphics_match`;

  $.ajax({
    method: "GET",
    url: LIVE ? LIVE_API_URL : API_URL,
  }).done((response) => {
    callback({ data: response.teams_iterable });
  });
}

const defaultOrder = [
  [5, "asc"],
  [0, "asc"],
  [6, "desc"],
  [8, "asc"],
  [3, "desc"],
  [4, "desc"],
];

// `d` is the original data object for the row
function createChild(d) {
  let { players } = d;
  let pd = ["screenname", "character", "kills", "damage"];

  return (
    `<div>` +
    players
      .map((player) => {
        return (
          `<div class="player">` +
          pd
            .map((info) => {
              return `<div>${player[info]}</div>`;
            })
            .join("") +
          `</div>`
        );
      })
      .join("") +
    `</div>`
  );
}

const defineDatatable = () => {
  let datatable = $("#dataTable").DataTable({
    ajax: getData,
    paging: false,
    rowReorder: true,
    columns: [
      {
        title: "",
        data: "placement",
        width: "0%",
        className: "place",
        render: function (data, type, row) {
          return `<span></span>${data}<div></div>`;
        },
      },
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
          let extraRange = 5;
          let placement = Number(data);
          let colorMult;
          if (placement <= 10) colorMult = placement / (20 + extraRange);
          else colorMult = (placement + extraRange) / (20 + extraRange);

          let c = getColorBetween([255, 0, 0], [0, 255, 0], colorMult);
          let rgb = `${c[0]}, ${c[1]}, ${c[2]}`;
          return (
            <span
              style={`background:linear-gradient(90deg,
                    rgba(${rgb}, 0) 0%,
                    rgba(${rgb}, 1) 100%)`}
              class="placementMarker"
            />
          ).outerHTML;
        },
        sortable: false,
      },
    ],
    order: [...defaultOrder],
    bInfo: false,
    createdRow: function (row, data, dataIndex) {
      let dtRow = datatable.row(row);
      dtRow.child(createChild(data));

      $(row).addClass("mainrow");
      if (data?.status === "alive") $(row).addClass("alive");
      if (parseInt(data?.tournamentPlace) <= 10) $(row).addClass("top10");
      if (data?.matchPoint) $(row).addClass("onMatchPoint");
      //if(data?.$(row).addClass("fighting"));
      if (
        data?.players.some(
          (player) => player.isDoingDamage || player.isTakingDamage
        )
      )
        $(row).addClass("fighting");

      console.log(data);
      DEVELOPMENT && Number(data.placement) <= 8 && $(row).addClass("alive");
    },
  });
  return datatable;
};

export { defineDatatable, defaultOrder };
