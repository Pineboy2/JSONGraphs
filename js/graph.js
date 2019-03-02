dc.config.defaultColors(d3.scaleSequential(d3.interpolatePiYG));

$.when(
    $.getJSON('js/cards.json')
).done(function(json) {
    makeGraphs(json);
});

function makeGraphs(cardData) {
    var ndx = []; // Full Sets
    for (var set in cardData.sets) {
        ndx.push(cardData.sets[set]);
    }
    ndx = crossfilter(ndx);
    var cdx = []; // Individual Cards
    for (var set in cardData.sets) {
        for (var card in cardData.sets[set].cards) {
            cdx.push(cardData.sets[set].cards[card]);

        }
    }
    cdx = crossfilter(cdx);
    showCardsPerSet(ndx, cardData);
    showArtistsPerSet(ndx, cardData);
    showRarityPerSet(ndx, cardData);
    showAllTypes(cdx);
    showSupertypes(cdx)
    dc.renderAll();
}

function showCardsPerSet(ndx, cardData) {
    var dim = ndx.dimension(dc.pluck("code"));
    var group = dim.group().reduce(
        function add(p, v) {
            p.total++;
            p.cards += v.cards.length
            return p;
        },
        function remove(p, v) {
            p.total--;
            p.cards -= v.cards.length
            return p;
        },
        function initialise() {
            return { total: 0, cards: 0 };
        }
    );
    dc.barChart("#CardsPerSet")
        .valueAccessor(function(d) { return d.value.cards; })
        .keyAccessor(function(d) {
            return cardData.sets[d.key].name;
        })
        .margins({ top: 10, right: 50, bottom: 100, left: 30 })
        .height(300)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .dimension(dim)
        .group(group)
        .ordering(function(d) {
            var dateArray = cardData.sets[d.key].releaseDate.split("/");
            return parseInt(dateArray[2] + dateArray[0] + dateArray[1], 10);
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
    var artistStack = dc.barChart("#ArtistStack")
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
        .height(300)
        .margins({ top: 10, right: 10, bottom: 30, left: 140 })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend())
        .ordering(function(d) {
            var dateArray = cardData.sets[d.key].releaseDate.split("/");
            return parseInt(dateArray[2] + dateArray[0] + dateArray[1], 10);
        });
}

function showRarityPerSet(ndx, cardData) {
    var dim = ndx.dimension(dc.pluck("code"));
    var artistsGroup = dim.group().reduce(
        function add(p, v) {
            p.total++;
            v.cards.forEach(function(elem) {
                if (elem.rarity == "Common") {
                    p.common++;
                }
                else if (elem.rarity == "Uncommon") {
                    p.uncommon++;
                }
                else if (elem.rarity == "Rare") {
                    p.rare++;
                }
                else if (elem.rarity == "Rare Holo") {
                    p.rareHolo++;
                }
                else if (elem.rarity == "Rare Holo EX" || elem.rarity == "Rare Holo GX" || elem.rarity == "Rare Holo Lv.X") {
                    p.rareHoloX++;
                }
                else if (elem.rarity == "Rare Ultra") {
                    p.rareUltra++;
                }
                else if (elem.rarity == "Rare BREAK") {
                    p.rareBREAK++;
                }
                else if (elem.rarity == "Rare Prime") {
                    p.rarePrime++;
                }
                else if (elem.set.includes("Promo")) {
                    p.promo++;
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
                if (elem.rarity == "Common") {
                    p.common--;
                }
                else if (elem.rarity == "Uncommon") {
                    p.uncommon--;
                }
                else if (elem.rarity == "Rare") {
                    p.rare--;
                }
                else if (elem.rarity == "Rare Holo") {
                    p.rareHolo--;
                }
                else if (elem.rarity == "Rare Holo EX" || elem.rarity == "Rare Holo GX" || elem.rarity == "Rare Holo Lv.X") {
                    p.rareHoloX--;
                }
                else if (elem.rarity == "Rare Ultra") {
                    p.rareUltra--;
                }
                else if (elem.rarity == "Rare BREAK") {
                    p.rareBREAK--;
                }
                else if (elem.rarity == "Rare Prime") {
                    p.rarePrime--;
                }
                else if (elem.set.includes("Promo")) {
                    p.promo--;
                }
                else {
                    p.other--;
                }
            });
            return p;
        },
        function initialise() {
            return { total: 0, common: 0, uncommon: 0, rare: 0, rareHolo: 0, rareHoloX: 0, rareUltra: 0, rareBREAK: 0, rarePrime: 0, promo: 0, other: 0 };
        }
    );
    dc.barChart("#RarityPie")
        .dimension(dim)
        .group(artistsGroup, "Common")
        .valueAccessor(function(d) { return d.value.common; })
        .keyAccessor(function(d) {
            return cardData.sets[d.key].name;
        })
        .stack(artistsGroup, "Uncommon", function(d) {
            return d.value.uncommon;
        })
        .stack(artistsGroup, "Rare", function(d) {
            return d.value.rare;
        })
        .stack(artistsGroup, "Rare Holo", function(d) {
            return d.value.rareHolo;
        })
        .stack(artistsGroup, "ex/Lv.X/EX/GX", function(d) {
            return d.value.rareHoloX;
        })
        .stack(artistsGroup, "Rare Ultra", function(d) {
            return d.value.rareUltra;
        })
        .stack(artistsGroup, "Rare BREAK", function(d) {
            return d.value.rareBREAK;
        })
        .stack(artistsGroup, "Rare Prime", function(d) {
            return d.value.rarePrime;
        })
        .stack(artistsGroup, "Promo", function(d) {
            return d.value.promo;
        })
        .stack(artistsGroup, "Other", function(d) {
            return d.value.other;
        })
        .height(300)
        .margins({ top: 10, right: 10, bottom: 30, left: 115 })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend())
        .ordering(function(d) {
            var dateArray = cardData.sets[d.key].releaseDate.split("/");
            return parseInt(dateArray[2] + dateArray[0] + dateArray[1], 10);
        });
}

function showAllTypes(cdx, cardData) {
    var typesDim = cdx.dimension(dc.pluck("types", function(d) {
        if (d === undefined) { return ["None"] }
        else if (d.length != 1) {
            return ["Dual"]
        }
        else {
            return d
        }
    }));
    var typesGroup = typesDim.group()
    var typeColors = d3.scaleOrdinal()
        .domain(["Grass", "Fire", "Water", "Lightning", "Fighting", "Psychic", "Colorless", "Darkness", "Metal", "Dragon", "Fairy", "Dual", "None"])
        .range(["#7DB808", "#E24242", "#5BC7E5", "#FAB536", "#FF501F", "#A65E9A", "#E5D6D0", "#2C2E2B", "#8A776E", "#C6A114", "#E03A83", "#4038F8", "#5f5f5f"])
    dc.pieChart("#CardTypes")
        .dimension(typesDim)
        .group(typesGroup)
        .height("300")
        .radius("100")
        .innerRadius("50")
        .colorAccessor(function(d) { return d.key[0]; })
        .colors(typeColors)
        .legend(dc.legend().horizontal(true).legendWidth("250"));
}

function showSupertypes(cdx, cardData) {
    var typesDim = cdx.dimension(dc.pluck("supertype"));
    var typesGroup = typesDim.group()
    dc.pieChart("#Supertypes")
        .dimension(typesDim)
        .group(typesGroup)
        .height("300")
        .radius("100")
        .innerRadius("50")
        .colors(d3.scaleOrdinal().range(['red', 'green', 'blue']))
        .legend(dc.legend().horizontal(true).legendWidth("250"));
}
