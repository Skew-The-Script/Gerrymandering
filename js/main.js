let myBarGraph = null;
let currentState;
let currentAbbr;
let currentSimResults;
let stateInfo = [
    {   'name' : 'Alabama',
        'abbr' : 'AL'
    },
    {   'name' : 'Arizona',
        'abbr' : 'AZ'
    },
    {   'name' : 'Arkansas',
        'abbr' : 'AR'
    },
    {   'name': 'California',
        'abbr' : 'CA'
    },
    {   'name' : 'Colorado',
        'abbr' : 'CO'
    },
    {   'name' : 'Connecticut',
        'abbr' : 'CT'
    },
    {   'name' : 'Florida',
        'abbr' : 'FL'
    },
    {   'name' : 'Georgia',
        'abbr' : 'GA'
    },
    {   'name' : 'Hawaii',
        'abbr' : 'HI'
    },
    {   'name' : 'Idaho',
        'abbr' : 'ID'
    },
    {   'name' : 'Illinois',
        'abbr' : 'IL'
    },
    {   'name' : 'Indiana',
        'abbr' : 'IN'
    },
    {   'name' : 'Iowa',
        'abbr' : 'IA'
    },
    {   'name' : 'Kansas',
        'abbr' : 'KS'
    },
    {   'name' : 'Kentucky',
        'abbr' : 'KY'
    },
    {   'name' : 'Louisiana',
        'abbr' : 'LA'
    },
    {   'name' : 'Maine',
        'abbr' : 'ME'
    },
    {   'name' : 'Maryland',
        'abbr' : 'MD'
    },
    {   'name' : 'Massachusetts',
        'abbr' : 'MA'
    },
    {   'name' : 'Michigan',
        'abbr' : 'MI'
    },
    {   'name' : 'Minnesota',
        'abbr' : 'MN'
    },
    {   'name' : 'Mississippi',
        'abbr' : 'MS'
    },
    {   'name' : 'Missouri',
        'abbr' : 'MO'
    },
    {   'name' : 'Montana',
        'abbr' : 'MT'
    },
    {   'name' : 'Nebraska',
        'abbr' : 'NE'
    },
    {   'name' : 'Nevada',
        'abbr' : 'NV'
    },
    {   'name' : 'New Hampshire',
        'abbr' : 'NH'
    },
    {   'name' : 'New Jersey',
        'abbr' : 'NJ'
    },
    {   'name' : 'New Mexico',
        'abbr' : 'NM'
    },
    {   'name' : 'New York',
        'abbr' : 'NY'
    },
    {   'name' : 'North Carolina',
        'abbr' : 'NC'
    },
    {   'name' : 'Ohio',
        'abbr' : 'OH'
    },
    {   'name' : 'Oklahoma',
        'abbr' : 'OK'
    },
    {   'name' : 'Oregon',
        'abbr' : 'OR'
    },
    {   'name' : 'Pennsylvania',
        'abbr' : 'PA'
    },
    {   'name' : 'Rhode Island',
        'abbr' : 'RI'
    },
    {   'name' : 'South Carolina',
        'abbr' : 'SC'
    },
    {   'name' : 'Tennessee',
        'abbr' : 'TN'
    },
    {   'name' : 'Texas',
        'abbr' : 'TX'
    },
    {   'name' : 'Utah',
        'abbr' : 'UT'
    },
    {   'name' : 'Virginia',
        'abbr' : 'VA'
    },
    {   'name' : 'Washington',
        'abbr' : 'WA'
    },
    {   'name' : 'West Virginia',
        'abbr' : 'WV'
    },
    {   'name' : 'Wisconsin',
        'abbr' : 'WI'
    }
];

//////////////////////////////////////////////////////////////////
// access html elements

// image and gif elements (to reset the image/gif source)
let map1element = document.getElementById("map1");
let map2element = document.getElementById("map2");
let map3element = document.getElementById("map3");
let mapEnactedelement = document.getElementById("mapEnacted");

// text element (change the text depending on the simulation run)
let simMapLabel = document.getElementById("simMapLabel");
let sim1MapLabel = document.getElementById("simMap1Label");
let sim2MapLabel = document.getElementById("simMap2Label");
let sim3MapLabel = document.getElementById("simMap3Label");
let mapEnactedLabel = document.getElementById("mapEnactedlabel");
let mapEnactedNumDist = document.getElementById("mapEnactedNumDist");

// div elements (to turn the html block on/off in the doctree)
let loadingColelement = document.getElementById("loadingCol");
let map1colelement = document.getElementById("map1col");
let map2colelement = document.getElementById("map2col");
let map3colelement = document.getElementById("map3col");
let stateDropdownSelect = document.getElementById('statesDropdown');
let simButtons = document.getElementById('simButtons');

//////////////////////////////////////////////////////////////////
// process data

function processRow(row){
    row.ndshare = +row.ndshare;
    let res = {
        'draw' : row.draw,
        'ndshare' : row.ndshare,
        'district' : row.district};
    return res;
}

function getNumDemDistricts(stateIndex, data){
    let newData = [];
    let x = 0;
    let _numDistricts = 0;
    let _numDemDistricts = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].draw == 'cd_2020'){
            _numDistricts++;
            if (data[i].ndshare > 0.5){
                _numDemDistricts++;
            }
        }
        else{
            if (data[i].ndshare > 0.5){
                x += 1;
            }
            if (i%_numDistricts == _numDistricts - 1){
                newData.push(x);
                x = 0;
            }
        }
    }
    stateInfo[stateIndex]['nDist'] = _numDistricts;
    stateInfo[stateIndex]['nDem'] = _numDemDistricts;
    return newData;
}

function updateState(){

    loadingColelement.style.display = "block";

    // get state from dropdown
    currentState = stateDropdownSelect.options[stateDropdownSelect.selectedIndex].text;

    if (currentState != ""){

        let j = stateDropdownSelect.selectedIndex - 1;
        let abbr = stateInfo[j]['abbr'];
        let promises = [];
        promises.push(d3.csv("data/"+abbr+"_cd_2020_stats.csv", row =>processRow(row)));

        Promise.all(promises)
            .then(function (data) {
                let j = stateDropdownSelect.selectedIndex - 1;
                let simulationResults = getNumDemDistricts(j, data[0]);
                currentSimResults = simulationResults;
                if (myBarGraph == null){
                    let numDistricts = stateInfo[j]['nDist'];
                    let actualNum = stateInfo[j]['nDem'];
                    myBarGraph = new BarVis('barGraph', simulationResults, numDistricts, actualNum);
                }
                finishUpdateState(simulationResults);
            });
    }
}

$('.change-state').on('click',function(){changeState();});
function changeState(){
    fullpage_api.moveSectionUp();
}

function finishUpdateState(simulationResults){
    fullpage_api.moveSectionDown();

    // set simulation maps blank
    map1colelement.style.display = "none";
    map2colelement.style.display = "none";
    map3colelement.style.display = "none";
    simMapLabel.innerText = "";
    sim1MapLabel.innerText = "";
    sim2MapLabel.innerText = "";
    sim3MapLabel.innerText = "";

    mapEnactedLabel.innerText = "Actual " + currentState + " Map";
    let stateIndex = stateDropdownSelect.selectedIndex - 1;
    // get state abbreviation
    currentAbbr = stateInfo[stateIndex]['abbr'];

    // load enacted congressional map
    mapEnactedelement.src = "maps/"+currentAbbr+"_enacted.png";

    // reset bar graph
    let numDistricts = stateInfo[stateIndex]['nDist'];
    let actualNum = stateInfo[stateIndex]['nDem'];

    mapEnactedNumDist.innerHTML = "Total districts: " + numDistricts.toString().bold() + " &nbsp; | &nbsp; Democrat-leaning districts: " + actualNum.toString().bold();

    myBarGraph.changeState(simulationResults, numDistricts, actualNum);

    loadingColelement.style.display = "none";
    simButtons.style.display = "block";
}


////////////////////////////////////////////////////////////////
// respond to simulation buttons

$('.add-samples-1').on('click',function(){beginAddingSamples(1);});
$('.add-samples-3').on('click',function(){beginAddingSamples(3);});
$('.add-samples-10').on('click',function(){beginAddingSamples(10);});
$('.add-samples-30').on('click',function(){beginAddingSamples(30);});
$('.add-samples-100').on('click',function(){beginAddingSamples(100);});
$('.statesDropdown').on('change',function(){updateState();});

function beginAddingSamples(n){

    simMapLabel.innerText = "";
    sim1MapLabel.innerText = "";
    sim2MapLabel.innerText = "";
    sim3MapLabel.innerText = "";

    map1colelement.style.display = "block";
    map2colelement.style.display = "block";
    map3colelement.style.display = "block";
    map1element.src = "img/blank.png";
    map3element.src = "img/blank.png";

    // set proper gif using current state and # samples being added
    let animTime = 0;
    if (n == 1){
        map2element.src = "gifs/running_sim_text_slow.gif";
        animTime = 1000;
    }
    else if (n == 3){
        map2element.src = "gifs/running_sim_text_fast.gif";
        animTime = 500;
    }
    else if (n == 10){
        map2element.src = "gifs/"+currentAbbr+"_slow.gif";
        animTime = 300;
    }
    else if (n == 30){
        map2element.src = "gifs/"+currentAbbr+"_medium.gif";
        animTime = 100;
    }
    else if (n == 100){
        map2element.src = "gifs/"+currentAbbr+"_fast.gif";
        animTime = 50;
    }
    finishAddingSamples(n, animTime);
}

function finishAddingSamples(n, animTime){
    let validMapRandomInts = [];

    // add random samples from dataset
    for (let i = 0; i < n; i++){
        let rand = 0;

        // sample at most three from the simulations with a map
        if (n - i <= 3){
            rand = getRandomInt(0, 299);
            validMapRandomInts.push(rand);
        }

        // sample the rest (if applicable) from the simulations without a map
        else{
            rand = getRandomInt(300, 4999);
        }

        // add each sample to the bar graph
        delay((i+1) * animTime).then(() => myBarGraph.addRowNum(rand));

        // display maps one at a time if adding n=3 samples
        if (n == 3){
            if (i == 0){
                delay((i+1) * animTime).then(() => {
                    map1element.src = "maps/" + currentAbbr + "_draw_"+(rand+2).toString()+".png";
                    map1colelement.style.display = "block";
                    sim1MapLabel.innerText = "# Dem Districts: " + currentSimResults[rand];
                });
            }
            else if (i == 1){
                delay((i+1) * animTime).then(() => {
                    map2colelement.style.display = "none";
                    map2element.src = "maps/" + currentAbbr + "_draw_"+(rand+2).toString()+".png";
                    map2colelement.style.display = "block";
                    sim2MapLabel.innerText = "# Dem Districts: " + currentSimResults[rand];
                });
            }
            else if (i == 2){
                delay((i+1) * animTime).then(() => {
                    map3colelement.style.display = "block";
                    map3element.src = "maps/" + currentAbbr + "_draw_"+(rand+2).toString()+".png";
                    sim3MapLabel.innerText = "# Dem Districts: " + currentSimResults[rand];
                });
            }
        }
    }

    // render maps
    delay(n*animTime).then(() => {

        if (n == 1){
            // display single simulated map
            map2element.src = "maps/" + currentAbbr + "_draw_"+(validMapRandomInts[0]+2).toString()+".png";
            sim2MapLabel.innerText = "# Dem Districts: " + currentSimResults[validMapRandomInts[0]];
            simMapLabel.innerText = "Simulated Map";
        }
        else if (n == 3){
            map1colelement.style.display = "block";
            map3colelement.style.display = "block";
            simMapLabel.innerText = "Simulated Maps";
        }
        else if (n > 3){
            // display three simulated maps
            map1element.src = "maps/" + currentAbbr + "_draw_"+(validMapRandomInts[0]+2).toString()+".png";
            map2element.src = "maps/" + currentAbbr + "_draw_"+(validMapRandomInts[1]+2).toString()+".png";
            map3element.src = "maps/" + currentAbbr + "_draw_"+(validMapRandomInts[2]+2).toString()+".png";

            sim1MapLabel.innerText = "# Dem Districts: " + currentSimResults[validMapRandomInts[0]];
            sim2MapLabel.innerText = "# Dem Districts: " + currentSimResults[validMapRandomInts[1]];
            sim3MapLabel.innerText = "# Dem Districts: " + currentSimResults[validMapRandomInts[2]];

            map1colelement.style.display = "block";
            map3colelement.style.display = "block";
            simMapLabel.innerText = "Last 3 Simulated Maps";
        }
    });
}

///////////////////////////////////////////////
// helper functions

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
