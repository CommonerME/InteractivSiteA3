
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

function rocket_media(_id, rocket) {
    var media = "-";
    if( rocket.links.flickr.original ) {
        media += '<div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1" uk-slideshow="min-height:300px">'
        media += '<ul class="uk-slideshow-items">';
        rocket.links.flickr.original.forEach((imageURL, index) => {
            media += `<li>
                <img src="${imageURL}" alt="" uk-cover>
            </li>`;
        });

        media += '</ul>';
        media += '<a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slideshow-item="previous"></a>';
        media += '<a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slideshow-item="next"></a>';
        media +='</div>';
    } 
    return media;
}

function rocket_card(_id, rocket) {
    var image = "";
    if (rocket.links.flickr.original.length > 0) {
        var imageURL = rocket.links.flickr.original[0];
        image = `<div class="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light" data-src="${imageURL}" uk-img>
            </div>`;

    } else {
        var imageURL = "./public/images/placeholder-01.png";
        image = `<div class="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light" data-src="${imageURL}" uk-img>
            </div>`;
    }

    var description = "-";
    if (rocket.details != null && rocket.details.length > 0) {
        description = rocket.details;
    }

    var datetime = "";
    if (rocket.date_local.length > 0) {
        datetime = new Date(rocket.date_local);
    }

    var rocketMedia = rocket_media( _id, rocket );

    var createMission = "";
    if( rocket.crew.length > 0 ) {
        createMission += "<dt>Crew Members:</dt>";
        createMission += "<dd>";
        rocket.crew.forEach((crew, i) => {
            createMission += `<li>${crew.role}</li>`;
        });
        createMission += "</dd>";
    }

    var countdown = "";
    if( rocket.upcoming ) {
        countdown += formatDate(datetime);
    }

    var failedReason = "";
    if( rocket.failures.length ) {
        failedReason += "<dt>Failed Details:</dt>";
        if( rocket.failures[0].hasOwnProperty('reason') ) {
            var failtxt = "";
            if( rocket.failures[0].reason.length > 0 ) {
                failtxt = rocket.failures[0].reason;
            } 
            failedReason += `<dd><b>Reason:</b>${failtxt}</dd>`;
        }
        if( rocket.failures[0].hasOwnProperty('time') ) {
            var runtime = 0;
            if( rocket.failures[0].time != null ) {
                runtime = rocket.failures[0].time;
            }
            failedReason += `<dd><b>Time:</b>${runtime} seconds</dd>`;
        }
        if( rocket.failures[0].hasOwnProperty('altitude') ) {
            var altitude = 0;
            if( rocket.failures[0].altitude != null ) {
                altitude = rocket.failures[0].altitude;
            }
            failedReason += `<dd><b>Altitude:</b>${altitude} km</dd>`;
        }
    }

    return `
            <li style='display:block;'>
                <div uk-toggle="target: #info_${_id}" class="custom--card uk-card uk-card-default uk-card-body">
                    <div class="flight--number"><div class='flight--num'>${rocket.flight_number}</div></div>
                    <div class="content--wrapper">
                        <div>${image}</div>
                        <div style='width:100%;text-align:center;'>${countdown}</div>
                    </div>
                    <div class="content--wrapper">
                        <div class="rocket--name">${rocket.name}</div>
                    </div>

                    <!-- This is the modal -->
                    <div id="info_${_id}" uk-modal>
                        <div class="uk-modal-dialog uk-modal-body">
                            <h2 class="uk-modal-title">${rocket.name} - Flight #${rocket.flight_number}</h2>
                            <dl class="uk-description-list uk-description-list-divider">
                                <dt>Date:</dt>
                                <dd>${formatDate(datetime)}</dd>
                                <dt>Description:</dt>
                                <dd>${description}</dd>
                                ${failedReason}
                                <dt>Other Media:</dt>
                                <dd>${rocketMedia}</dd>
                                ${createMission}
                            </dl>
                        </div>
                    </div>
                </div>
            </li>
        `
}