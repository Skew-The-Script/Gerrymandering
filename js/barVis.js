class BarVis {

    constructor(parentElement, data, actualNum) {
        this.parentElement = parentElement;
        this.data = data;
        this.rownums = [];
        this.displayData = null;
        this.actualNum = actualNum;
        this.initVis();
    }

    initVis() {
        let vis = this;

        //setup SVG
        vis.margin = {top: 20, right: 50, bottom: 20, left: 100};

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

        vis.svg.append("g")
            .attr("class", "x-axis axis");

        vis.x = d3.scaleLinear()
            .domain([0, 5])
            .range([0, vis.width]);

        vis.svg.append("line")
            .attr("x1", vis.x(vis.actualNum))
            .attr("y1", 0)
            .attr("x2", vis.x(vis.actualNum))
            .attr("y2", vis.height)
            .style("stroke-width", 5)
            .style("stroke", "red")
            .style("fill", "none");
        vis.svg.append("text")
            .attr("id", "actualNumLineText")
            .attr("x", vis.x(vis.actualNum))
            .attr("y", 0)
            .text("Actual")
            .style("stroke", "red");

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;
        vis.displayData = [0, 0, 0, 0, 0, 0];

        for (let i = 0; i < vis.data.length; i++){
            if (vis.rownums.includes(i)){
                vis.displayData[vis.data[i]] += 1;
            }
        }
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData)])
            .range([vis.height, 0]);

        var bars = vis.svg.selectAll(".bar")
            .data(vis.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition()
            .attr("x", function(d, i){return vis.x(i);})
            .attr("y", function(d, i){return vis.y(d);})
            .attr("width", 50)
            .attr("height", function(d, i){return vis.height - vis.y(d);});

        bars.exit().remove();

        var barLabels = vis.svg.selectAll(".bar-label")
            .data(vis.displayData);

        barLabels.enter().append("text")
            .attr("class", "bar-label")
            .merge(barLabels)
            .transition()
            .attr("x", function(d, i){return vis.x(i);})
            .attr("y", function(d, i){return vis.height + 20;})
            .text(function(d, i){return i;});

        barLabels.exit().remove();

        var barValues = vis.svg.selectAll(".bar-value")
            .data(vis.displayData);

        barValues.enter().append("text")
            .attr("class", "bar-value")
            .merge(barValues)
            .transition()
            .attr("x", function(d, i){return vis.x(i);})
            .attr("y", function(d, i){return vis.y(d) - 5;})
            .text(function(d, i){return d;});

        barValues.exit().remove();
    }

    addRowNums(rowNums){

        let vis = this;
        for (let i = 0; i < rowNums.length; i++){
            vis.rownums.push(rowNums[i]);
        }

        vis.wrangleData();
    }

    changeState(data, actualNum){
        let vis = this;

        vis.data = data;
        vis.actualNum = actualNum;
        vis.rownums = [];

        vis.svg.select("line").remove();
        vis.svg.select("#actualNumLineText").remove();

        vis.svg.append("line")
            .attr("x1", vis.x(vis.actualNum))
            .attr("y1", 0)
            .attr("x2", vis.x(vis.actualNum))
            .attr("y2", vis.height)
            .style("stroke-width", 5)
            .style("stroke", "red")
            .style("fill", "none");
        vis.svg.append("text")
            .attr("id", "actualNumLineText")
            .attr("x", vis.x(vis.actualNum))
            .attr("y", 0)
            .text("Actual")
            .style("stroke", "red");



        vis.wrangleData();
    }
}

