


$(document).ready(function(){

    hideall();
    $('#bets').show();

    $('.modal').modal();
    $('.sidenav').sidenav();
    $('select').formSelect();
    $('.dropdown-trigger').dropdown();

    $('.sidenavli').click(function(){

        hideall();

        id = $(this).attr('divid');
        $(id).show();
    });

    $('#addNewBet').click(function(){

        matchid = Cookies.get("match_to_be_bet");


        userinfo = JSON.parse(Cookies.get('user_info'));
        userid = userinfo._id;

        createnewBet(matchid,userid);

    });

    $('#addNewMatch').click(function(){
        matchname = $('#new_match_name').val();
        matchdate = $('#new_match_date').val();
        matchvenue = $('#new_match_venue').val();
        matchft = $('#new_match_ft').val();
        matchst = $('#new_match_st').val();
        createthenewmatch(matchname,matchdate,matchvenue,matchft,matchst);
    });

    $('#logout-button-header').click(function(){
        logout();
    });
    

    getaccountbets();
    getmatches();
    getmanagepaymentsinfo();
    getinactiveaccounts();
    getunclearedpayments();

  });

function logout(){
    Cookies.remove("access_token");
    Cookies.remove("user_info");

    window.location.assign("/login.html");
}

function getinactiveaccounts(){

    userinfo = JSON.parse(Cookies.get('user_info'));
    
    if(userinfo.is_admin){


    jQuery
								.ajax({
									type : "GET",
									url : "/iausers" ,
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {


                                        if (data.return_status == "ok"){
                                            html = "";
                                            for(var i in data.data){

                                                html += "<tr>";
                                                html += "<td><p>" + data.data[i].username + "</p></td>";

                                                html += "<td><a class=\"waves-effect waves-light btn approve_user_button \" user-id = \""+data.data[i]._id+"\" id= \"approve_user_"+data.data[i]._id+"\">Approve Account Request</a></td>"
                                                
                                                html += "</tr>";

                                            }

                                            $("#manageusertable").find("tbody").html(html);

                                            $(".approve_user_button").click(function(){
                                                userid = $("#"+this.id).attr("user-id");
                                                approveuser(userid);
                                                getinactiveaccounts();
                                            });



                                        }else if (data.return_status == "error") {

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
                                });
        }else{

            $('#managepayments').hide();
        }
                    

}


function getmanagepaymentsinfo(){

    userinfo = JSON.parse(Cookies.get('user_info'));
    
    if(userinfo.is_admin){


    jQuery
								.ajax({
									type : "GET",
									url : "/unpaidbet" ,
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {


                                        if (data.return_status == "ok"){
                                            html = "";
                                            for(var i in data.data){

                                                html += "<tr>";
                                                html += "<td><p>" + data.data[i].user.username + "</p></td>";
                                                html += "<td><p>" + data.data[i].match.matchName+ "</p></td>";
                                                html += "<td><p>" + data.data[i].match.matchDate.substring(0,10)+ "</p></td>";
                                                html += "<td><p>" + data.data[i].betamt + "</p></td>";
                                                html += "<td><a class=\"waves-effect waves-light btn approve_payment_button \" bet-id = \""+data.data[i]._id+"\" id= \"approve_bet_payment_"+data.data[i]._id+"\">Approve Payment</a></td>"
                                                html += "<td><p>" + data.data[i].betteam + "</p></td>";
                                                html += "</tr>";

                                            }

                                            $("#managepaymenttable").find("tbody").html(html);

                                            $(".approve_payment_button").click(function(){
                                                betid = $("#"+this.id).attr("bet-id");
                                                approvepayment(betid);
                                            });


                                        }else if (data.return_status == "error") {

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
                                });
        }else{

            $('#managepayments').hide();
                
        }
                    

}

function approvepayment(betid){
    req = {
        betid: betid
    }

    $.ajax({
        type : "POST",
        url : "/approvebetpayment",
        headers: {
            Authorization: Cookies.get("access_token")
        },
        dataType:"json",
        data: JSON.stringify(req),
        contentType:"application/json",

        success : function(data) {

            if (data.return_status == "ok"){
                M.toast(
                    {
                        html:data.message,
                        displayLength: 5000,
                        classes: 'rounded'}
                    );
                getmanagepaymentsinfo();
            }else if (data.return_status == "error"){
                M.toast(
                    {
                        html:data.message,
                        displayLength: 5000,
                        classes: 'rounded'}
                    );
            }

    },error : function(jqXHR, textStatus,
                errorThrown) {

            console.log(textStatus);
        }
    });
}


function approveuser(userid){
    req = {
        userid: userid
    }

    $.ajax({
        type : "POST",
        url : "/approveaccreq",
        headers: {
            Authorization: Cookies.get("access_token")
        },
        dataType:"json",
        data: JSON.stringify(req),
        contentType:"application/json",

        success : function(data) {

            if (data.return_status == "ok"){
                M.toast(
                    {
                        html:data.message,
                        displayLength: 5000,
                        classes: 'rounded'}
                    );
                getmanagepaymentsinfo();
            }else if (data.return_status == "error"){
                M.toast(
                    {
                        html:data.message,
                        displayLength: 5000,
                        classes: 'rounded'}
                    );
            }

    },error : function(jqXHR, textStatus,
                errorThrown) {

            console.log(textStatus);
        }
    });
}


function createthenewmatch(name,date,venue,ft,st){
    req = {
        matchName: name,
        matchDate: date,
        venue: venue,
        firstteam: ft,
        secondteam: st
    }

    $.ajax({
        type : "POST",
        url : "/match",
        headers: {
            Authorization: Cookies.get("access_token")
        },
        dataType:"json",
        data: JSON.stringify(req),
        contentType:"application/json",

        success : function(data) {

            if (data.return_status == "ok"){
                M.toast(
                    {
                        html:data.message,
                        displayLength: 5000,
                        classes: 'rounded'}
                    );
                getmatches();
            }else if (data.return_status == "error"){
                M.toast(
                    {
                        html:data.message,
                        displayLength: 5000,
                        classes: 'rounded'}
                    );
            }

    },error : function(jqXHR, textStatus,
                errorThrown) {

            console.log(textStatus);
        }
    });
}

function createnewBet(matchid,userid){

    betamt = $('#new_bet_amt').val();

    if (betamt % 100 != 0){
        M.toast(
            {
                html: "Bet amount should be a multiple of 100",
                displayLength: 5000,
                classes: 'rounded'}
            );
    }else{

        betteam = $('#selectbetteamdropdownselect').val();
        req = {
            matchid: matchid,
            userid: userid,
            betamt: betamt,
            betteam: betteam
        }

        $.ajax({
            type : "POST",
            url : "/bet",
            headers: {
                Authorization: Cookies.get("access_token")
            },
            dataType:"json",
            data: JSON.stringify(req),
            contentType:"application/json",

            success : function(data) {

                if (data.return_status == "ok"){
                    M.toast(
                        {
                            html:data.message,
                            displayLength: 5000,
                            classes: 'rounded'}
                        );
                    Cookies.remove("match_to_be_bet");
                    getaccountbets();
                }else if (data.return_status == "error"){
                    M.toast(
                        {
                            html:data.message,
                            displayLength: 5000,
                            classes: 'rounded'}
                        );
                }

        },error : function(jqXHR, textStatus,
                    errorThrown) {

                console.log(textStatus);
            }
        });
    }
}

function hideall(){
    $('#bets').hide();
    $('#matches').hide();
    $('#stats').hide();
    $('#managepayments').hide();
    $('#manageusers').hide();
    $('#managebets').hide();

    userinfo = JSON.parse(Cookies.get("user_info"));
    if (userinfo.is_admin !== true){
     $("#matchnav").nextAll('li').hide();   
    }
}

function getunclearedpayments(){

    userinfo = JSON.parse(Cookies.get('user_info'));

    if (userinfo.is_admin){
    
    jQuery
								.ajax({
									type : "GET",
									url : "/bet",
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {

                                        if (data.return_status == "ok"){
                                            html = "";
                                            for(var i in data.data){

                                                html += "<tr>";
                                                html += "<td><p>" + data.data[i].user.username+ "</p></td>";
                                                html += "<td><p>" + data.data[i].match.matchName+ "</p></td>";
                                                html += "<td><p>" + data.data[i].match.matchDate.substring(0,10)+ "</p></td>";
                                                html += "<td><p>" + data.data[i].betamt + "</p></td>";
                                                html += "<td><p>" + data.data[i].betteam + "</p></td>";
                                                html += "<td><a class=\"waves-effect waves-light btn clear_bet_button \"  bet-id = \""+data.data[i]._id+"\"  id= \"clear_bet_button_"+data.data[i]._id+"\">Clear bet!</a></td>"
                                                html += "</tr>";

                                            }

                                            $("#managebettable").find("tbody").html(html);

                                            $(".clear_bet_button").click(function(){
                                                betid = $("#"+this.id).attr("bet-id");
                                                clearbet(betid);

                                            });


                                        }else if (data.return_status == "error") {

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
                                });
        }


}

function clearbet(betid){

    jQuery
								.ajax({
									type : "GET",
									url : "/clearbet/" + betid,
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {

                                        if (data.return_status == "ok"){
                                            

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

                                            getunclearedpayments();

                                        }else if (data.return_status == "error") {

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
								});



}


function getmatches(){
    userinfo = JSON.parse(Cookies.get('user_info'));
    userid = userinfo._id;

    jQuery
								.ajax({
									type : "GET",
									url : "/match",
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {

                                        if (data.return_status == "ok"){
                                            html = "";
                                            for(var i in data.data){

                                                html += "<tr>";
                                                html += "<td><p>" + data.data[i].matchName+ "</p></td>";
                                                html += "<td><p>" + data.data[i].matchDate.substring(0,10)+ "</p></td>";
                                                html += "<td><p>" + data.data[i].venue + "</p></td>";
                                                html += "<td><p>" + data.data[i].firstteam + "</p></td>";
                                                html += "<td><p>" + data.data[i].secondteam + "</p></td>";
                                                html += "<td><a class=\"waves-effect waves-light btn place_bet_button modal-trigger\" data-target=\"modal_create_bet\" match-id = \""+data.data[i]._id+"\" ft=\""+data.data[i].firstteam+"\" st=\""+data.data[i].secondteam+"\" id= \"place_bet_button_"+data.data[i]._id+"\">Place your bet!</a></td>"
                                                html += "<td><a class=\"waves-effect waves=light btn check_mat_odds modal-trigger\" data-target=\"modal_check_odds\" match-id = \""+ data.data[i]._id + "\" id=\"check_match_odds_btn_" + data.data[i]._id + "\">Check odds!</a></td>";
                                                html += "</tr>";

                                            }

                                            $("#matchtable").find("tbody").html(html);

                                            $(".place_bet_button").click(function(){
                                                match_to_be_bet = $("#"+this.id).attr("match-id");
                                                ft = $("#"+this.id).attr("ft");
                                                st = $("#"+this.id).attr("st");
                                                Cookies.set("match_to_be_bet", match_to_be_bet);
                                                Cookies.set("match_to_be_bet_ft", ft);
                                                Cookies.set("match_to_be_bet_st", st);

                                                teams_string = "";

                                                teams_string += "<option value=\""+ft+"\">"+ft+"</option>";
                                                teams_string += "<option value=\""+st+"\">"+st+"</option>";
                                        
                                                $("#selectbetteamdropdown").find("select").html(teams_string);
                                                $('select').formSelect();

                                            });


                                            $(".check_mat_odds").click(function(){
                                                match_for_odds = $("#"+this.id).attr("match-id");
                                                getmatchodds(match_for_odds);
                                            });


                                        }else if (data.return_status == "error") {

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
								});


}

function getmatchodds(matchid){
    jQuery
								.ajax({
									type : "GET",
									url : "/matchodds/" + matchid,
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {



                                        if (data.return_status == "ok"){
                                            html = "";

                                            html += "<h6 style=\"margin:10px;\">Total Bets</h6>";
                                            html += "<p style=\"margin:10px;\">" + data.data.totalbets + "</p>";

                                            html += "<h6 style=\"margin:10px;\">Total Amount</h6>";
                                            html += "<p style=\"margin:10px;\">" + data.data.totalamt + "</p>";
                                            
                                            html += "<h6 style=\"margin:10px;\">Amount wise odds</h6>";
                                            html += "<p style=\"margin:10px;\">" + data.data.team1 + "&nbsp vs &nbsp" + data.data.team2 + " --> " + data.data.team1amtodd +":" + data.data.team2amtodd +"</p>";

                                            html += "<h6 style=\"margin:10px;\">Count wise odds</h6>";
                                            html += "<p style=\"margin:10px;\">" + data.data.team1 + "&nbsp vs &nbsp" + data.data.team2 + " --> " + data.data.team1cntodd +":" + data.data.team2cntodd +"</p>";

                                            
                                            html += "<h6 style=\"margin:10px;\">Per 100 rupees profit: " + data.data.team1 + "</h6>";
                                            html += "<p style=\"margin:10px;\">" + data.data.team1profitper100 + "&nbsp(approx and bound to change after your bet)</p>";

                                            html += "<h6 style=\"margin:10px;\">Per 100 rupees profit: " + data.data.team2 + "</h6>";
                                            html += "<p style=\"margin:10px;\">" + data.data.team2profitper100 + "&nbsp(approx and bound to change after your bet)</p>";


                                            $("#modal_check_odds").empty();
                                            $("#modal_check_odds").html(html);


                                        }else if (data.return_status == "error") {

                                            html = "";
                                            html += "<h6>" + JSON.stringify(data.message) + "</h6>";
                                            $("#modal_check_odds").empty();
                                            $("#modal_check_odds").html(html);


                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

                                            html = "";
                                            html += "<h6>" + "Something went wrong." + "</h6>";
                                            $("#modal_check_odds").empty();
                                            $("#modal_check_odds").html(html);

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
								});
}

function getaccountbets(){
    userinfo = JSON.parse(Cookies.get('user_info'));
    userid = userinfo._id;


    jQuery
								.ajax({
									type : "GET",
									url : "/bet/" + userid,
									data : {},
									headers: {
									    Authorization: Cookies.get("access_token")
									},
									success : function(data) {

                                        if (data.return_status == "ok"){
                                            html = "";
                                            for(var i in data.data){

                                                html += "<tr>";
                                                html += "<td><p>" + data.data[i].match.matchName+ "</p></td>";
                                                html += "<td><p>" + data.data[i].match.matchDate.substring(0,10)+ "</p></td>";
                                                html += "<td><p>" + data.data[i].betamt + "</p></td>";
                                                if(data.data[i].paid == false)
                                                    html += "<td><p>Unpaid</p></td>";
                                                else
                                                    html += "<td><p>Paid</p></td>";
                                                html += "<td><p>" + data.data[i].betteam + "</p></td>";
                                                html += "</tr>";

                                            }

                                            $("#bettable").find("tbody").html(html);


                                        }else if (data.return_status == "error") {

                                            M.toast(
                                                {
                                                    html:JSON.stringify(data.message),
                                                    displayLenght: 500000,
                                                    classes: 'rounded'}
                                                );

										} else if (data.return_status == "invalid_access_token") {

                                            M.toast(
                                                {
                                                    html:data.message,
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );
                                                window.location.assign("/login.html");

										}else {

										    M.toast(
                                                {
                                                    html:"Something went wrong.",
                                                    displayLenght: 5000,
                                                    classes: 'rounded'}
                                                );

										}

									},
									error : function(jqXHR, textStatus,
											errorThrown) {

										console.log(textStatus);
									}
								});
}

