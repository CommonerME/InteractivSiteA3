const url = 'https://api.spacexdata.com/v5/launches';
const filterWrapper = "#rocket-filters";
const rocketDataWrapper = "#rocket-data";
const failFilterWrapper = "#fail-filters";
const failFilterContent = "#fail--filter-content";

$(function () {
    // compare time 
    function compareTime( a, b ) {
        if ( a.time < b.time ){
          return -1;
        }
        if ( a.time > b.time ){
          return 1;
        }
        return 0;
    }

    // comapare range
    function compareRange( a, b ) {
        if ( a.altitude < b.altitude ){
          return -1;
        }
        if ( a.altitude > b.altitude ){
          return 1;
        }
        return 0;
    }
    
    function show_loader() {
        $('#loading--overlay').show();
        setTimeout(function(){
            $('#loading--overlay').slideUp('slow');
        }, 1000);
    }

    function menuItem(label, event) {
        return `<li class="menu-item" data-menu='${event}' uk-filter-control='${event}'><a href="#">${label}</a></li>`
    }

    function menuItemSecondary(label, event, selected=false ) {
        var selectet_html = "";
        if( selected ) {
            selected_html = "uk-active";
        }
        return `<li class="menu-item ${selected_html}" data-menu-secondary='${event}' uk-filter-control='${event}'><a href="#">${label}</a></li>`
    }

    function contentItem(rocket, _id) {
        //console.log(rocket);
        return rocket_card(_id, rocket);
    }

    function rocketContent(rocket) {
        // clear
        $(rocketDataWrapper).html("");
        rocket.forEach((rocket, i) => {
            var rocketContent = contentItem(rocket, i);
            $(rocketDataWrapper).append(rocketContent);
        });
        UIkit.grid();
    }

    function renderui(data) {
        var allrockets = [];
        var failrocket = [];
        var successrocket = [];
        var upcomingrocket = [];
        var crewmission = [];

        if (data.length > 0) {
            data.forEach(function (rocket, i) {
                // all rockets
                allrockets.push(rocket);
                // crew missions 
                if (rocket.crew.length > 0) {
                    crewmission.push(rocket);
                }
                // success
                if (!rocket.success) {
                    failrocket.push(rocket);
                } else {
                    successrocket.push(rocket);
                }
                // Upcomming Rocket
                if (rocket.upcoming) {
                    upcomingrocket.push(rocket);
                }
            })
        }

        if (allrockets.length > 0) {
            var menu = menuItem("All Rockets", "all");
            $(filterWrapper).append(menu);
        }

        if (successrocket.length > 0) {
            var menu = menuItem("Success", "success");
            $(filterWrapper).append(menu);
        }

        if (failrocket.length > 0) {
            var menu = menuItem("Failure", "fail");
            $(filterWrapper).append(menu);
        }

        if (upcomingrocket.length > 0) {
            var menu = menuItem("Upcoming", "upcoming");
            $(filterWrapper).append(menu);
        }

        if (crewmission.length > 0) {
            var menu = menuItem("Crew Mission", "crew");
            $(filterWrapper).append(menu);
        }

        var clearedFailedArray = [];

        // sub filtering 
        function add_listeners() {
            $(`${failFilterWrapper} li.menu-item[data-menu-secondary]`).each(function() {
                var filter = $(this).data("menu-secondary");
                $(this).unbind("click");
                $(this).click( function() {
                    clearedFailedArray = [];

                    if( failrocket.length > 0 ) {
                        failrocket.forEach(( rocket, i ) => {
                            if( rocket.failures.length > 0 ) {
                                clearedFailedArray.push(rocket);
                            }
                        }); 
                    }

                    switch( filter ) {
                        case 'time-filter':
                            // order by increasing
                            clearedFailedArray.sort(compareTime);
                            rocketContent(clearedFailedArray);
                        break;
                        case 'altitude-filter':
                            // order by increasing
                            clearedFailedArray.sort(compareRange);
                            rocketContent(clearedFailedArray);
                        break;
                        case 'all-filter':
                            default:
                            rocketContent(failrocket);
                            break;
                    } 
                } );
            });
        }

        $(`${filterWrapper} li.menu-item[data-menu]`).each(function () {
            var filter = $(this).data("menu");
            $(this).click(function () {
                show_loader();
                $(failFilterContent).hide();
                $(failFilterWrapper).html("");

                switch (filter) {
                    case "success":
                        rocketContent(successrocket);
                        break;
                    case "fail":
                        rocketContent(failrocket);
                        $(failFilterContent).show();
                        var timeall = menuItemSecondary("All", "all-filter", true );
                        $(failFilterWrapper).append(timeall);
                        var timemenu = menuItemSecondary("Time", "time-filter");
                        $(failFilterWrapper).append(timemenu);
                        var altitudemenu = menuItemSecondary("altitude", "altitude-filter");
                        $(failFilterWrapper).append(altitudemenu);
                        add_listeners();
                        break;
                    case "upcoming":
                        rocketContent(upcomingrocket);
                        UIkit.countdown().start();
                        break;
                    case "crew":
                        rocketContent(crewmission);
                        break;
                    case "all":
                    default:
                        rocketContent(allrockets);
                }
            });
        });

        // default set all
        $(`${filterWrapper} li.menu-item[data-menu="all"]`).addClass("uk-active");
        rocketContent(allrockets);
    }

    fetch(url)
        .then((response) => {
            // First get confirmation there's a connection
            //console.log(response);
            return response.json();
        })
        .then((data) => {
            renderui(data);
        })
        .catch((error) => {
            // If there's an error, show in the browser console.
            console.log(error);
        });

});
