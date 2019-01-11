dc.config.defaultColors(d3.scaleSequential(d3.interpolatePiYG));

$.when(
    $.getJSON('js/cards.json')
).done(function(json) {
    makeGraphs(json);
});

function makeGraphs(cardData) {
    var ndx = [];
    for (var set in cardData.sets) {
        ndx.push(cardData.sets[set]);
    }
    ndx = crossfilter(ndx);

    showCardsPerSet(ndx, cardData);
    showArtistsPerSet(ndx, cardData);
    showArtistsPerSet2(ndx, cardData);
    
    dc.renderAll();
}


function showCardsPerSet(ndx, cardData) {
    var dim = ndx.dimension(dc.pluck("code"));
    var group = dim.group();
    dc.barChart("#CardsPerSet")
        .keyAccessor(function(d){
            return cardData.sets[d.key].name;
        })
        .valueAccessor(function(d){
            return cardData.sets[d.key].cards.length;
        })
        .width(5000)
        .height(500)
        .margins({top: 10, right: 50, bottom: 100, left: 30})
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(group);
}

function showArtistsPerSet(ndx, cardData) {
    function getArtist(dimension, artist) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.artist == artist) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.artist == artist) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }
    var dim = ndx.dimension(dc.pluck("code"));
    var group = dim.group();
    var kenSugimori = getArtist(dim, "Ken Sugimori");
    dc.barChart("#KenSugimori")
        .keyAccessor(function(d){
            return cardData.sets[d.key].name;
        })
        .valueAccessor(function(d){
            return getAllFromSet("artist", cardData.sets[d.key].cards)["Ken Sugimori"];
        })
        .width(5000)
        .height(500)
        .margins({top: 10, right: 50, bottom: 100, left: 30})
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(group);
}

function showArtistsPerSet2(ndx, cardData) {
    function getArtist(dimension, artist) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.artist == artist) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.artist == artist) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }
    var dim = ndx.dimension(dc.pluck("code"));
    var group = dim.group();
    var fbGraphics = getArtist(dim, "5ban Graphics");
    dc.barChart("#FBGraphics")
        .keyAccessor(function(d){
            return cardData.sets[d.key].name;
        })
        .valueAccessor(function(d){
            return getAllFromSet("artist", cardData.sets[d.key].cards)["5ban Graphics"];
        })
        .width(5000)
        .height(500)
        .margins({top: 10, right: 50, bottom: 100, left: 30})
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(group);
}

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
}