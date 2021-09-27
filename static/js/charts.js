function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;
  
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });

}



function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

   
  
    
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("data/samples.json").then((sData) => {
    // 3. Create a variable that holds the samples array. 
    var samples = sData.samples;   
  
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  
    //  5. Create a variable that holds the first sample in the array.
    var selectedResult = resultArray[0];
   

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_res = selectedResult.otu_ids;
    var otu_labels_res = selectedResult.otu_labels;
    var sample_values_res = selectedResult.sample_values;

    //3. Create a variable that holds the washing frequency.
    var metadata = sData.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wash_res = result.wfreq;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks_values = otu_ids_res.slice(0,10).reverse().map(id => "OTU " + id + " ");
 

    // 8. Create the trace for the bar chart. 
    var xticks_values = sample_values_res.slice(0,10).reverse();
    var barData = [{
      x: xticks_values,
      y: yticks_values,
      type: "bar",
      orientation: "h",
      text: otu_labels_res
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "<b>Top 10 Bacteria Samples for ID </b>" + "<b>" + sample + "</b>",
        xaxis: { title: "Samples" },
        yaxis: { title: "IDs"},
        plot_bgcolor: "lightgray",
        paper_bgcolor: "lightgray",
        // width: 440,
        padding: 0,          
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids_res,
      y: sample_values_res,
      text: otu_labels_res,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sample_values_res,
        color: otu_ids_res,
        colorscale: "Earth",
        line: {
          color: "black",
          width: 2
        }
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      height: 600,      
      plot_bgcolor: "lightgray",
      paper_bgcolor: "lightgray"
    
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 


    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash_res,        
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs per week"
            }, 
      gauge: 
        {axis: {range: [0, 10]},
      bar: {color: "black"},
      steps: [
        {range: [0, 2], color: "turquoise" },
        {range: [2, 4], color: "gold" },
        {range: [4, 6], color: "skyblue" },
        {range: [6, 8], color: "forestgreen" },
        {range: [8, 10], color: "crimson" }]
        }
    }];


    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
    width: 485,
    height: 450,    
    plot_bgcolor: "lightgray",
    paper_bgcolor: "lightgray",
    margin: {l: 30, r: 30},
    padding: 0,
    autosize: "No",
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


 
  });
} // end buildCharts

// Initialize the dashboard
init();




