const dataUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Initial test to see if data loads correctly
d3.json(dataUrl).then(function(loadedData){
  console.log(loadedData);
});

function initialize() {
    let selectorOptions = d3.select('#selDataset');
    
    d3.json(dataUrl).then((loadedData) => {
        let subjectNames = loadedData.names;
        subjectNames.forEach((name) => {
            selectorOptions.append('option').text(name).property('value', name);
        });
        let initialSubject = subjectNames[0];
        displayInfo(initialSubject);
        displayBarChart(initialSubject);
        displayBubbleChart(initialSubject);
    });
};

initialize();

function displayInfo(subjectId) {
  d3.json(dataUrl).then((loadedData) => {
    let metaData = loadedData.metadata;
    let filteredArray = metaData.filter(record => record.id == subjectId);
    let resultData = filteredArray[0];
    let metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html("");
    Object.entries(resultData).forEach(([key, value]) => {
      metadataPanel.append("h5").text(`${key}: ${value}`);
    });
  });
};

function displayBarChart(subjectId) {
  d3.json(dataUrl).then((loadedData) => {
    let sampleData = loadedData.samples;
    let filteredSamples = sampleData.filter(sample => sample.id == subjectId);
    let resultSample = filteredSamples[0];
    let sampleValues = resultSample.sample_values.slice(0, 10).reverse();
    let otuIds = resultSample.otu_ids.map(otuId => `OTU ${otuId}`).slice(0, 10).reverse();
    let otuLabels = resultSample.otu_labels.slice(0, 10).reverse();
    
    let barTrace = {
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    Plotly.newPlot("bar", [barTrace]);
  })
};

function displayBubbleChart(subjectId) {
  d3.json(dataUrl).then((loadedData) => {
    let sampleData = loadedData.samples;
    let filteredSamples = sampleData.filter(sample => sample.id == subjectId);
    let resultSample = filteredSamples[0];
    let otuIds = resultSample.otu_ids;
    let otuLabels = resultSample.otu_labels;
    let sampleValues = resultSample.sample_values;
    
    let bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    Plotly.newPlot("bubble", [bubbleTrace]);
  });
};