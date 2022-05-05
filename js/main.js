let myBarGraph;

let simData;

let currentState = "Oregon";

// load data using promises
let promises = [
    d3.csv("data/OR_cd_2020_stats.csv", row =>{
        row.ndshare = +row.ndshare;
        return {
            'ndshare' : row.ndshare,
            'district' : row.district};
    })
];

function getNumDemDistricts(data){
    let newData = [];
    let x = 0;
    for (let i = 0; i < data.length; i++) {
        if ((i%6 == 0) && (i != 0)){
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

Promise.all(promises)
    .then(function (data) {
        let simRes = getNumDemDistricts(data[0]);
        simData = simRes;
        // console.log('check out the sim results', simRes);
        plotBarVis(simRes);
    })
    .catch(function (err) {
        console.log(err)
    });

function plotBarVis(simulationResults) {

    // log data
    myBarGraph = new BarVis('barGraph', simulationResults, 5);
}

$('.add-samples-1').on('click',function(){
    addSamples(1);
    // myBarGraph.addRowNums([getRandomInt(0, simData.length)]);
});

$('.add-samples-3').on('click',function(){
    addSamples(3);
    // myBarGraph.addRowNums(getRandomInts(3, 0, simData.length));
});

$('.add-samples-10').on('click',function(){
    addSamples(10);
    // myBarGraph.addRowNums(getRandomInts(10, 0, simData.length));
});

$('.add-samples-30').on('click',function(){
    addSamples(30);
    // myBarGraph.addRowNums(getRandomInts(30, 0, simData.length));
});

$('.add-samples-100').on('click',function(){
    addSamples(100);
    // myBarGraph.addRowNums(getRandomInts(100, 0, simData.length));
});

function addSamples(n){

    var element = document.getElementById("brr");
    element.style.display = "block";
    delay(1000).then(() => finishAddingSamples(n));

}

function finishAddingSamples(n){
    var element = document.getElementById("brr");
    element.style.display = "none";
    myBarGraph.addRowNums(getRandomInts(n, 0, simData.length));
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
