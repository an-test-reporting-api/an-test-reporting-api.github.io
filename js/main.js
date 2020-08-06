$("#debug").click(function() {
    var token = $("#token").val();
    var id = $("#id").val();

    (token.length===0)?$("#token").addClass("is-invalid"):$("#token").removeClass("is-invalid");
    (id.length===0)?$("#id").addClass("is-invalid"):$("#id").removeClass("is-invalid");
    $("#results").empty();

    //var d = getSuccessAdRequestTestData();
    //var d = getErrorAdRequestTestData();
    //console.log(d);
    //dataSuccessDisplay(d);
    //dataErrorDisplay(d);

    if (token.length > 0 && id.length > 0){
        fetchReportingAPI(token, id);
    }
});

function fetchReportingAPI(token, id){
    var host = 'https://graph.facebook.com';
    var version = '/v8.0/'
    var path = '/adnetworkanalytics?';
    var access_token = 'access_token=' + token;
    var metrics = '&metrics='+ encodeURIComponent('["fb_ad_network_request"]');
    var aggregation_period = '&aggregation_period=day';

    var url = host
    + version
    + id
    + path
    + access_token
    + aggregation_period
    + metrics;

    console.log("url", url);

    $.getJSON(url,{})
    .done(function(data) {
        console.log( "second success" );
        console.log(data);
        dataSuccessDisplay(data);
    })
    .fail(function(jqxhr, textStatus, error) {
        console.log( "error" );
        console.log(jqxhr.responseJSON);
        dataErrorDisplay(jqxhr.responseJSON, id);
    })
    .always(function() {
        //console.log( "complete" );
    });
}

function dataSuccessDisplay(data){
    var results = data.data[0].results;

    if(results.length === 0){
        $("#results").append('<p class="lead font-weight-lighter text-success">The token is valid for the property. The property has no ad request data so far.</p>');
        return;
    }

    var table = '<p class="lead font-weight-lighter text-success">The token is valid for the property</p>';
    table += '<table class="table table-striped"><thead><tr><th scope="col">Date</th><th scope="col">Ad Request</th></tr></thead><tbody>';

    for(var result in results){
        table += '<tr><td>'+results[result].time+'</td><td>'+addCommas(results[result].value)+'</td></tr>';
        console.log(results[result].time, results[result].value.toLocaleString());
    }
    table += '</tbody></table>';

    $("#results").append(table);
}

function dataErrorDisplay(data, id){
    var message = data.error.message;

    var display_message = '<p class="lead font-weight-lighter text-danger">The token has an error. Please refer <a href="https://developers.facebook.com/docs/audience-network/guides/reporting/system-user">the documentation</a> and check:<br>'
    + '<br><small>1. Please make sure you selected “read_audience_network_insights” permission when you generate the token.</small>'
    + '<br><small>2. Please make sure you added the token of System User to the Property ID: '+id+'.</small>'
    + '<br><br>If you still see an error, please reach out to your Account Manager if you have.</p>';

    $("#results").append(display_message);

}

function addCommas(str){
    return str.replace(/^0+/, '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getNoAdRequestTestData(){
  return JSON.parse('{"data":[{"query_id":"70b596f5f215488d4b25eea1b42d3065","results":[]}],"paging":{"cursors":{"before":"MAZDZD","after":"MAZDZD"}}}');
}

function getSuccessAdRequestTestData(){
  return JSON.parse('{"data":[{"query_id":"74e929f7b53dc1fb03577ceda451318c","results":[{"time":"2020-06-04T07:00:00+0000","metric":"fb_ad_network_request","value":"179879443"},{"time":"2020-06-03T07:00:00+0000","metric":"fb_ad_network_request","value":"183102485"},{"time":"2020-06-02T07:00:00+0000","metric":"fb_ad_network_request","value":"158318922"},{"time":"2020-06-01T07:00:00+0000","metric":"fb_ad_network_request","value":"178293467"},{"time":"2020-05-31T07:00:00+0000","metric":"fb_ad_network_request","value":"149856926"},{"time":"2020-05-30T07:00:00+0000","metric":"fb_ad_network_request","value":"155381477"},{"time":"2020-05-29T07:00:00+0000","metric":"fb_ad_network_request","value":"169682420"}]}],"paging":{"cursors":{"before":"MAZDZD","after":"NgZDZD"}}}');
}

function getErrorAdRequestTestData(){
  return JSON.parse('{"error": {"message": "Unsupported get request. Object with ID \'404976889953917\' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api","type": "GraphMethodException","code": 100,"error_subcode": 33,"fbtrace_id": "AMqokeifLT8nwUDxnprfoRM"}}');
}
