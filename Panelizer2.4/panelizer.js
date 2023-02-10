/// Variable definitions 
let wpw = ''
let wpl = ''
let strip_to_edge_width = ''
let strip_to_edge_length = ''
let strip_to_strip_coupon = ''
let strip_to_strip_min = ''
let panel_x = ''
let panel_y = '' 
let pcbs = ''
const scan_distance = 20
const step = 0.025

/// Support functions
function range(start, stop, step) {
    var a = [start]
    var b = start
    while (b < stop) {
        a.push(b += step || 1)
        }
    return a
};

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
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

/// Panelization functions
function xImpedance0Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_x + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length + strip_to_strip_min) / (panel_y + strip_to_strip_min));
    return ['X impedance - 0 degrees',boards_in_x * boards_in_y];
};

function yImpedance0Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width + strip_to_strip_min) / (panel_x + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_y + strip_to_strip_min));
    return ['Y impedance - 0 degrees',boards_in_x * boards_in_y];
};

function xImpedance90Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_y + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length + strip_to_strip_min) / (panel_x + strip_to_strip_min));
    return ['X impedance - 90 degrees',boards_in_x * boards_in_y];
};

function yImpedance90Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var boards_in_x = Math.floor((wpw - 2*strip_to_edge_width + strip_to_strip_min) / (panel_y + strip_to_strip_min));
    var boards_in_y = Math.floor((wpl - 2*strip_to_edge_length - strip_to_strip_coupon + 2*strip_to_strip_min) / (panel_x + strip_to_strip_min));
    return ['Y impedance - 90 degrees',boards_in_x * boards_in_y];
};

function bestStrips(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    var a = xImpedance0Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var b = yImpedance0Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var c = xImpedance90Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var d = yImpedance90Degrees(panel_x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min);
    var bestStrips = [];
    var choices = [a,b,c,d];
    choices.forEach(combo => {
        if (combo[1] == Math.max(a[1],b[1],c[1],d[1])) {
            bestStrips.push(combo[1]);
        };
    });
    return Math.floor(bestStrips[0]);
};

function solutionSpace(x_min,x_max,y_min,y_max,step,pcbs,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    set_x = range(x_min,x_max,step)
    set_y = range(y_min,y_max,step)
    solutionspace = []
    set_y.forEach(y => {
        temp = []
        set_x.forEach(x => {
            temp.push(pcbs*bestStrips(x,y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min))
            });
        solutionspace.push(temp)
    });

    return solutionspace
};

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
    return [wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min]
};

/// Generates the table 
function directionCheck(direction,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min) {
    let solutionspace_x = [];
    let solutionspace_y = [];

    if (direction == 'plus') {
        var set_x = range(panel_x,panel_x+scan_distance,step)
        var set_y = range(panel_y,panel_y+scan_distance,step)
    } else if (direction = 'minus') {
        var set_x = range(panel_x-scan_distance,panel_x,step).reverse()
        var set_y = range(panel_y-scan_distance,panel_y,step).reverse()
        }

    let x_result = ''
    let x_result_percent = ''
    let x_distance_remaining = 0

    let y_result = ''
    let y_result_percent = ''
    let y_distance_remaining = 0

    set_x.forEach(x => {
        solutionspace_x.push(pcbs*bestStrips(x,panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min))
    });
    console.log('Starting')
    for (index = 0; index < set_x.length; index++) {
        x_result = solutionspace_x[index] - solutionspace_x[0]
        if (x_result < 0) {
            x_distance_remaining = (index-1) * step
            x_distance_cliff = (index+1) * step
            x_cliff = x_distance_remaining.toFixed(2)
            x_cliff_output = pcbs*bestStrips((panel_x+x_distance_cliff),panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
            index = set_x.length
            console.log('X cliff results done')
        } else if (x_result > 0) {
            x_distance_remaining_opp = (index-1) * step
            x_distance_opp = (index+1) * step
            x_opp = x_distance_remaining_opp.toFixed(2)
            x_opp_output = pcbs*bestStrips((panel_x-x_distance_opp),panel_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
            index = set_x.length
        }
    }
    console.log('Ending')
    set_y.forEach(y => {
        solutionspace_y.push(pcbs*bestStrips(panel_x,y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min))
    });

    for (index = 0; index < set_y.length; index++) {
        y_result = solutionspace_y[index] - solutionspace_y[0]
        if (y_result < 0) {
            y_distance_remaining = (index-1) * step
            y_distance_cliff = (index+1) * step
            y_cliff = y_distance_remaining.toFixed(2)
            y_cliff_output = pcbs*bestStrips(panel_x,(panel_y+y_distance_cliff),wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
            index = set_y.length
        } else if (y_result > 0) {
            y_distance_remaining_opp = (index-1) * step
            y_distance_opp = (index+1) * step
            y_opp = y_distance_remaining_opp.toFixed(2)
            y_opp_output = pcbs*bestStrips(panel_x,(panel_y-y_distance_opp),wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
            index = set_x.length
        }
    }

    current_output = solutionspace_x[0]

    if (direction == 'plus') {
        results = [current_output,x_cliff,x_cliff_output,y_cliff,y_cliff_output]
    } else if (direction == 'minus') {
        results = [current_output,x_opp,x_opp_output,y_opp,y_opp_output]
    }
    
    return results
};

function generateTable() {
    document.getElementById('heatmap').innerHTML = ''
    panel_x = parseFloat(document.getElementById('option1x').value)
    panel_y = parseFloat(document.getElementById('option1y').value)
    pcbs = parseFloat(document.getElementById('pcb1').value)
    var vendor_list = ['Avary','ATS','Compeq','AKM','UMTC']

    vendor_list.forEach(val => {
        wpw = panelConfiguration(val)[0]
        wpl = panelConfiguration(val)[1]
        strip_to_edge_width = panelConfiguration(val)[2]
        strip_to_edge_length = panelConfiguration(val)[3]
        strip_to_strip_coupon = panelConfiguration(val)[4]
        strip_to_strip_min = panelConfiguration(val)[5]
        let cliff_results = directionCheck('plus',wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
        let opportunity_results = directionCheck('minus',wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
        
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

/// Vendor heat map
function vendorMap(val) {
    wpw = panelConfiguration(val)[0];
    wpl = panelConfiguration(val)[1];
    strip_to_edge_width = panelConfiguration(val)[2];
    strip_to_edge_length = panelConfiguration(val)[3];
    strip_to_strip_coupon = panelConfiguration(val)[4];
    strip_to_strip_min = panelConfiguration(val)[5];

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

    var scan_distance_x = 30;
    var scan_distance_y = 30;
    var step_size = 0.025;

    var arr_x = [option1_x]
    var arr_y = [option1_y]

    var best = bestStrips(arr_x[0],arr_y[0],wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
    var stripspace1 = solutionSpace(arr_x[0]-scan_distance_x,arr_x[0]+scan_distance_x,arr_y[0]-scan_distance_y,arr_y[0]+scan_distance_y,step_size,pcb1,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)
    var xspace1 = range(arr_x[0]-scan_distance_x,arr_x[0]+scan_distance_x,step_size)
    var yspace1 = range(arr_y[0]-scan_distance_y,arr_y[0]+scan_distance_y,step_size)

    var xspace1map = range(-1*scan_distance_x,scan_distance_x,step_size)
    var yspace1map = range(-1*scan_distance_y,scan_distance_y,step_size)

    Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json')
    var heatmap_data = [{
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
        size:4,
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
            size: 20,
        },
        hovertemplate: '<b>Current Panel X</b>: 0mm' +
                        '<br><b>Current Panel Y</b>: 0mm<br>' +
                        '<b>Boards</b>: %{text} pieces',
        text: [bestStrips(option1_x,option1_y,wpw,wpl,strip_to_edge_width,strip_to_edge_length,strip_to_strip_coupon,strip_to_strip_min)*pcb1]
        },
    ];

    // Layout settings
    var layout = {
        height: 520,
        width: 620,
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
    

