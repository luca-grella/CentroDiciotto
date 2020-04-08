function addInfo(info) {
  console.log("Load info");
  $("#clinicInfo").append(
    `
      <div class="row">
        <div class="col-md-4 col-sm-4">
          <p>${info.description}</p>
        </div>
        <div class="col-md-8 col-sm-8">
          <div class="thumbnail"> 
            <img src="${info.picture}" alt="..." class="team-img">
          </div>
        </div>
      </div>
`
  );
}

function loadInfo() {
  fetch(`/whoweare`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(addInfo);
    });
}
