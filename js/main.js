let myBarGraph;

// let simData;

let currentState = "Oklahoma";
let numStates = 2;
let numSimulationsPerState = 5000;
// let gifTime = 1000;
let brrAnimationTimeMS = 200;
let simResults = []
let states = [
    // 'Alabama',
    // 'Alaska',
    // 'Arizona',
    // 'Arkansas',
    // 'California',
    // 'Colorado',
    // 'Connecticut',
    // 'Delaware',
    // 'Florida',
    // 'Georgia',
    // 'Hawaii',
    // 'Idaho',
    // 'Indiana',
    // 'Illinois',
    // 'Iowa',
    // 'Kansas',
    // 'Kentucky',
    // 'Louisiana',
    // 'Maine',
    // 'Maryland',
    // 'Massachusetts',
    // 'Michigan',
    // 'Minnesota',
    // 'Mississippi',
    // 'Missouri',
    // 'Montana',
    // 'Nebraska',
    // 'New Hampshire',
    // 'New Jersey',
    // 'New Mexico',
    // 'New York',
    // 'Nevada',
    // 'North Carolina',
    // 'North Dakota',
    // 'Ohio',
    'Oklahoma',
    'Oregon',
    // 'Pennsylvania',
    // 'Rhode Island',
    // 'South Carolina',
    // 'South Dakota',
    // 'Tennessee',
    // 'Texas',
    // 'Utah',
    // 'Vermont',
    // 'Virginia',
    // 'Washington',
    // 'West Virginia',
    // 'Wisconsin',
    // 'Wyoming'
]

let numDistricts = [
    5, //oklahoma
    6 // oregon
]

let actualNums = [
    0, // oklahoma
    5 //oregon
]

// load data using promises
let promises = [
    d3.csv("data/OK_cd_2020_stats.csv", row =>processRow(row)),
    d3.csv("data/OR_cd_2020_stats.csv", row =>processRow(row))
];

function processRow(row){
    row.ndshare = +row.ndshare;
    let res ={'ndshare' : row.ndshare,
            'district' : row.district};
    return res;
}

Promise.all(promises)
    .then(function (data) {
        for (let j = 0; j < numStates; j++){
            let simRes = getNumDemDistricts(data[j], numDistricts[j]);
            console.log(simRes);
            simResults.push(simRes);
        }

        //first state results
        let simulationResults = simResults[states.indexOf(currentState)];
        let actualNum = actualNums[states.indexOf(currentState)];

        // initialize bar graph
        myBarGraph = new BarVis('barGraph', simulationResults, actualNum);
    })
    .catch(function (err) {
        console.log(err)
    });

function getNumDemDistricts(data, numDistricts){
    let newData = [];
    let x = 0;
    // console.log("YALL");
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
        if ((i%numDistricts == 0) && (i != 0)){
            newData.push(x);
            x = 0;
        }
        else{
            if (data[i].ndshare > 0.5){
                x += 1;
            }
        }
    }
    return newData;
}

function updateState(){
    var select = document.getElementById('statesDropdown');
    currentState = select.options[select.selectedIndex].text;
    console.log("new state " + currentState);
    let simulationResults = simResults[states.indexOf(currentState)];
    let actualNum = actualNums[states.indexOf(currentState)];


    myBarGraph.changeState(simulationResults, actualNum);
}


$('.add-samples-1').on('click',function(){addSamples(1);});
$('.add-samples-3').on('click',function(){addSamples(3);});
$('.add-samples-10').on('click',function(){addSamples(10);});
$('.add-samples-30').on('click',function(){addSamples(30);});
$('.add-samples-100').on('click',function(){addSamples(100);});
$('.statesDropdown').on('change',function(){updateState();});

function addSamples(n){
    var element = document.getElementById("brr");
    element.style.display = "block";
    finishAddingSamples(n);
}

function finishAddingSamples(n){
    for (let i = 0; i < n; i++){
        delay((i+1) * brrAnimationTimeMS).then(() => myBarGraph.addRowNums(getRandomInts(1, 0, numSimulationsPerState)));
    }
    delay(n*brrAnimationTimeMS).then(() => {
        var element = document.getElementById("brr");
        element.style.display = "none";
    })
}


function getRandomInts(numInts, min, max){
    let res = [];
    for (let i = 0; i < numInts; i++){
        res.push(getRandomInt(min, max));
    }
    return res;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
