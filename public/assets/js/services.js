/* eslint-env browser */
console.log("# Starting up the application");

function clearTable() {
  $("#myServiceRows").find("tr").remove();
}

function addServiceRow(service) {
  console.log("Load service");
  $("#myServiceRows").append(
    `
        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="thumbnail">
          <a href="service.html?identifier=${service.identifier}">
            <img src="../assets/img/services/${service.identifier}.jpg" alt="..." class="service-img">
            <div class="caption">
              <h3><a href="service.html?identifier=${service.identifier}">${service.name}</a></h3>
            </div>
          </div>
        </div>
`
  );
}


function showResponse(type /* OK, KO*/) {
  $("#addServiceFormDiv").hide();
  $(`#responseData${type}`).show();
  setTimeout(
    () => {
      $(`#responseData${type}`).hide();
      $("#addServiceButton").show();
      updateServicesList();
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

function clickSubmitServiceData() {
  let headers = new Headers();
  headers.set("Content-Type", "application/json");

  let formdata = formDataAsJSON(new FormData(
    document.getElementById("addServiceform")
  ));


  fetch("/services", {
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
  updateServicesList();
}


function updateServicesList() {
  fetch(`/services?start=${start}&limit=${count}&sort=${sortby}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(addServiceRow);
      $('#showButton').hide();
    });
}

function startup() {
  $(`#responseDataOK`).hide();
  $(`#responseDataKO`).hide();
  $("#addServiceFormDiv").hide();
}

function updateLists(){
  updateServicesList();
}

startup();

