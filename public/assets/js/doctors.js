/* eslint-env browser */
console.log("# Starting up the application");
var filtername = "All doctors in alphabetical order";

function clearTable() {
  $("div").remove("#doctor-element");
  $("h3").remove("#filter-name");
}

function addDoctorRow(doctor) {
  console.log("Load doctor");
  $("#myDoctorRows").append(
    `
        <div id="doctor-element" class="col-md-3 col-sm-3 col-xs-6">
          <div class="thumbnail">
            <a href="doctor.html?identifier=${doctor.identifier}">
              <img src="../assets/img/doctors/${doctor.identifier}.jpg" alt="..." class="team-img">
            </a>
            <div class="caption">
              <h3 id="doctor-caption"><a href="doctor.html?identifier=${doctor.identifier}">${doctor.surname} ${doctor.name}</a></h3>
              <p>${doctor.department}</p>
            </div>
          </div>
        </div>
    `
  );
}

function showLocations(loc) {
  $("#filter-menu").append(
    `
      <li onclick="filterLocation('${loc.identifier}','${loc.name}')">${loc.city}</li>
    `
    );
}

function showFilter() {
  $("#filter-position").append(
    `
      <h3 id="filter-name">${filtername}</h3>
    `
    );
}

let start = 0;
let count = 10;
let sortby = "surname"; 
let locId = "none";

function setSort(){
  sortby = "none";
  updateDoctorsList();
}

function setCount(x){
  count = x;
  updateDoctorsList();
}

function filterLocation(x, y){
  locId = x;
  updateDoctorsList();
  filtername = y;
}

function updateDoctorsList() {
  fetch(`/doctors?sort=${sortby}&location=${locId}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearTable();
      data.map(addDoctorRow);
      showFilter();
    });
}

function searchLocations() {
  fetch(`/locations`)
  .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(showLocations);
    });
}

function startup() {
  $(`#responseDataOK`).hide();
  $(`#responseDataKO`).hide();
  $("#addDoctorFormDiv").hide();
}

function updateLists(){
  updateDoctorsList();
  searchLocations();
}

startup();

