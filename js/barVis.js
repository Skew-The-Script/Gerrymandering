class BarVis {

    constructor(parentElement, data, numDistricts, actualNumDem) {
        this.parentElement = parentElement;
        this.data = data;
        this.rownums = [];
        this.displayData = null;
        this.numDistricts = numDistricts;
        this.actualNumDem = actualNumDem;
        this.newState = true;
        this.initVis();
    }

    initVis() {
        let vis = this;

        //setup SVG
        vis.margin = {top: 30, right: 50, bottom: 45, left: 50};

        //jquery
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement)
            .append("div")
            .attr("class", "barchart")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr(
                'viewBox',
                '0 0 ' +
                (vis.width + vis.margin.left + vis.margin.right) +
                ' ' +
                (vis.height + vis.margin.top + vis.margin.bottom)
            )
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.svg.append("text")
            .style("font-size", "15px")
            .attr("y", -30)
            .attr("x", -165)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("# of Simulations (Maps)");

        vis.svg.append("text")
            .style("font-size", "15px")
            .attr("y", 25)
            .attr("x", vis.width / 3)
            .attr("dy", "1.1em")
            .attr("transform", "translate(0,"+vis.height+")")
            .text("Number of Democrat-Leaning Districts (within each map)");

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // for a state with n districts, our bar graph will have n-1 bars
        vis.displayData = [];
        for (let i = 0; i < vis.numDistricts + 1; i++){
            vis.displayData.push(0);
        }

        // add rows from the data to the histogram
        for (let j = 0; j < vis.rownums.length; j++){
            vis.displayData[vis.data[vis.rownums[j]]] += 1;
        }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.select("#barGraphXAxis").remove();
        vis.svg.select("#barGraphYAxis").remove();

        vis.x = d3.scaleLinear()
            .domain([0, vis.numDistricts])
            .range([30, vis.width - 30]);

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData)])
            .range([vis.height, 0]);

        vis.x_axis = d3.axisBottom()
            .scale(vis.x)
            .ticks(d3.min([25, vis.numDistricts + 1]))
            .tickFormat(d3.format("d"));

        vis.y_axis = d3.axisLeft()
            .scale(vis.y)
            .ticks(d3.min([10, d3.max(vis.displayData)]))
            .tickFormat(d3.format("d"));

        vis.svg.append("g")
            .attr("id", "barGraphXAxis")
            .attr("transform", "translate(0," + vis.height+")")
            .call(vis.x_axis);

        vis.svg.append("g")
            .attr("id", "barGraphYAxis")
            .attr("transform", "translate(10, 0)")
            .call(vis.y_axis);

        var bars = vis.svg.selectAll(".bar")
            .data(vis.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition()
            .attr("x", function(d, i){
                let _x = vis.x(i) - Math.sqrt(vis.width/(vis.numDistricts - 1));
                return _x;
            })
            .attr("y", function(d, i){return vis.y(d);})
            .attr("width", 2*Math.sqrt(vis.width/(vis.numDistricts - 1)))
            .attr("height", function(d, i){
                if (vis.newState){
                    return 0;
                }
                else{
                    return vis.height - vis.y(d);
                }
            });

        bars.exit().remove();

        var barValues = vis.svg.selectAll(".bar-value")
            .data(vis.displayData);

        barValues.enter().append("text")
            .attr("class", "bar-value")
            .merge(barValues)
            .transition()
            .attr("x", function(d, i){return vis.x(i) + Math.sqrt(vis.width/(vis.numDistricts - 1)) + 3;})
            .attr("y", function(d, i){return vis.y(d) + 10;})
            .attr("fill", "#006fff")
            .text(function(d, i){
                if (d > 0){ return d;}
                else{ return "";}
            });

        barValues.exit().remove();

        vis.updateActualNumLine();
    }

    addRowNum(rowNum){
        let vis = this;
        vis.newState = false;
        vis.rownums.push(rowNum);
        vis.wrangleData();
    }

    changeState(data, numDistricts, actualNumDem){
        let vis = this;
        vis.newState = true;
        vis.data = data;
        vis.numDistricts = numDistricts;
        vis.actualNumDem = actualNumDem;
        vis.rownums = [];
        vis.wrangleData();
    }

    updateActualNumLine(){
        let vis = this;
        vis.svg.select("#actualNumLine").remove();
        vis.svg.select("#actualNumLineText").remove();
        let xval = vis.x(vis.actualNumDem);

        ////////////////////////////
        // place vertical line showing actual # of dem districts
        vis.svg.append("line")
            .attr("id", "actualNumLine")
            .attr("x1", xval)
            .attr("y1", -5)
            .attr("x2", xval)
            .attr("y2", vis.height)
            .style("stroke-width", 2)
            .style("stroke", "red")
            .style("fill", "none");
        vis.svg.append("text")
            .attr("id", "actualNumLineText")
            .attr("transform", "rotate(-90)")
            .attr("x", -45)
            .attr("y", xval)
            .text("Actual")
            .style("stroke", "red");
        ////////////////////////////
    }
}

