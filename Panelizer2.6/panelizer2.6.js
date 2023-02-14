/// Variable declarations 
let panel_x = 0
let panel_y = 0 
let pcbs = 0

let wpw = 0
let wpl = 0
let strip_to_edge_width = 0
let strip_to_edge_length = 0
let strip_to_strip_coupon = 0
let strip_to_strip_min = 0
let step = 0
let decimalPlaces = 3

let solutionspace_x = []
let solutionspace_y = []
let span = 2

let set_x = []
let set_y = []

let cliff_results = []
let opportunity_results = []
let vendor_list = ['Avary','ATS','Compeq','AKM','UMTC']


/// Generates the table 
function generateTable() {
    document.getElementById('heatmap').innerHTML = ''
    panel_x = parseFloat(document.getElementById('option1x').value)
    panel_y = parseFloat(document.getElementById('option1y').value)
    pcbs = parseFloat(document.getElementById('pcb1').value)

    if (panel_x < 10 || panel_x > 450) {
        alert('Try a panel X-dimension between 10mm and 450mm')
    }

    if (panel_y < 10 || panel_y > 500) {
        alert('Try a panel Y-dimension between 10mm and 550mm')
    }

    if (pcbs <= 0) {
        alert('You sure about no boards per panel??')
    }

    vendor_list.forEach(val => {
        panelConfiguration(val)
        cliff_results = cliffCheck()
        opportunity_results = opportunityCheck()
        
        document.getElementById('vendor').textContent = 'Vendors'
        document.getElementById('output').textContent = 'Current Output'
        document.getElementById('xcliff').textContent = 'Panel X Cliff (mm)'
        document.getElementById('xcliff-output').textContent = 'Panel X Cliff Output'
        document.getElementById('ycliff').textContent = 'Panel Y Cliff (mm)'
        document.getElementById('ycliff-output').textContent = 'Panel Y Cliff Output'
        document.getElementById('xopportunity').textContent = 'Panel X Opp (mm)'
        document.getElementById('xopportunity-output').textContent = 'Panel X Opp Output'
        document.getElementById('yopportunity').textContent = 'Panel Y Opp (mm)'
        document.getElementById('yopportunity-output').textContent = 'Panel Y Opp Output'

        document.getElementById(val).innerHTML = `<button class="vendor-button" id="${val}-button" onclick="vendorMap('${val}')">${val}</button>`

        document.getElementById(val+'-output').textContent = cliff_results[0]
        document.getElementById(val+'-xcliff').textContent = cliff_results[1]
        document.getElementById(val+'-xcliff-output').textContent = cliff_results[2]
        document.getElementById(val+'-ycliff').textContent = cliff_results[3]
        document.getElementById(val+'-ycliff-output').textContent = cliff_results[4]
        document.getElementById(val+'-xopportunity').textContent = opportunity_results[1]
        document.getElementById(val+'-xopportunity-output').textContent = opportunity_results[2]
        document.getElementById(val+'-yopportunity').textContent = opportunity_results[3]
        document.getElementById(val+'-yopportunity-output').textContent = opportunity_results[4]

        document.getElementById('vendor').style.backgroundColor = 'black'
        document.getElementById('vendor').style.color = 'white'
        document.getElementById('output').style.backgroundColor = 'black'  
        document.getElementById('output').style.color = 'white'    

        document.getElementById('xcliff').style.backgroundColor = '#ed2939'  
        document.getElementById('xcliff').style.color = 'white'
        document.getElementById('xcliff-output').style.backgroundColor = '#ed2939'  
        document.getElementById('xcliff-output').style.color = 'white'
        
        document.getElementById('ycliff').style.backgroundColor = '#ed2939'  
        document.getElementById('ycliff').style.color = 'white'
        document.getElementById('ycliff-output').style.backgroundColor = '#ed2939'  
        document.getElementById('ycliff-output').style.color = 'white'

        document.getElementById('xopportunity').style.backgroundColor = '#0247fe'  
        document.getElementById('xopportunity').style.color = 'white'
        document.getElementById('xopportunity-output').style.backgroundColor = '#0247fe'  
        document.getElementById('xopportunity-output').style.color = 'white'
        
        document.getElementById('yopportunity').style.backgroundColor = '#0247fe'  
        document.getElementById('yopportunity').style.color = 'white'
        document.getElementById('yopportunity-output').style.backgroundColor = '#0247fe'  
        document.getElementById('yopportunity-output').style.color = 'white'

    });    
}

function panelConfiguration(vendor) {
    if (vendor=='Avary'){
        wpw = 546.1
        wpl = 622.3
        strip_to_edge_width = 16.5
        strip_to_edge_length = 18
        strip_to_strip_coupon = 10.16
        strip_to_strip_min = 1.27
    } else if (vendor=='ATS'){
        wpw = 541.02
        wpl = 615.95
        strip_to_edge_width = 16
        strip_to_edge_length = 18
        strip_to_strip_coupon = 8
        strip_to_strip_min = 1
    } else if (vendor=='Compeq'){
        wpw = 553.72
        wpl = 622.3
        strip_to_edge_width = 17.78
        strip_to_edge_length = 16.51
        strip_to_strip_coupon = 10.9
        strip_to_strip_min = 1
    } else if (vendor=='AKM'){
        wpw = 546
        wpl = 622
        strip_to_edge_width = 18
        strip_to_edge_length = 23
        strip_to_strip_coupon = 8.5
        strip_to_strip_min = 1.2
    } else if (vendor=='UMTC'){
        wpw = 541.02
        wpl = 617.22
        strip_to_edge_width = 15.5
        strip_to_edge_length = 19
        strip_to_strip_coupon = 6.452
        strip_to_strip_min = 1.2
    }
};

function cliffCheck() {
    step = Math.min(panel_x, panel_y) * 0.00035
    //set_x = range(panel_x, panel_x+panel_x/span, step)
    //set_y = range(panel_y, panel_y+panel_y/span, step)
    minimum = Math.min(panel_x, panel_y)
    set_x = set_y = range(minimum, minimum+minimum/span, step)

    solutionspace_x = solutionSpaceX('cliff', panel_x, panel_x+panel_x/span, panel_y)
    for (index = 0; index < set_x.length; index++) {
        x_result = solutionspace_x[index] - solutionspace_x[0]
        if (x_result < 0) {
            x_cliff = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_x = panel_x + x_cliff
            x_cliff_output = pcbs*bestStrips(pnl_x, panel_y)
            index = set_x.length
        } else {
            x_cliff = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_x = panel_x + x_cliff
            x_cliff_output = pcbs*bestStrips(pnl_x, panel_y)
        }   
    }

    solutionspace_y = solutionSpaceY('cliff', panel_y, panel_y+panel_y/span, panel_x)
    for (index = 0; index < set_y.length; index++) {
        y_result = solutionspace_y[index] - solutionspace_y[0]
        if (y_result < 0) {
            y_cliff = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_y = panel_y + y_cliff
            y_cliff_output = pcbs*bestStrips(panel_x, pnl_y)
            index = set_y.length
        } else {
            y_cliff = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_y = panel_y + y_cliff
            y_cliff_output = pcbs*bestStrips(panel_x, pnl_y)
        }
    }

    current_output = pcbs*bestStrips(panel_x, panel_y)
    results = [current_output, x_cliff, x_cliff_output, y_cliff, y_cliff_output]

    return results
};

function opportunityCheck() {
    set_x_opp = rangeOpp(panel_x, panel_x-panel_x/span, step)
    set_y_opp = rangeOpp(panel_y, panel_y-panel_y/span, step)

    solutionspace_x_opp = solutionSpaceX('opportunity', panel_x-panel_x/span, panel_x, panel_y)
    for (index = 0; index < set_x_opp.length; index++) {
        x_result_opp = solutionspace_x_opp[index] - solutionspace_x_opp[0]
        if (x_result_opp > 0) {
            x_opp = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_x = panel_x - x_opp
            x_opp_output = pcbs*bestStrips(pnl_x, panel_y)
            index = set_x_opp.length
        } else {
            x_opp = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_x = panel_x - x_opp
            x_opp_output = pcbs*bestStrips(pnl_x, panel_y)
        }
        
    }

    solutionspace_y_opp = solutionSpaceY('opportunity', panel_y-panel_y/span, panel_y, panel_x)
    for (index = 0; index < set_y_opp.length; index++) {
        y_result_opp = solutionspace_y_opp[index] - solutionspace_y_opp[0]
        if (y_result_opp > 0) {
            y_opp = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_y = panel_y - y_opp
            y_opp_output = pcbs*bestStrips(panel_x, pnl_y)
            index = set_y_opp.length
        } else {
            y_opp = parseFloat((index * step).toFixed(decimalPlaces))
            pnl_y = panel_y - y_opp
            y_opp_output = pcbs*bestStrips(panel_x, pnl_y)
        }
    }

    current_output = pcbs*bestStrips(panel_x, panel_y)
    results = [current_output, x_opp, x_opp_output, y_opp, y_opp_output]

    return results
};

function bestStrips(panel_x,panel_y) {
    let a = xImpedance0Degrees(panel_x,panel_y);
    let b = yImpedance0Degrees(panel_x,panel_y);
    let c = xImpedance90Degrees(panel_x,panel_y);
    let d = yImpedance90Degrees(panel_x,panel_y);
    let bestStrips = [];
    let choices = [a,b,c,d];
    choices.forEach(combo => {
        if (combo[1] == Math.max(a[1],b[1],c[1],d[1])) {
            bestStrips.push(combo[1]);
        };
    });
    return Math.floor(bestStrips[0]);
};

function xImpedance0Degrees(panel_x,panel_y) {
    let boards_in_x = Math.floor((wpw - 2*strip_to_edge_width - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_x + strip_to_strip_min));
    let boards_in_y = Math.floor((wpl - 2*strip_to_edge_length + strip_to_strip_min) / (panel_y + strip_to_strip_min));
    return ['X impedance - 0 degrees',boards_in_x * boards_in_y];
};

function yImpedance0Degrees(panel_x,panel_y) {
    let boards_in_x = Math.floor((wpw - 2*strip_to_edge_width + strip_to_strip_min) / (panel_x + strip_to_strip_min));
    let boards_in_y = Math.floor((wpl - 2*strip_to_edge_length - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_y + strip_to_strip_min));
    return ['Y impedance - 0 degrees',boards_in_x * boards_in_y];
};

function xImpedance90Degrees(panel_x,panel_y) {
    let boards_in_x = Math.floor((wpw - 2*strip_to_edge_width - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_y + strip_to_strip_min));
    let boards_in_y = Math.floor((wpl - 2*strip_to_edge_length + strip_to_strip_min) / (panel_x + strip_to_strip_min));
    return ['X impedance - 90 degrees',boards_in_x * boards_in_y];
};

function yImpedance90Degrees(panel_x,panel_y) {
    let boards_in_x = Math.floor((wpw - 2*strip_to_edge_width + strip_to_strip_min) / (panel_y + strip_to_strip_min));
    let boards_in_y = Math.floor((wpl - 2*strip_to_edge_length - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_x + strip_to_strip_min));
    return ['Y impedance - 90 degrees',boards_in_x * boards_in_y];
};

function solutionSpace(x_min,x_max,y_min,y_max) {
    set_x = range(x_min,x_max,step)
    set_y = range(y_min,y_max,step)
    solutionspace = []
    set_y.forEach(y => {
        temp = []
        set_x.forEach(x => {
            temp.push(pcbs*bestStrips(x,y))
            });
        solutionspace.push(temp)
    });

    return solutionspace
};

function solutionSpaceX(direction,x_min,x_max,y) {
    if (direction=='cliff') {
        set_x = range(x_min,x_max,step)
    } else if (direction=='opportunity') {
        set_x = rangeOpp(x_max,x_min,step)
    }
    solutionspace = []
    set_x.forEach(x => {
        solutionspace.push(pcbs*bestStrips(x,y))
        })
    return solutionspace
};

function solutionSpaceY(direction,y_min,y_max,x) {
    if (direction=='cliff') {
        set_y = range(y_min,y_max,step)
    } else if (direction=='opportunity') {
        set_y = rangeOpp(y_max,y_min,step)
    }
    solutionspace = []
    set_y.forEach(y => {
        solutionspace.push(pcbs*bestStrips(x,y))
        })
    return solutionspace
};

function range(start, stop, step) {
    let a = [start]
    let b = start
    while (b < stop) {
        a.push(b += step || 1)
    }
    return a
};

function rangeOpp(start, stop, step) {
    let a = [start]
    let b = start
    while (b > stop) {
        a.push(b -= step || 1)
    }
    return a
};

/// Vendor heat map
function vendorMap(val) {
    panelConfiguration(val)

    panel_x = parseFloat(document.getElementById('option1x').value)
    panel_y = parseFloat(document.getElementById('option1y').value)
    pcbs = parseFloat(document.getElementById('pcb1').value)

    let best = bestStrips(panel_x, panel_y)
    let stripspace1 = solutionSpace(panel_x-panel_x/span, panel_x+panel_x/span, panel_y-panel_y/span, panel_y+panel_y/span)

    let xspace1map = range(-1*panel_x/span, panel_x/span, step)
    let yspace1map = range(-1*panel_y/span, panel_y/span, step)

    Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json')
    let heatmap_data = [{
    name: 'Explore',
    z: stripspace1,
    x: yspace1map,
    y: yspace1map,
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
        size: 4,
        colorscale: 'Blackbody',
        coloring: 'heatmap',
        showlabels: false,
        labelfont: {
            family: 'San Francisco',
            size: 12,
            color: 'white'
        }
    }
    },
    {
        name: 'Panelization Output',
        x: [0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: 'rgb(0, 0, 0)',
            symbol: ['x'],
            size: 10,
        },
        hovertemplate: '<b>Current Panel X</b>: 0mm' +
                        '<br><b>Current Panel Y</b>: 0mm<br>' +
                        '<b>Boards</b>: %{text} pieces',
        text: [best*pcb1] // text: [bestStrips(option1_x,option1_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)*pcb1]
    },
    ];

    // Layout settings
    let layout = {
    height: 620,
    width: 820,
    title: {text:'<b>'+val+'</b>',font:{family: 'San Francisco',size: 25,color:'black'}},
    margin: {t:50},
    showlegend: false,
    hovermode: 'closest',
    allSpikesEnabled: 'on',
    toggleSpikelines: 'on',
    xaxis: {
        title: {text:'<em>Panel X Changes (mm)</em>',font:{family: 'San Francisco',size: 12,color: '#7f7f7f'}},
    },
    yaxis: {
        title: {text:'<em>Panel Y Changes (mm)</em>',font: {family: 'San Francisco',size: 12,color: '#7f7f7f'},standoff:20},
    }
    };

    // Settings for the heat map
    Plotly.newPlot('heatmap',heatmap_data,layout,{
    modeBarButtonsToRemove:['hoverCompareCartesian','pan2d','select2d','zoomIn2d','zoomOut2d','zoom2d','lasso2d','autoScale2d','resetScale2d','toImage'],
    scrollZoom: true,
    displaylogo: false,
    allSpikesEnabled: 'on',
    toggleSpikelines: 'on',
    });
}


/// Auxillary Functions
function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}