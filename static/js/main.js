var jsonData = null;
$(document).ready(function() { // On page load gets the JSON data from ./static/js/cards.json
    $.when(
        $.getJSON('js/cards.json')
    ).done(function(json) {
        jsonData = json;
        $("#onLoading").attr("hidden", true)
        $("#onLoaded").attr("hidden", false)
    });
}); // On page load gets the JSON data from ./static/js/cards.json

function sortObjectByValueNumber(object) { // Takes object and returns object sorted by value numerically 
    var arrayList = Object.keys(object).sort(function(a, b) { return object[a] - object[b] }).reverse();
    var sortingArray = {};
    for (var i = 0; i < arrayList.length; i++) {
        sortingArray[arrayList[i]] = object[arrayList[i]];
    }
    return sortingArray;
} // Takes object and returns object sorted by value numerically 

function objectToMarkup(object, outList) { // Takes object and returns string of li tags 
    var output = "";
    for (var i in object) {
        if (i === "") {
            output += "<tr class='dataCols text-danger'><td>JSON WAS BLANK</td><td>" + object[i] + "</td></tr>";
        }
        else {
            output += "<tr class='dataCols'><td>" + i + "</td><td>" + object[i] + "</td></tr>";
        }
    }
    output += ""
    return output;

} // Takes object and returns string of li tags 

function renameBlank(object, newName) { // Takes object and renames the blank key "" to string newName
    if ("" in object) {
        object[newName] = object[""];
        delete object[""];
    }
    return object;
} // Takes object and renames the blank key "" to string newName

function toggleActive(el) { // Removes class "active" from all elements with class ".dropdown-item" then adds class "active" to clicked element "el"
    $(".dropdown-item").attr("class", "dropdown-item");
    $(el).attr("class","dropdown-item active");
    
}  // Removes class "active" from all elements with class ".dropdown-item" then adds class "active" to clicked element "el"

function writeDataToDOM(el, data) { // Writes data "data" to string of element id "el" 
    $("#"+el)[0].innerHTML = objectToMarkup(sortObjectByValueNumber(data));
} // Writes data "data" to string of element id "el"
/*
function parseSetData(type) {
    const colours = { true: "text-success", false: "text-danger" };
    var el = document.getElementById("dataOut");
    el.innerHTML = "<tr><th>Key</th><th>Value</th></tr>";
        data = data.sets;
        var trueName = data[type]["name"];
        if (data[type]["series"] === "EX") {
            trueName = "EX " + data[type]["name"];
        }
        else if (data[type]["name"] === "Base") {
            trueName = "Base Set";
        }
        var standardcolour = colours[data[type].standardLegal];
        var expandedcolour = colours[data[type].expandedLegal];
        var splitdate = data[type].releaseDate.split("/");
        el.innerHTML += "<tr><td>Set Name</td><td>" + trueName + "</td></tr>";
        el.innerHTML += "<tr><td>Total Cards</td><td>" + data[type].totalCards + "</td></tr>";
        el.innerHTML += "<tr><td>Series Name</td><td>" + data[type].series + "</td></tr>";
        el.innerHTML += "<tr><td>Release Date</td><td>" + splitdate[1] + "/" + splitdate[0] + "/" + splitdate[2] + "</td></tr>";
        el.innerHTML += "<tr><td>Standard Legal</td><td class='" + standardcolour + "'>" + data[type].standardLegal + "</td></tr>";
        el.innerHTML += "<tr><td>Expanded Legal</td><td class='" + expandedcolour + "'>" + data[type].expandedLegal + "</td></tr>";
        $("#expansionDropdown")[0].innerHTML = trueName;
        var artists = {};
        for (var card in data[type].cards) {
            console.log("Supertype: " + data[type].cards[card].supertype);
            if (data[type].cards[card].artist in artists) {
                artists[data[type].cards[card].artist] += 1;
            }
            else {
                artists[data[type].cards[card].artist] = 1;
            }
        }
        var sortedArtists = sortObjectByValueNumber(artists);
        var artistOut = "";
        el.innerHTML += "<tr><td>Artists</td><td><ul>" + objectToMarkup(sortedArtists) + "</ul></td></tr>";
}
*/
function getAllOfKey(key) {
    var testString = "";
    var allKeys = {};
    for (var set in jsonData.sets) {
        for (var card in jsonData.sets[set].cards) {
            if (["artist", "convertedRetreatCost", "evolvesFrom", "hp", "level", "name", "nationalPokedexNumber", "rarity", "subtype", "supertype", "types", "evolvesTo"].indexOf(key) === -1) {
                if (key === "weaknesses" || key === "resistances") {
                    if (jsonData.sets[set].cards[card][key] !== undefined) {
                        if (jsonData.sets[set].cards[card][key][0] !== undefined) {
                           testString = jsonData.sets[set].cards[card][key][0].type + " " + jsonData.sets[set].cards[card][key][0].value;
                        } else {
                            testString = "None";
                        }
                    }
                    else {
                            testString = "None";
                    }
                }
                else {
                    testString = JSON.stringify(jsonData.sets[set].cards[card][key]);
                }
            }
            else {
                testString = jsonData.sets[set].cards[card][key];
            }
            if (testString in allKeys) {
                allKeys[testString] += 1;
            }
            else {
                allKeys[testString] = 1;
            }
        }
    }
    delete allKeys[undefined];
    return allKeys;
}

