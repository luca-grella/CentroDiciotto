var name;
var surname;
var identifier;
var generalData;
var department;
var serviceId;
var service;
var officeId;
var office;

function setDoctor(doctor) {
  console.log("Load doctor");
  name = doctor.name;
  surname = doctor.surname;
  identifier = doctor.identifier;
  generalData = doctor.generalData;
  serviceId = doctor.responsibleFor;
  officeId = doctor.location;
  department = doctor.department.toLowerCase();
  printName();
  searchLocation();
}

function setService(ser) {
  console.log("Load service");
  service = ser.name.toLowerCase();
  printResponsible();
}

function setLocation(loc) {
	console.log("Load location");
	office = loc.name + " - " + loc.region;
	if (serviceId === null) {print();}
	else {searchService();}
}

function printResponsible(){
	$("#doctorInfo").append(
    `
		<div id="pages" class="container">
			<div class="row">
          <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
              <li class="breadcrumb-item"><a href="doctors.html">Doctors</a></li>
              <li class="breadcrumb-item active">${surname} ${name}</li>
          </ol>
				<div class="col-md-12">
					<h2 class="ser-title">${name} ${surname}</h2>
					<hr class="botm-line">
				</div>
            </div>
            <div class="row">
				<div class="col-md-4 col-sm-4 col-xs-12">
					<div class="thumbnail"> 
              			<img src="../assets/img/doctors/${identifier}.jpg" alt="..." class="img-responsive">
            		</div>
				</div>
            	<div class="col-md-8 col-sm-8 col-xs-12">
                	<h3 class="hdg" style="margin-top: 0px;">Background</h3>
                	<div class="well">
                		<p>${generalData}
                		</p>
                	</div>
                	<h3 class="hdg">Role in Centro Diciotto</h3>
                	<div class="well">
                		${surname} is in the <b>${department}</b> area as the supervisor of
                		<b><a href="service.html?identifier=${serviceId}">${service}</a></b> in
                		<b><a href="location.html?identifier=${officeId}">${office}</a></b>.
                	</div>
            	</div>
            </div>
		</div>
	`
  );
}

function print(){
	$("#doctorInfo").append(
    `
		<div id="pages" class="container">
			<div class="row">
          <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
              <li class="breadcrumb-item"><a href="doctors.html">Doctors</a></li>
              <li class="breadcrumb-item active">${surname} ${name}</li>
          </ol>
				<div class="col-md-12">
					<h2 class="ser-title">${name} ${surname}</h2>
					<hr class="botm-line">
				</div>
            </div>
            <div class="row">
				<div class="col-md-4 col-sm-4 col-xs-12">
					<div class="thumbnail"> 
              			<img src="../assets/img/doctors/${identifier}.jpg" alt="..." class="img-responsive">
            		</div>
				</div>
            	<div class="col-md-8 col-sm-8 col-xs-12">
                	<h3 class="hdg" style="margin-top: 0px;">Background</h3>
                	<div class="well">
                		<p>${generalData}
                		</p>
                	</div>
                	<h3 class="hdg">Role in Centro Diciotto</h3>
                	<div class="well">
                		${surname} is in the <b>${department}</b> area in
                		<b><a href="location.html?identifier=${officeId}">${office}</a></b>.
                	</div>
            	</div>
            </div>
		</div>
	`
  );
}

function printName(){
	$("#doc-title").append(`${surname}`);
}

function searchDoctor() {
  fetch("/doctors" + window.location.search)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
    	console.log(data);
      data.map(setDoctor);
    });
}

function searchService() {
  fetch("/services?identifier=" + serviceId)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
    	console.log(data);
      data.map(setService);
    });
}

function searchLocation() {
  fetch("/locations?identifier=" + officeId)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
    	console.log(data);
      data.map(setLocation);
    });
}