webOS.service.request("luna://com.webos.service.applicationmanager", {
    method: "listApps",
    parameters: {},
    onSuccess: function (res) {
        console.log("List apps success:", res);
        // `res` contains an array of app information.
        // You can iterate through this array to get app details.
    },
    onFailure: function (res) {
        console.log("List apps fail:", res);
    }
});