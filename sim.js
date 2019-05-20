(function()  {
    
    var width = 1500;
    var height = 800;
    //Create the SVG
    var svg = d3.select("#viz")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")
    
    
    
    //Set a range of circle sizes based on the smallest and largest values from data
    var radiusScale = d3.scaleSqrt().domain([3, 14]).range([25, 75])
    
    //All authors with 5+ should seperate
    var XAxisMoveFive = d3.forceX(function(d) {
        if (d.Range === '5+'){
            return 200
        } else {
            return 1200
        }}).strength(0.2)
    
    //All authors with 10+ should seperate
    var XAxisMoveTen = d3.forceX(function(d) {
        if (d.Range === '10+') {
            return 200
        } else {
            return 1200
        }
        }).strength(0.1)
    
    //Authors with 1 - 3 contributions should seperate
    var XAxisMoveThree = d3.forceX(function(d) {
        if (d.Range === '1+') {
            return 200
        } else {
            return 1200
        }
        }).strength(0.5)
    
    
    //Start Position 
    var XAxisCombine = d3.forceX(width /2).strength(0.05)                    
    
    //Create Spacing Between Nodes
    var Collide = d3.forceCollide(function(d) {
        return radiusScale(d.Contributions) + 1
    })
    
    
    //Create the Simulation
    var simulation = d3.forceSimulation()
        .force("xAxis", XAxisCombine)
        .force("yAxis", d3.forceY(height / 2).strength(0.05))
        .force("collide", Collide)
    
    
    //Read our Data in
    d3.queue()
        .defer(d3.csv, "authors.csv")
        .await(ready)
    
    //Draw circle for each datapoint
    function ready (error, datapoints) {
        var circles = svg.selectAll(".Name")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "Name")
        //use function to create different sized nodes
            .attr("r", function(d) {
                return radiusScale(d.Contributions)
            })
            .attr("fill", "lightblue")
            .on('click', function(d) {
                console.log(d)
            })
        //Add labels to circles
        var labels = svg.selectAll(".author-label")
            .data(datapoints)
            .enter().append("text")
            .attr("class", "author-label")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "3px")
            .attr("font-family", "Courier New")
            .text(function(d) {
                return d.Name;
            })
        
        
        //Event Listners then execute each function
        d3.select("#plusFive").on('click', function() {
            simulation.force("xAxis", XAxisMoveFive)
            .alphaTarget(0.2)
            .restart()
        })
        
         d3.select("#plusTen").on('click', function() {
            simulation.force("xAxis", XAxisMoveTen)
            .alphaTarget(0.1)
            .restart()
        })
        
         d3.select("#plusThree").on('click', function() {
            simulation.force("xAxis", XAxisMoveThree)
            .alphaTarget(0.5)
            .restart()
        })
        
        //When button is clicked move back to the middle
        d3.select("#All").on('click', function() {
            simulation.force('xAxis', XAxisCombine)
        //So nodes don't lose force
            .alphaTarget(0.2)
            .restart()
        })
        
          
      //Feed our data to simulation  
        simulation.nodes(datapoints)
            .on('tick', ticked)
        
        //Set postion of nodes during simulation
        function ticked() {
            circles
                .attr("cx", function(d) {
                return d.x
            })
                .attr("cy", function(d){
                return d.y
            })
        
            labels
                .attr("x", function(d) {
                return d.x;
            })
                .attr("y", function(d) {
                return d.y;
            })
        
        }
    }
    
    
})();