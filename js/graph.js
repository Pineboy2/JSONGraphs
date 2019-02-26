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

    dc.renderAll();
}


function showCardsPerSet(ndx, cardData) {
    var dim = ndx.dimension(dc.pluck("code"));
    var group = dim.group();
    dc.barChart("#CardsPerSet")
        .keyAccessor(function(d) {
            return cardData.sets[d.key].name;
        })
        .valueAccessor(function(d) {
            return cardData.sets[d.key].cards.length;
        })
        .margins({ top: 10, right: 50, bottom: 100, left: 30 })
        .height(500)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(group);
}

function showArtistsPerSet(ndx, cardData) {
    var dim = ndx.dimension(dc.pluck("code"));
    var artistsGroup = dim.group().reduce(
        function add(p, v) {
            p.total++;
            v.cards.forEach(function(elem){
                if (elem.artist == "Ken Sugimori") {
                    p.kSugimori++;
                } else if (elem.artist == "5ban Graphics") {
                    p.fBan++;
                } else if (elem.artist == "Mitsuhiro Arita") {
                    p.mArita++;
                } else if (elem.artist == "Kagemaru Himeno") {
                    p.kHimeno++;
                } else if (elem.artist == "Kouki Saitou") {
                    p.kSaitou++;
                }
            })
            return p;
        },
        function remove(p, v) {
            p.total--;
            v.cards.forEach(function(elem){
                if (elem.artist == "Ken Sugimori") {
                    p.kSugimori--;
                } else if (elem.artist == "5ban Graphics") {
                    p.fBan--;
                } else if (elem.artist == "Mitsuhiro Arita") {
                    p.mArita--;
                } else if (elem.artist == "Kagemaru Himeno") {
                    p.kHimeno--;
                } else if (elem.artist == "Kouki Saitou") {
                    p.kSaitou--;
                }
            })
            return p;
        },
        function initialise() {
            return { total: 0, kSugimori: 0, fBan: 0, mArita:0, kHimeno:0, kSaitou:0 };
        }
    );
    dc.barChart("#ArtistStack")
        .dimension(dim)
        .group(artistsGroup, "Ken Sugimori")
        .valueAccessor(function(d) { return d.value.kSugimori; })
        .keyAccessor(function(d) {
            return cardData.sets[d.key].name;
        })
        .stack(artistsGroup, "5ban Graphics", function(d) {
            return d.value.fBan
        })
        .stack(artistsGroup, "Mitsuhiro Arita", function(d) {
            return d.value.mArita
        })
        .stack(artistsGroup, "Kagemaru Himeno", function(d) {
            return d.value.kHimeno
        })
        .stack(artistsGroup, "Kouki Saitou", function(d) {
            return d.value.kSaitou
        })
        .height(500)
        .margins({ top: 10, right: 50, bottom: 100, left: 30 })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(100).y(10).itemHeight(13).gap(5));
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
