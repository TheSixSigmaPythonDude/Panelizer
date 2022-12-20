// (1) These four functions calculate the strips per panel in four orientations and setups
function panel_configuration() {
    val = document.getElementById('vendor').value
    if (val=='0'){
        wpw = 546.1
        wpl = 622.3
        strip_to_edge_width = 16.5
        strip_to_edge_length = 18
        strip_to_strip_coupon = 10.16
        strip_to_strip_min = 1.27
    } else if (val=='1'){
        wpw = 541.02
        wpl = 615.95
        strip_to_edge_width = 16
        strip_to_edge_length = 18
        strip_to_strip_coupon = 8
        strip_to_strip_min = 1
    } else if (val=='2'){
        wpw = 553.72
        wpl = 622.3
        strip_to_edge_width = 17.78
        strip_to_edge_length = 16.51
        strip_to_strip_coupon = 10.9
        strip_to_strip_min = 1
    } else if (val=='3'){
        wpw = 546
        wpl = 622
        strip_to_edge_width = 18
        strip_to_edge_length = 23
        strip_to_strip_coupon = 8.5
        strip_to_strip_min = 1.2
    } else if (val=='4'){
        wpw = 541.02
        wpl = 617.22
        strip_to_edge_width = 15.5
        strip_to_edge_length = 19
        strip_to_strip_coupon = 6.452
        strip_to_strip_min = 1.2
    }
    return [wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min]
};

function x_impedance_0degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width - strip_to_strip_coupon + 2*1.2) / (panel_x + 1.2));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length + 1.2) / (panel_y + 1.2));
    return ['X impedance - 0 degrees',boards_in_x * boards_in_y];
};

function y_impedance_0degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width + strip_to_strip_min) / (panel_x + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_y + strip_to_strip_min));
    return ['Y impedance - 0 degrees',boards_in_x * boards_in_y];
};

function x_impedance_90degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_y + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length + strip_to_strip_min) / (panel_x + strip_to_strip_min));
    return ['X impedance - 90 degrees',boards_in_x * boards_in_y];
};

function y_impedance_90degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width + strip_to_strip_min) / (panel_y + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_x + strip_to_strip_min));
    return ['Y impedance - 90 degrees',boards_in_x * boards_in_y];
};

// (2) This function finds the best of the four orientations above
function best_strips(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var a = x_impedance_0degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var b = y_impedance_0degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var c = x_impedance_90degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var d = y_impedance_90degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var best_strips = [];
    var choices = [a,b,c,d];
    choices.forEach(combo => {
        if (combo[1] == Math.max(a[1],b[1],c[1],d[1])) {
            best_strips.push(combo[1]);
        };
    });
    return Math.floor(best_strips[0]); // returns strips per panel from best orientation
};

// (3) This function compares the three options entered
function compare_options(list,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    if (list.length == 6) {
        var x1 = list[0]
        var y1 = list[1]
        var x2 = list[2]
        var y2 = list[3]
        var x3 = list[4]
        var y3 = list[5]

        var option1 = [best_strips(x1,y1,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min),x1,y1]
        var option2 = [best_strips(x2,y2,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min),x2,y2]
        var option3 = [best_strips(x3,y3,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min),x3,y3]

        var best_option = Math.max(option1[0],option2[0],option3[0])
        if (option1[0] == best_option){
            var best = option1
            var pcb = document.getElementById('pcb1').value
        }
        else if (option2[0] == best_option){
            var best = option2
            var pcb = document.getElementById('pcb2').value
        }
        else if (option3[0] == best_option){
            var best = option3
            var pcb = document.getElementById('pcb3').value
        };
    } else if (list.length == 4) {
        var x1 = list[0]
        var y1 = list[1]
        var x2 = list[2]
        var y2 = list[3]

        var option1 = [best_strips(x1,y1,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min),x1,y1]
        var option2 = [best_strips(x2,y2,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min),x2,y2]

        var best_option = Math.max(option1[0],option2[0])
            if (option1[0] == best_option){
            var best = option1
            var pcb = document.getElementById('pcb1').value
        }
        else if (option2[0] == best_option){
            var best = option2
            var pcb = document.getElementById('pcb2').value
        };
    } else if (list.length == 2) {
        var x1 = list[0]
        var y1 = list[1]
        var best = [best_strips(x1,y1,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min),x1,y1]
        var pcb = document.getElementById('pcb1').value
        }

    return [best,pcb]
};

// (4) Calculate the range
function range(start, stop, step) {
    var a = [start]
    var b = start
    while (b < stop) {
        a.push(b += step || 1)
        };

    return a
};

// (5) This function finds the solution space for the contour plot
function solution_space(x_min,x_max,y_min,y_max,step,pcbs,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    set_x = range(x_min,x_max,step)
    set_y = range(y_min,y_max,step)
    solutionspace = []
    set_y.forEach(y => {
        temp = []
        set_x.forEach(x => {
            temp.push(pcbs*best_strips(x,y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min))
            });
        solutionspace.push(temp)
    });

    return solutionspace
};

function edgeLocator(output,current) {
    return output > current;
  }

function solution_space_minimal(panel_x,panel_y,step,pcbs,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    set_x = range(panel_x-scan_distance_x,panel_x+scan_distance_x,step)
    set_y = range(panel_y-scan_distance_y,panel_y+scan_distance_y,step)
    solutionspace_x = []
    solutionspace_y = []
    set_x.forEach(x => {
        solutionspace_x.push(pcbs*best_strips(x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min))
        });
    set_y.forEach(y => {
        solutionspace_y.push(pcbs*best_strips(panel_x,y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min))
        });
    set_x.findIndex(edgeLocator)
    return solutionspace
};


// (6) Clears the input field
function clearInputs() {
    document.getElementById('option1x').value = ''
    document.getElementById('option1y').value = ''
    document.getElementById('pcb1').value = ''
    document.getElementById('result').innerHTML = ''
};

// (8) Main function
function mainFunction() {
    /// Organize inputs ///
    wpw = panel_configuration()[0];
    wpl = panel_configuration()[1];
    strip_to_edge_width = panel_configuration()[2];
    strip_to_edge_length = panel_configuration()[3];
    strip_to_strip_coupon = panel_configuration()[4];
    strip_to_strip_min = panel_configuration()[5];

    option1_x = parseFloat(document.getElementById('option1x').value)
    option1_y = parseFloat(document.getElementById('option1y').value)
    pcb1 = parseFloat(document.getElementById('pcb1').value)

    arr = [option1_x,option1_y];
    var temp_arr = []
    arr.forEach(option => {
        if(Number.isNaN(option) == false) {
            temp_arr.push(option)
        }
    });

    var scan_distance_x = 5;
    var scan_distance_y = 5;
    var step_size = 0.025;

    // The analysis
    var arr_x = [option1_x]
    var arr_y = [option1_y]

    var stripspace_minimal = solution_space_minimal(arr_x,arr_y,step_size,pcb1,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) 
    var stripspace1 = solution_space(arr_x[0]-scan_distance_x,arr_x[0]+scan_distance_x,arr_y[0]-scan_distance_y,arr_y[0]+scan_distance_y,step_size,pcb1,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
    var xspace1 = range(arr_x[0]-scan_distance_x,arr_x[0]+scan_distance_x,step_size)
    var yspace1 = range(arr_y[0]-scan_distance_y,arr_y[0]+scan_distance_y,step_size)

    /// Display the results graphically ///
    
    // Data for the heat map
    Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json')
    var heatmap_data = [{
        name: 'Explore',
        z: stripspace1,
        x: xspace1,
        y: yspace1,
        colorscale: 'RdBu',
        reversescale: true,
        hovertemplate: '<b>Panel X</b>: %{x}mm' +
                        '<br><b>Panel Y</b>: %{y}mm<br>' +
                        '<b>Boards</b>: %{z} pieces',
        type: 'heatmap',
        orientation: 'v',
        contours: {
        start: best[0]-0.5*best[0],
        end: best[0]+0.5*best[0],
        size:4,
        colorscale: 'Blackbody',
        coloring: 'heatmap',
        showlabels: false,
        labelfont: {
            family: 'San Francisco',
            size: 12,
            color: 'white',}
        }
        },
        {
        name: 'Panelization Output',
        x: [option1_x],
        y: [option1_y],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: 'rgb(0, 0, 0)',
            symbol: ['x'],
            size: 20,
        },
        hovertemplate: '<b>X</b>: %{x}mm' +
                        '<br><b>Y</b>: %{y}mm<br>' +
                        '<b>Boards</b>: %{text} pieces',
        text: [best_strips(option1_x,option1_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)*pcb1]
        },
    ];

    // Layout settings
    var layout = {
        height: 520,
        width: 620,
        title: '<b>Panelization:</b> ' + best_strips(arr_x[0],arr_y[0],wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)*pcb1 + ' boards per master panel',
        margin: {t:75},
        showlegend: false,
        hovermode: 'closest',
        allSpikesEnabled: 'on',
        toggleSpikelines: 'on',
        xaxis: {
            title: {text:'X Dimension (mm)',font:{family: 'San Francisco',size: 15,color: '#7f7f7f'}},
        },
        yaxis: {
            title: {text: 'Y Dimension (mm)',font: {family: 'San Francisco',size: 15,color: '#7f7f7f'},standoff:20},
        }
    };

    // Settings for the heat map
    Plotly.newPlot('result',heatmap_data,layout,{
        modeBarButtonsToRemove:['hoverCompareCartesian','pan2d','select2d','zoomIn2d','zoomOut2d','zoom2d','lasso2d','autoScale2d','resetScale2d','toImage'],
        scrollZoom: true,
        displaylogo: false,
        allSpikesEnabled: 'on',
        toggleSpikelines: 'on',
        });
    }
    