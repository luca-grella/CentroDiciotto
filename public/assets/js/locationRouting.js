var serforloc;
var docforloc;

function setServices(service){
  console.log("Load service");
  $("#services-list").append(
    `
    <li><i class="fa-li fa fa-stethoscope"></i><a href="service.html?identifier=${service.identifier}">${service.name}</a></li>
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

function loadLocation(location) {
  console.log("Load location");
  serforloc = location.services;
  docforloc = location.doctors;
  $('#location_title').append(
    `
        ${location.city}
    `
    );

  $("#locationInfo").append(
    `
		<div id="pages" class="container">
     <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
          <li class="breadcrumb-item"><a href="locations.html">Locations</a></li>
          <li class="breadcrumb-item active">${location.name}</li>
      </ol>
			<div class="row">
				<div class="col-md-12">
					<h1 class="ser-title" style="padding-left: 10px">${location.name}</h1>
					<hr class="botm-line">
				</div>
            </div>
            <div class="row">
				<div class="col-md-6 col-sm-6 col-xs-12">
					<div class="thumbnail"> 
                    	<img src="../assets/img/locations/${location.identifier}.jpg" alt="..." class="img-responsive">
            		</div>
				</div>
            	<div class="col-md-6 col-sm-6 col-xs-12" style="padding-right: 20px;">
                	<h3 class="hdg">Health Services</h3>
                	<div class="well">
                		<ul id="services-list" class="fa-ul">
                		</ul>
                	</div>
                    <h3 class="hdg">Doctors</h3>
                    <div class="well">
                        <ul id="doctors-list" class="fa-ul">
                        </ul>
                    </div>
            	</div>
            </div>
            <div class="row">
                <div class="col-md-12" style="padding: 20px;">
                    <h3 class="hdg" style="margin-top: 0px;">Description</h3>
                        <div class="well">
                            <p>${location.description}
                            </p>
                        </div>
                </div>
            </div>
            <div class="map">
                <h1>Where you can find us</h1>
                <iframe width="100%" height="275px"
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBtg9DjiSP2Jcq9CM2g1rXNVI_pj63nUWI&q=${location.address}" 
                frameborder="0" style="border:0" allowfullscreen></iframe>
            </div>
		</div>
        
	`
  );

  searchServices();
  searchDoctors();
}

function searchLocation() {
	console.log("response");
  fetch("/locations" + window.location.search)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(loadLocation);
    });
}

function searchServices() {
  var array = serforloc.split("n");
  var arrayLength = array.length;
  for (var i = 0; i < arrayLength; i++) {
      console.log(array[i]);
  fetch("/services?identifier=" + array[i])
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(setServices);
    });
  }
}

function searchDoctors() {
  var array = docforloc.split("n");
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

