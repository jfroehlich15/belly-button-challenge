
// Using D3 library to read the given url 
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  
    // Accessing the data
  const samples = data.samples;
  const metadata = data.metadata;

  // Update data based on selected Subject ID
  function updateChart(selectedSubject) {
    
    // Filter the data
    const selectedData = samples.find(sample => sample.id === selectedSubject);

    // Extraction of data for OTUs
    const top10SampleValues = selectedData.sample_values.slice(0, 10);
    const top10OTUs = selectedData.otu_ids.slice(0, 10);
    const top10Labels = selectedData.otu_labels.slice(0, 10);

    // Creating the horizontal bar chart and layout
    const barTrace = {
      x: top10SampleValues.reverse(),
      y: top10OTUs.map(otu => `OTU ${otu}`).reverse(),
      text: top10Labels.reverse(),
      type: "bar",
      orientation: "h"
    };
    const barChartData = [barTrace];
    const barChartLayout = {
      title: "Top 10 OTUs in Selected Subject",
    };
    Plotly.newPlot("bar", barChartData, barChartLayout);

    // Creating the bubble chart and layout
    const bubbleTrace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: "markers",
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
      }
    };
    const bubbleChartData = [bubbleTrace];
    const bubbleChartLayout = {
      xaxis: {
        title: "OTU ID"
      }
    };
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

    // Demographic Info Side Panel
    displayDemo(selectedSubject);
  }
  
  // Obtain the demographic info for the individual
  function displayDemo(selectedSubject) {
    const selectedDemo = metadata.find(meta => meta.id === parseInt(selectedSubject));
    const metadataElement = d3.select("#sample-metadata");

    // Clear demographic info for when selection changes
    metadataElement.html("");

    // Appending keys and their values
    Object.entries(selectedDemo).forEach(([key, value]) => {
      metadataElement.append("p")
        .text(`${key}: ${value}`);
    });
  }

  // Dropdown Menu
  function optionChanged(value) {
    updateChart(value);
  }

  // Set dashboard to automatically start with first subject
  const initialSubject = samples[0].id;
  updateChart(initialSubject);

  // Populate Dropdown
  const dropdown = d3.select("#selDataset");
  dropdown.selectAll("option")
    .data(samples.map(sample => sample.id))
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);
  dropdown.on("change", function() {
    const selectedValue = d3.select(this).property("value");
    optionChanged(selectedValue);
  });
});