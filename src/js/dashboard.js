"use strict";

var data = new Object();

var os_list = [];
var target_dict = new Object(); // {'OS_NAME': ['Target1', 'Target2', ...]}

function addTargetButtonsAction() {
    // Target dropdown button changed
    $("ul#btn-target-selection li").click(function () {
        var os_name = $("#btn-os-label").text();
        var select_target = this.id;
        var select_target_text = $(this).text();
        console.log(select_target_text);
        if (select_target === "target-no") {
            $("#btn-target-label").text(select_target_text);
        }
        else {
            $("#btn-target-label").text(select_target_text);
            // TODO: get all result base on OS and Target
            console.log("SHOW ALL result base on " + os_name + " and " + select_target_text);
        }
    });
}

function addOSButtonsAction() {
    // OS dropdown button changed
    $("ul#btn-os-selection li").click(function () {
        var select_os = this.id;
        var select_os_text = $(this).text();
        console.log(select_os_text);
        if (select_os === "os-no") {
            $("#btn-os-label").text(select_os_text);
            $("#target-menu").addClass("disabled");
        }
        else {
            $("#btn-os-label").text(select_os_text);
            $("#target-menu").removeClass("disabled");
            cleanTargetButtons();
            for (var i = 0; i < target_dict[select_os_text].length; i++) {
                addTargetButtons(target_dict[select_os_text][i]);
            }
        }
        addTargetButtonsAction();
    });
}

function addOSButtons(os_name) {
    if (os_name != null) {
        var id = "os-" + os_name;
        var li_html = "<li id=\"" + id + "\"><a href=\"#\">" + os_name + "</a></li>";
        $("ul#btn-os-selection").append(li_html);
    }
}

function cleanTargetButtons() {
    //var origin_target_html = '<li id="target-no"><a href="#">--</a></li><li role="separator" class="divider"></li>';
    $("ul#btn-target-selection").empty();
    //$("ul#btn-target-selection").append(origin_target_html);
    $("#btn-target-label").text("Select Target");
}

function addTargetButtons(target_name) {
    if (target_name != null) {
        var id = "lang-" + target_name;
        var li_html = "<li id=\"" + id + "\"><a href=\"#\">" + target_name + "</a></li>";
        $("ul#btn-target-selection").append(li_html);
    }
}



function generateOsAndTarget(input_json) {
    data = input_json;

    os_list = Object.keys(data);
    for (var i = 0; i < os_list.length; i++) {
        var os_name = os_list[i];
        // TODO: new array for target_dict, and add OS_Name into dropdown button
        target_dict[os_name] = new Array();
        addOSButtons(os_name);

        console.log('OS: ' + os_name);
        var os = data[os_name];
        var target_names = Object.keys(os);

        for (var j = 0; j < target_names.length; j++) {
            var target_name = target_names[j];
            // TODO: add target into target_dict
            target_dict[os_name].push(target_name);

            console.log('OS: ' + os_name + ', target: ' + target_name);
            var target = os[target_name];
            for (var test_name in target) {
                var test = target[test_name];
                for (var comment_name in test) {
                    var comment = test[comment_name]
                    for (var bowser_name in comment) {
                        var browser_ret = comment[bowser_name];
                        console.log('=====================');
                        console.log('test: ' + browser_ret.test);
                        console.log('os: ' + browser_ret.os);
                        console.log('target: ' + browser_ret.target);
                        console.log('platform: ' + browser_ret.platform);
                        console.log('browser: ' + browser_ret.browser);
                        console.log('version: ' + browser_ret.version);
                        console.log('median: ' + browser_ret.median_value);
                        console.log('sigma: ' + browser_ret.sigma_value);
                        console.log('mean: ' + browser_ret.mean_value);
                        // <iframe src="VIDEO_PATH" width="640" height="480"></iframe>
                        console.log('video: ' + browser_ret.video_path);
                        console.log('profile: ' + browser_ret.profile_path);
                    }
                }
            }
        }
    }

    addOSButtonsAction();

    $("#btn-container button").tooltip();
}

$(document).ready(function() {
    $.getJSON( "config/dump.json", function( data ) {
        console.log('Loading dump.json...');
        generateOsAndTarget(data);
        console.log('Loading dump.json done.');
    });
});
