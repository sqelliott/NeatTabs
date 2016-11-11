//Object to save the url and time/start time
function track_url(url,startTime) {
    this._url = url;
    this._startTime = startTime;
    this._time = 0;

}


//get the current time
function set_current_time() {
    var now =  new Date();
    return now;

}

//check if track_tabs is empty.
/*function get_track_tabs(){
 chrome.storage.local.get("track_tabs", function (items) {
 if(items.track_tabs.length > 0){

 return false;
 }
 else {
 return true;
 }
 });
 }
 */




function return_active_focus_tab(){
    var url;

    //console.log("inside return_active_focus");
    //  var Regexp = /^(\w+:\/\/[^\/]+).*$/;
    //check whether the tabs are active in their windows
    // and whether the tabs are in the current window.
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        //it should only have one tab.
        if (tabs.length == 1){

            url = tabs[0].url.match(Regexp);
            console.log("before windows.get : " + url[0])

            //Check if the window is focus.
            chrome.windows.get(tabs[0].windowId , function (window) {
                console.log(window.focused);
                if (!window.focused){
                    current_url = null;
                    console.log("Current active/focused: NULL ");
                }
                // current_url;

                console.log("Current active/focused: "+ url[0]);
            });
        }
    });
    return false;
}





/*Enter current url to the the track_tabs array
function track_tabs(url) {

    if (url.length>0 ){

        var url_time = new track_url(url[1], set_current_time());
        console.log("added to local storage : " + current_url_time._url +" "+ current_url_time._time);
        // save the current url object into track_tabs
        chrome.storage.local.set({"track_tabs": current_url_time}), function () {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
            else {
                console.log("Save to tracker Success.");
            }
        };
    }

    console.log("outside the loop");
    return false;
}

*/
