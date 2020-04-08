/* eslint-env browser */
console.log("# Starting up the application");

function clearTable() {
  $("#myLocationRows").find("tr").remove();
}

function addLocationRow(location) {
  console.log("Load location");
  $("#myLocationRows").append(
    `
        <div class="col-md-4 col-sm-4 col-xs-12">
          <div class="thumbnail"> 
          <a href="location.html?identifier=${location.identifier}">
            <img src="../assets/img/locations/${location.identifier}.jpg" alt="..." class="location-img">
          </a>
            <div class="caption">
              <h3><a href="location.html?identifier=${location.identifier}">${location.name} <br> ${location.region}</a></h3>
            </div>
          </div>
        </div>
`
  );
}

function clickAddLocation() {
  /* Disable button and show dialog for inserting pet */
  console.log("Adding location");
  $("#addLocationButton").hide();
  $("#addLocationFormDiv").show();
}

function showResponse(type /* OK, KO*/) {
  $("#addLocationFormDiv").hide();
  $(`#responseData${type}`).show();
  setTimeout(
    () => {
      $(`#responseData${type}`).hide();
      $("#addLocationButton").show();
      updateLocationsList();
    },
    2000
  );
}

window.showResponse = showResponse;

function formDataAsJSON(formData) {
  let x = {};
  for (var pair of formData.entries()) {
    x[pair[0]] = pair[1];
  }
  return JSON.stringify(x);
}

function clickSubmitLocationData() {
  let headers = new Headers();
  headers.set("Content-Type", "application/json");

  let formdata = formDataAsJSON(new FormData(
    document.getElementById("addLocationform")
  ));

/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

  fetch("/locations", {
    method: "POST",
    body: formdata,
    headers: headers
  })
    .then(response => response.json())
    .then(response => {
      if (response.error === "400") {
        showResponse("KO");
      } else {
        showResponse("OK");
      }
    });
}

let start = 0;
let count = 10;
let sortby = "name"; // Can be none, "name", "city"

function setSort(x){
  sortby = x;
  updateLocationsList();
}


function updateLocationsList() {
  fetch(`/locations?start=${start}&limit=${count}&sort=${sortby}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      //clearTable();
      data.map(addLocationRow);
      $('#showButton').hide();
    });
}

function startup() {
  $(`#responseDataOK`).hide();
  $(`#responseDataKO`).hide();
  $("#addLocationFormDiv").hide();
}

function updateLists(){
  updateLocationsList();
}

startup();

