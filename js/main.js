var jsonData = null;

$(document).ready(function() { // On page load gets the JSON data from ./static/js/cards.json and hide loading screen
    $.when(
        $.getJSON('js/cards.json')
    ).done(function(json) {
        jsonData = json;
        $("#loading").attr("hidden", true);
        $("#graphs").attr("hidden", false);
        populateDropdown();
    });
}); // On page load gets the JSON data from ./static/js/cards.json and hide loading screen

function randomSet() { // Picks a random set code from array of all sets
    return Object.keys(jsonData.sets)[Math.floor(Math.random()*Object.keys(jsonData.sets).length)];
} // Picks a random set code from array of all sets

function randomCard(set) { // Takes string "set" and returns an object of card data from set.cards 
    return jsonData.sets[set].cards[Object.keys(jsonData.sets[set].cards)[Math.floor(Math.random()*Object.keys(jsonData.sets[set].cards).length)]];
} // Takes string "set" and returns an object of card data from set.cards 

function getExpansionData(code) { // Takes string "code" and returns object with data of sets with code "code"
    var expansion = {};
    var dateArray = jsonData.sets[code].releaseDate.split("/");
    expansion.releaseDate = parseInt(dateArray[2] + dateArray[0] + dateArray[1], 10);
    expansion.series = jsonData.sets[code].series;
    expansion.name = jsonData.sets[code].name;
    expansion.code = jsonData.sets[code].code;
    return expansion;
} // Takes string "code" and returns object with data of sets with code "code"

function populateDropdown() { // Populates #expansionDropdown with buttons
    var gens = {};
    gens.gen1 = [],
        gens.gen2 = [],
        gens.gen3 = [],
        gens.gen4 = [],
        gens.gen5 = [],
        gens.gen6 = [],
        gens.gen7 = [],
        gens.pop = [];

    function createButton(code, name) {
        return "<button id=\""+code+"\" class=\"dropdown-item\" type=\"button\" onclick='writeDataToDOM(\"setDataOut\", getSetData(\""+code+"\"));toggleActive(\""+code+"\");'>" + name + "</button>";
    }
    var total = 0;
    for (var key in jsonData.sets) {
        total++;
        var expansion = getExpansionData(key);
        if (expansion.series == "POP") {
            gens.pop.push(expansion);
        }
        else if (expansion.releaseDate < 20001216) {
            gens.gen1.push(expansion);
        }
        else if (expansion.releaseDate < 20030701) {
            gens.gen2.push(expansion);
        }
        else if (expansion.releaseDate < 20070501) {
            if (expansion.name != "Nintendo Black Star Promos") {
                gens.gen3.push(expansion);
            }
            else {
                gens.gen3.push(expansion);
            }
        }
        else if (expansion.releaseDate < 20110301) {
            gens.gen4.push(expansion);
        }
        else if (expansion.releaseDate < 20131012 || expansion.code === "bw11") { // bw11 was released after xyp so requires special handling
            gens.gen5.push(expansion);
        }
        else if (expansion.releaseDate < 20170203) {
            gens.gen6.push(expansion);
        }
        else {
            gens.gen7.push(expansion);
        }
    }
    for (var key in gens) {
        gens[key].sort(function(a,b) {
            return a.releaseDate - b.releaseDate;
        }).forEach(function(elem) {
            $("#"+key).before(createButton(elem.code, elem.name));
    })}
    $("#pop").after('<div class="dropdown-header">Total Expansions: ' + total + '</div>');
} // Populates #expansionDropdown with buttons

function sortObjectByValueNumber(object) { // Takes object and returns object sorted by value numerically 
    var arrayList = Object.keys(object).sort(function(a, b) { return object[a] - object[b] }).reverse();
    var sortingArray = {};
    for (var i = 0; i < arrayList.length; i++) {
        sortingArray[arrayList[i]] = object[arrayList[i]];
    }
    return sortingArray;
} // Takes object and returns object sorted by value numerically 

function objectToMarkup(object, makeCols) { // Takes object and returns string of li tags 
    var bigCol = "";
    var smallCol = "";
    if (makeCols === true) {
        bigCol = "class='col-9'";
        smallCol = "class='col-3'";
    }
    var output = "";
    for (var i in object) {
        if (i === "") {
            output += "<tr class='dataCols'><td " + bigCol + "><em class='text-muted'>none</em></td><td " + smallCol + ">" + object[i] + "</td></tr>";
        }
        else {
            output += "<tr class='dataCols'><td " + bigCol + ">" + i + "</td><td " + smallCol + ">" + object[i] + "</td></tr>";
        }
    }
    return output;
} // Takes object and returns string of li tags 

function renameBlank(object, newName) { // Takes object and renames the blank key "" to string newName
    if ("" in object) {
        object[newName] = object[""];
        delete object[""];
    }
    return object;
} // Takes object and renames the blank key "" to string newName

function toggleActive(code) { // Removes class "active" from all elements with class ".dropdown-item" then adds class "active" to clicked element "el"
    $(".dropdown-item").attr("class", "dropdown-item");
    $("#"+code).attr("class", "dropdown-item active");
} // Removes class "active" from all elements with class ".dropdown-item" then adds class "active" to clicked element "el"

function writeDataToDOM(el, data) { // Writes data "data" to string of element id "el" 
    $("#" + el)[0].innerHTML = objectToMarkup(data);
} // Writes data "data" to string of element id "el"

function getSetData(key) { // Takes set name string "key" and returns object of data of set
    var trueName = jsonData.sets[key]["name"];
    if (jsonData.sets[key]["series"] === "EX") {
        trueName = "EX " + jsonData.sets[key]["name"];
    }
    else if (jsonData.sets[key]["name"] === "Base") {
        trueName = "Base Set";
    }
    var splitdate = jsonData.sets[key].releaseDate.split("/");
    $("#expansionDropdown")[0].innerHTML = trueName;
    return {
        "Set Name": trueName,
        "Total Cards": jsonData.sets[key].totalCards,
        "Series Name": jsonData.sets[key].series,
        "Release Date": splitdate[1] + "/" + splitdate[0] + "/" + splitdate[2],
        "Standard Legal": jsonData.sets[key].standardLegal,
        "Expanded Legal": jsonData.sets[key].expandedLegal,
        "Artists": "<table class='subTable'><tbody class='container'>" + objectToMarkup(sortObjectByValueNumber(getAllFromSet("artist", jsonData.sets[key].cards)), true) + "</tbody></table>",
        "Card Names": "<table class='subTable'><tbody class='container'>" + objectToMarkup(getAllFromSet("name", jsonData.sets[key].cards), true) + "</tbody></table>",
        "Pokedex Number": "<table class='subTable'><tbody class='container'>" + objectToMarkup(getAllFromSet("nationalPokedexNumber", jsonData.sets[key].cards), true) + "</tbody></table>",
    };
} // Takes set name string "key" and returns object of data of set

function getAllOfKey(key) { // Takes string "key" and gets all keys in jsonData with name "key"
    var testString = "";
    var allKeys = {};
    for (var set in jsonData.sets) {
        for (var card in jsonData.sets[set].cards) {
            if (["artist", "convertedRetreatCost", "evolvesFrom", "hp", "level", "name", "nationalPokedexNumber", "rarity", "subtype", "supertype", "types", "evolvesTo"].indexOf(key) === -1) {
                if (key === "weaknesses" || key === "resistances") {
                    if (jsonData.sets[set].cards[card][key] !== undefined) {
                        if (jsonData.sets[set].cards[card][key][0] !== undefined) {
                            testString = jsonData.sets[set].cards[card][key][0].type + " " + jsonData.sets[set].cards[card][key][0].value;
                        }
                        else {
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
    if (key === "hp") {
        var trueName = "HP";
    }
    else {
        var trueName = key.replace(/([A-Z])/g, " $1");
        trueName = trueName.charAt(0).toUpperCase() + trueName.slice(1);
    }
    $("#totalDropdown")[0].innerHTML = trueName;
    return sortObjectByValueNumber(allKeys);
} // Takes key name string "key"and returns object with all keys in jsonData with name "key"

function getAllFromSet(key, set) { // Takes key name string "key" and set name object property "set" and returns all keys in "set" with name "key"
    var allKeys = {};
    for (var card in set) {
        if (set[card][key] in allKeys) {
            allKeys[set[card][key]] += 1;
        }
        else {
            allKeys[set[card][key]] = 1;
        }
    }
    return allKeys;
} // Takes key name string "key" and set name object property "set" and returns object with all keys in "set" with name "key"

function resetPage() {
    if ($('#graphs').attr("hidden") === "hidden") {
        $('#setDataOut').empty();
        $('#allKeyOut').empty();
        $('#expansionDropdown')[0].innerText = "Select Expansion";
        $('#totalDropdown')[0].innerText = "Select Data Type";
        $(".dropdown-item").attr("class", "dropdown-item");
    }
    else {
        dc.refocusAll();
        $('#text').attr('hidden', true);
        $('#graphs').attr('hidden', false);
    }
}

function changeSection (section) {
    $('section').attr('hidden', true);
    $('#' + section).attr('hidden', false)
}