var responsible;
var doctors;
var locations;

function setResponsible(responsible){
  console.log("Load responsible");
  $("#responsible").append(
    `
    <li><i class="fa-li fa fa-user-md"></i><a href="doctor.html?identifier=${responsible.identifier}">${responsible.surname} ${responsible.name}</a></li>
    `
  );
}

function setDoctors(doctor){
  console.log("Load doctor");
  $("#doctors-list").append(
    `
    <li><i class="fa-li fa fa-user-md"></i><a href="doctor.html?identifier=${doctor.identifier}">${doctor.surname} ${doctor.name}</a></li>
    `
  );
}

function setLocations(location){
  console.log("Load location");
  $("#locations-list").append(
    `
    <li><i class="fa-li fa fa-hospital-o"></i><a href="location.html?identifier=${location.identifier}">${location.name}</a></li>
    `
  );
}

function loadService(service) {
  console.log("Load service");
  responsible = service.responsible;
  doctors = service.relateddoctors;
  locations = service.locations;
  $('#service_title').append(
    `
      ${service.name}
    `)

  $("#serviceInfo").append(
    `
		<div id="pages" class="container">
      <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
          <li class="breadcrumb-item"><a href="services.html">Services</a></li>
          <li class="breadcrumb-item active">${service.name}</li>
      </ol>
			<div class="row">
				<div class="col-md-12">
					<h2 class="ser-title">${service.name}</h2>
					<hr class="botm-line">
					
				</div>
            </div>
            <div class="row">
				<div class="col-md-7 col-sm-7 col-xs-12">
					<div class="thumbnail"> 
              			<img src="../assets/img/services/${service.identifier}.jpg" alt="..." class="img-responsive">
            		</div>
				</div>
            	<div class="col-md-5 col-sm-5 col-xs-12">
                  <h3 class="hdg" style="margin-top: 0px;">Responsible doctor</h3>
                  <div class="well">
                    <ul id="responsible" class="fa-ul">
                    </ul>
                  </div>
                  <h3 class="hdg">Other related doctors</h3>
                  <div class="well">
                    <ul id="doctors-list" class="fa-ul">
                    </ul>
                  </div>
                  <h3 class="hdg">Where you can find it</h3>
                  <div class="well">
                    <ul id="locations-list" class="fa-ul">
                    </ul>
                  </div>
            	</div>
            </div> 
            <div class="row">
            <div class="col-md-12" style="padding: 20px;">
                  <h3 class="hdg" style="margin-top: 0px;">Description</h3>
                    <div class="well">
                      <p>${service.description}
                      </p>
                    </div>
                    </div>
		</div>
	`
  );
  searchResponsible();
  searchDoctors();
  searchLocations();
}

function searchService() {
  console.log("response");
  fetch("/services" + window.location.search)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(loadService);
    });
}

function searchResponsible() {
  fetch("/doctors?identifier=" + responsible)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(setResponsible);
    });
}

function searchDoctors() {
  var array = doctors.split("n");
  var arrayLength = array.length;
  for (var i = 0; i < arrayLength; i++) {
      console.log(array[i]);
  fetch("/doctors?identifier=" + array[i])
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(setDoctors);
    });
  }
}

function searchLocations() {
  var array = locations.split("n");
  var arrayLength = array.length;
  for (var i = 0; i < arrayLength; i++) {
      console.log(array[i]);
  fetch("/locations?identifier=" + array[i])
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(setLocations);
    });
  }
}