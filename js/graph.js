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
    showAllTypes(ndx, cardData);

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
        .group(group)
        .ordering(function(d){
            var dateArray = cardData.sets[d.key].releaseDate.split("/");
            return parseInt(dateArray[2]+dateArray[0]+dateArray[1], 10);
        });
}

function showArtistsPerSet(ndx, cardData) {
    var dim = ndx.dimension(dc.pluck("code"));
    var artistsGroup = dim.group().reduce(
        function add(p, v) {
            p.total++;
            v.cards.forEach(function(elem) {
                if (elem.artist == "Ken Sugimori") {
                    p.kSugimori++;
                }
                else if (elem.artist == "5ban Graphics") {
                    p.fBan++;
                }
                else if (elem.artist == "Mitsuhiro Arita") {
                    p.mArita++;
                }
                else if (elem.artist == "Kagemaru Himeno") {
                    p.kHimeno++;
                }
                else if (elem.artist == "Kouki Saitou") {
                    p.kSaitou++;
                }
                else if (elem.artist == "Ryo Ueda") {
                    p.rUeda++;
                }
                else if (elem.artist == "Masakazu Fukuda") {
                    p.mFukuda++;
                }
                else if (elem.artist == "Atsuko Nishida") {
                    p.aNishida++;
                }
                else if (elem.artist == "Midori Harada") {
                    p.mHarada++;
                }
                else {
                    p.other++;
                }
            });
            return p;
        },
        function remove(p, v) {
            p.total--;
            v.cards.forEach(function(elem) {
                if (elem.artist == "Ken Sugimori") {
                    p.kSugimori--;
                }
                else if (elem.artist == "5ban Graphics") {
                    p.fBan--;
                }
                else if (elem.artist == "Mitsuhiro Arita") {
                    p.mArita--;
                }
                else if (elem.artist == "Kagemaru Himeno") {
                    p.kHimeno--;
                }
                else if (elem.artist == "Kouki Saitou") {
                    p.kSaitou--;
                }
                else if (elem.artist == "Ryo Ueda") {
                    p.rUeda--;
                }
                else if (elem.artist == "Masakazu Fukuda") {
                    p.mFukuda--;
                }
                else if (elem.artist == "Atsuko Nishida") {
                    p.aNishida--;
                }
                else if (elem.artist == "Midori Harada") {
                    p.mHarada--;
                }
                else {
                    p.other--;
                }
            });
            return p;
        },
        function initialise() {
            return { total: 0, kSugimori: 0, fBan: 0, mArita: 0, kHimeno: 0, kSaitou: 0, rUeda: 0, mFukuda: 0, aNishida: 0, mHarada: 0, other: 0 };
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
            return d.value.fBan;
        })
        .stack(artistsGroup, "Mitsuhiro Arita", function(d) {
            return d.value.mArita;
        })
        .stack(artistsGroup, "Kagemaru Himeno", function(d) {
            return d.value.kHimeno;
        })
        .stack(artistsGroup, "Kouki Saitou", function(d) {
            return d.value.kSaitou;
        })
        .stack(artistsGroup, "Ryo Ueda", function(d) {
            return d.value.rUeda;
        })
        .stack(artistsGroup, "Masakazu Fukuda", function(d) {
            return d.value.mFukuda;
        })
        .stack(artistsGroup, "Atsuko Nishida", function(d) {
            return d.value.aNishida;
        })
        .stack(artistsGroup, "Midori Harada", function(d) {
            return d.value.mHarada;
        })
        .stack(artistsGroup, "Other", function(d) {
            return d.value.other;
        })
        .height(500)
        .margins({ top: 10, right: 50, bottom: 100, left: 30 })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(500).y(10).itemHeight(13).gap(5))
        .ordering(function(d){
            var dateArray = cardData.sets[d.key].releaseDate.split("/");
            return parseInt(dateArray[2]+dateArray[0]+dateArray[1], 10);
        });
}

function showAllTypes(ndx, cardData) {
    var dim = ndx.dimension(function(d) {
        return d.cards.map(x => x.types);
    });
    var typesGroup = dim.group().reduce(
        function add(p, v) {
            p.total++;
            $.each(cardData.sets, function(key, value) {
                $.each(value.cards, function(key, value) {
                    switch (value.types) {
                        case 'Water':
                            p.water++;
                            break;
                        case 'Grass':
                            p.grass++;
                            break;
                        case 'Colorless':
                            p.colorless++;
                            break;
                        case 'Psychic':
                            p.psychic++;
                            break;
                        case 'Fighting':
                            p.fighting++;
                            break;
                        case 'Fire':
                            p.fire++;
                            break;
                        case 'Lightning':
                            p.lightning++;
                            break;
                        case 'Darkness':
                            p.darkness++;
                            break;
                        case 'Metal':
                            p.metal++;
                            break;
                        case 'Dragon':
                            p.dragon++;
                            break;
                        case 'Fairy':
                            p.fairy++;
                            break;
                        default:
                            p.other++;
                    }
                });
            });
            return p;
        },
        function remove(p, v) {
            p.total--;
            $.each(cardData.sets, function(key, value) {
                $.each(value.cards, function(ckey, cvalue) {
                    switch (cvalue.types) {
                        case 'Water':
                            p.water--;
                            break;
                        case 'Grass':
                            p.grass--;
                            break;
                        case 'Colorless':
                            p.colorless--;
                            break;
                        case 'Psychic':
                            p.psychic--;
                            break;
                        case 'Fighting':
                            p.fighting--;
                            break;
                        case 'Fire':
                            p.fire--;
                            break;
                        case 'Lightning':
                            p.lightning--;
                            break;
                        case 'Darkness':
                            p.darkness--;
                            break;
                        case 'Metal':
                            p.metal--;
                            break;
                        case 'Dragon':
                            p.dragon--;
                            break;
                        case 'Fairy':
                            p.fairy--;
                            break;
                        default:
                            p.other--;
                    }
                });
            });
            return p;
        },
        function initialise() {
            return { total: 0, water: 0, grass: 0, colorless: 0, psychic: 0, fighting: 0, fire: 0, lightning: 0, darkness: 0, metal: 0, dragon: 0, fairy: 0, other: 0 };
        },
    );
    dc.pieChart("#CardTypes")
        .dimension(dim)
        .group(typesGroup, "Water")
        .valueAccessor(function(d) { return d.value.water; })
        .height(500)
        .width(500)
        .legend(dc.legend());
}
