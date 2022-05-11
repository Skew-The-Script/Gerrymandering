let myBarGraph;
let currentState;
let currentAbbr;
let simResults = [];
let stateInfo = [
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
    {   'name' : 'Montana',
        'abbr' : 'MT'
    },
    {   'name' : 'Nebraska',
        'abbr' : 'NE'
    },
    {   'name' : 'Nevada',
        'abbr' : 'NV'
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
let numStates = stateInfo.length;

// DOCTREE ELEMENTS
// image and gif elements (to reset the image/gif source)
let brrelement = document.getElementById("brr");
let map1element = document.getElementById("map1");
let map2element = document.getElementById("map2");
let map3element = document.getElementById("map3");
let mapEnactedelement = document.getElementById("mapEnacted");

// text element (change the text depending on the simulation run)
let simMapLabel = document.getElementById("simMapLabel");
let mapEnactedLabel = document.getElementById("mapEnactedlabel");

// div elements (to turn the html block on/off in the doctree)
let stateMapelement = document.getElementById("stateMap");
let map1colelement = document.getElementById("map1col");
let map2colelement = document.getElementById("map2col");
let map3colelement = document.getElementById("map3col");
let mapEnactedcolelement = document.getElementById("mapEnactedcol");
let mapEnactedcollabelelement = document.getElementById("mapEnactedCollabel");
let stateDropdownSelect = document.getElementById('statesDropdown');
let dropdownLabel = document.getElementById("statesDropdownLabel");
let simButtons = document.getElementById("simButtons");
let barGraphXLabelCol = document.getElementById("barGraphXLabelCol");
let citationElement = document.getElementById("citingAlarm");

//////////////////////////////////////////////////////////////////
// process data
let promises = [];
for (let i = 0; i < numStates; i++){
    let abbr = stateInfo[i]['abbr'];
    promises.push(d3.csv("data/"+abbr+"_cd_2020_stats.csv", row =>processRow(row)));
}

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
            if (i%_numDistricts == 0){
                newData.push(x);
                x = 0;
            }
        }
    }
    stateInfo[stateIndex]['nDist'] = _numDistricts;
    stateInfo[stateIndex]['nDem'] = _numDemDistricts;
    return newData;
}

Promise.all(promises)
    .then(function (data) {
        for (let j = 0; j < numStates; j++){
            let simRes = getNumDemDistricts(j, data[j]);
            simResults.push(simRes);
        }

        //first state results
        let simulationResults = simResults[0];
        let numDistricts = stateInfo[0]['nDist'];
        let actualNum = stateInfo[0]['nDem'];
        currentState = stateInfo[0]['name'];
        currentAbbr = stateInfo[0]['abbr'];

        // initialize bar graph
        myBarGraph = new BarVis('barGraph', simulationResults, numDistricts, actualNum);

        // reset images and labels
        brrelement.src = "img/blank.png";
        simMapLabel.innerText = "";
        mapEnactedLabel.innerText = "Actual " + currentState + " Map";
        // barGraphXLabelCol.innerText = "Number of Democrat-Leaning Districts (within each map)";

        // activate UI elements for maps, dropdown menu, and simulation buttons
        // they start out deactivated while the data is loading
        stateMapelement.style.display = "block";
        map1colelement.style.display = "block";
        map2colelement.style.display = "block";
        map3colelement.style.display = "block";
        mapEnactedcolelement.style.display = "block";
        mapEnactedcollabelelement.style.display = "block";
        stateDropdownSelect.style.display = "block";
        dropdownLabel.style.display = "block";
        simButtons.style.display = "block";
        citationElement.style.display = "block";
    })
    .catch(function (err) {
        console.log(err)
    });

////////////////////////////////////////////////////////////////
// respond to state dropdown menu
function getStateIndex(state){
    for (let i = 0; i < numStates; i++){
        if (stateInfo[i]['name'] == state){ return i; }
    }
    return -1;
}

function updateState(){
    // set simulation maps blank
    brrelement.src = "img/blank.png";
    map1element.src = "img/blank.png";
    map2element.src = "img/blank.png";
    map3element.src = "img/blank.png";
    simMapLabel.innerText = "";

    // get state from dropdown
    currentState = stateDropdownSelect.options[stateDropdownSelect.selectedIndex].text;
    mapEnactedLabel.innerText = "Actual " + currentState + " Map";
    let stateIndex = getStateIndex(currentState);
    // get state abbreviation
    currentAbbr = stateInfo[stateIndex]['abbr'];

    // load enacted congressional map
    mapEnactedelement.src = "maps/"+currentAbbr+"_enacted.png";

    // reset bar graph
    let simulationResults = simResults[stateIndex];
    let numDistricts = stateInfo[stateIndex]['nDist'];
    let actualNum = stateInfo[stateIndex]['nDem'];
    myBarGraph.changeState(simulationResults, numDistricts, actualNum);
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
    window.scrollTo(0,document.body.scrollHeight / 4);
    // activate middle html element
    simMapLabel.innerText = "";
    map2colelement.style.display = "block";

    // hide three sample maps and enacted map
    map1element.src = "img/blank.png";
    map2element.src = "img/blank.png";
    map3element.src = "img/blank.png";

    // set proper gif using current state and # samples being added
    let animTime = 0;
    if (n == 1){
        brrelement.src = "gifs/running_sim_text_slow.gif";
        brrelement.width = 300;
        brrelement.height = 100;
        animTime = 1000;
    }
    else if (n == 3){
        brrelement.src = "gifs/running_sim_text_fast.gif";
        brrelement.width = 300;
        brrelement.height = 100;
        animTime = 500;
    }
    else if (n == 10){
        brrelement.src = "gifs/"+currentAbbr+"_slow.gif";
        brrelement.width = 150;
        brrelement.height = 150;
        animTime = 300;
    }
    else if (n == 30){
        brrelement.src = "gifs/"+currentAbbr+"_medium.gif";
        brrelement.width = 150;
        brrelement.height = 150;
        animTime = 100;
    }
    else if (n == 100){
        brrelement.src = "gifs/"+currentAbbr+"_fast.gif";
        brrelement.width = 150;
        brrelement.height = 150;
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
        delay((i+1) * animTime).then(() => myBarGraph.addRowNums([rand]));

        // display maps one at a time if adding n=3 samples
        if (n == 3){
            if (i == 0){
                delay((i+1) * animTime).then(() => {
                    map1element.src = "maps/" + currentAbbr + "_draw_"+rand.toString()+".png";
                });
            }
            else if (i == 1){
                delay((i+1) * animTime).then(() => {
                    map2element.src = "maps/" + currentAbbr + "_draw_"+rand.toString()+".png";
                });
            }
            else if (i == 2){
                delay((i+1) * animTime).then(() => {
                    map3element.src = "maps/" + currentAbbr + "_draw_"+rand.toString()+".png";
                });
            }
        }
    }

    // render maps
    delay(n*animTime).then(() => {

        // hide brr gif
        brrelement.src = "img/blank.png";

        // display enacted map
        mapEnactedelement.src = "maps/" + currentAbbr + "_enacted.png"

        if (n == 1){
            // display single simulated map
            map1element.src = "img/blank.png";
            map2element.src = "maps/" + currentAbbr + "_draw_"+validMapRandomInts[0].toString()+".png";
            map3element.src = "img/blank.png";
            simMapLabel.innerText = "Simulated Map";
        }
        else if (n == 3){
            simMapLabel.innerText = "Simulated Maps";
        }
        else if (n > 3){
            // display three simulated maps
            map1element.src = "maps/" + currentAbbr + "_draw_"+validMapRandomInts[0].toString()+".png";
            map2element.src = "maps/" + currentAbbr + "_draw_"+validMapRandomInts[1].toString()+".png";
            map3element.src = "maps/" + currentAbbr + "_draw_"+validMapRandomInts[2].toString()+".png";

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
