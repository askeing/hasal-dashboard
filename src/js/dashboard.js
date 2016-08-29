"use strict";

var data = new Object();

var os_list = [];
var target_dict = new Object(); // {'OS_NAME': ['Target1', 'Target2', ...]}
var result_dict = new Object(); // {'OS_NAME': {'Target1': [RESULT_1_OBJ, RESULT_2_OBJ, ...], ...}}

function getParameter(parameter_name) {
    var selfURL = window.location.search.substring(1);
    var parameters = selfURL.split('&');
    for (var i = 0; i < parameters.length; i++)
    {
        var parameter = parameters[i].split('=');
        if (parameter[0] == parameter_name)
        {
            return parameter[1];
        }
    }
}

function cleanContainer() {
    $("#result_list").empty();
}

function setupDefaultContainer() {
    var html = "<div class=\"well\">Please select the OS and Target...</div>";
    $("#result_list").html(html);
}

function addAlertToContainer(key, value) {
    var html = "<div class=\"alert alert-danger\" role=\"alert\">Cannot get " + key + " " + value + "</div>";
    $("#result_list").append(html);
}

function checkInputParameters(input_os, input_target, input_comment, input_test, input_webapp) {
    if (input_os) {
        if ($.inArray(input_os, os_list) > -1) {
            selectOS(input_os);

            if (input_target) {
                if ($.inArray(input_target, target_dict[input_os]) > -1) {
                    selectTarget(input_os, input_target);
                } else {
                    addAlertToContainer('Target', input_target);
                    return;
                }
            }

        } else {
            addAlertToContainer('OS', input_os);
            return;
        }
    }
}

function createTableToContainer() {
    //var html = '<table class="table table-striped sortable" id="result-table"></table>';
    var html = '<table class="table table-bordered table-striped sortable" id="result-table"></table>';
    $("#result_list").html(html);
}

function generateResult(input_array) {
    cleanContainer();
    createTableToContainer();
    var keys_name =     ["Comment", "WebApp", "Test", "Browser", "Version", "Platform", "Median(ms)", "Sigma", "Mean(ms)", "Video", "Profile"];
    var keys_sortable = [true, true, true, true, true, true, true, true, true, false, false];
    var keys =          ["comment", "webappname", "test", "browser", "version", "platform", "median_value", "sigma_value", "mean_value", "video_path", "profile_path"];

    // Generate thead
    var thead = $('<thead></thead>');
    var thead_tr = $('<tr></tr>');
    thead.append(thead_tr);
    for (var i=0; i < keys_name.length; i++) {
        if (keys_sortable[i]) {
            thead_tr.append('<th>' + keys_name[i] + '</th>');
        } else {
            thead_tr.append('<th data-defaultsort="disabled">' + keys_name[i] + '</th>');
        }

    }
    $("#result-table").append(thead);

    // Generate tbody
    var tbody = $('<tbody></tbody>');
    $.each(input_array, function(index, element){
        var tr = $('<tr></tr>');
        for (var i=0; i < keys.length; i++) {
            if (typeof keys[i] == 'string') {
                tr.append('<td>' + element[keys[i]] + '</td>');
            } else {
                var td = $('<td></td>');
                for (var j=0; j < keys[i].length; j++) {
                    td.append('<p>' + element[keys[i][j]] + '</p>');
                }
                tr.append(td);
            }
        }
        tbody.append(tr);
    });
    $("#result-table").append(tbody);

    // Enable Sortable Table!
    $.bootstrapSortable(true);
}

function selectTarget(os_name, target_name) {
    $("#btn-target-label").text(target_name);
    console.log(result_dict[os_name][target_name]);
    generateResult(result_dict[os_name][target_name]);
}

function addTargetButtonsAction() {
    // Target dropdown button changed
    $("ul#btn-target-selection li").click(function () {
        var os_name = $("#btn-os-label").text();
        var select_target_id = this.id;
        var target_name = $(this).text();
        selectTarget(os_name, target_name);
    });
}

function selectOS(os_name) {
    $("#btn-os-label").text(os_name);
    $("#target-menu").removeClass("disabled");
    cleanTargetButtons();
    for (var i = 0; i < target_dict[os_name].length; i++) {
        addTargetButtons(target_dict[os_name][i]);
    }
    addTargetButtonsAction();
    cleanContainer();
    setupDefaultContainer();
}

function addOSButtonsAction() {
    // OS dropdown button changed
    $("ul#btn-os-selection li").click(function () {
        var select_os_id = this.id;
        var os_name = $(this).text();
        selectOS(os_name);
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
    $("ul#btn-target-selection").empty();
    $("#btn-target-label").text("Select Target");
}

function addTargetButtons(target_name) {
    if (target_name != null) {
        var id = "lang-" + target_name;
        var li_html = "<li id=\"" + id + "\"><a href=\"#\">" + target_name + "</a></li>";
        $("ul#btn-target-selection").append(li_html);
    }
}

// Comapre the array of result_dict[os_name][target_name]
function compareResultArray(resultA, resultB) {
    // compare comment first
    if (resultA.comment < resultB.comment) {
        return -1;
    } else if (resultA.comment > resultB.comment) {
        return 1;
    } else if (resultA.comment == resultB.comment) {
        // if comment is the same, compare webapp name
        if (resultA.webappname < resultB.webappname) {
            return -1;
        } else if (resultA.webappname > resultB.webappname) {
            return 1;
        } else if (resultA.webappname == resultB.webappname) {
            // if comment and webapp name are the same, compare the test name
            if (resultA.test < resultB.test) {
                return -1;
            } else if (resultA.test > resultB.test) {
                return 1;
            } else if (resultA.test == resultB.test) {
                // if comment and test name are the same, compare the browser name
                if (resultA.browser < resultB.browser) {
                    return -1;
                } else if (resultA.browser > resultB.browser) {
                    return 1;
                } else if (resultA.browser == resultB.browser) {
                    return 0;
                }
            }
        }
    }
    return 0;
}

function generateOsAndTarget(input_json) {
    data = input_json;

    os_list = Object.keys(data);
    for (var os_name in data) {
        // TODO: new array for target_dict, and add OS_Name into dropdown button
        target_dict[os_name] = new Array();
        result_dict[os_name] = new Object();

        addOSButtons(os_name);

        var os = data[os_name];
        var target_names = Object.keys(os);
        target_dict[os_name] = target_names;

        for (var target_name in os) {
            result_dict[os_name][target_name] = new Array();

            var target = os[target_name];
            for (var test_name in target) {
                var test = target[test_name];
                for (var comment_name in test) {
                    var comment = test[comment_name]
                    for (var bowser_name in comment) {
                        var browser_ret = comment[bowser_name];
                        browser_ret.test = browser_ret.test.replace(/test_firefox_/g, '').replace(/test_chrome_/g, '');
                        browser_ret.median_value = Number(browser_ret.median_value).toFixed(2);
                        browser_ret.sigma_value = Number(browser_ret.sigma_value).toFixed(2);
                        browser_ret.mean_value = Number(browser_ret.mean_value).toFixed(2);
                        browser_ret.mean_value = Number(browser_ret.mean_value).toFixed(2);
                        if (browser_ret.video_path) {
                            // <iframe class="embed-responsive-item" src="VIDEO_PATH" width="640" height="480"></iframe>
                            browser_ret.video_path = '<iframe class="embed-responsive-item" src="' + browser_ret.video_path + '" width="320" height="240"></iframe>';
                        }
                        result_dict[os_name][target_name].push(browser_ret);
                    }
                }
            }
            // Comapre the array of result_dict[os_name][target_name]
            result_dict[os_name][target_name].sort(compareResultArray);
        }
    }

    addOSButtonsAction();

    $("#btn-container button").tooltip();
}

$(document).ready(function() {
    var input_os = getParameter("os");
    var input_target = getParameter("target");
    var input_comment = getParameter("comment");
    var input_test = getParameter("test");
    var input_webapp = getParameter("webapp");

    setupDefaultContainer();

    $.getJSON( "config/data.json", function( data ) {
        generateOsAndTarget(data);
        checkInputParameters(input_os, input_target, input_comment, input_test, input_webapp);
    });
});

