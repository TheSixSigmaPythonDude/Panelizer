// V4 - Refactored code using classes

class Support {
    constructor() {}

    range(start, stop, step) {
        let a = [start]
        let b = start
        while (b < stop) {
            a.push(b += step || 1)
        }
        return a
    }
    
    sortTable(n) {
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
}

class Panelization {
    constructor () {
        this.panelX = 0
        this.panelY = 0
        this.panelXInput = 0
        this.panelYInput = 0
        this.pcbs = 0
        this.cliffResults = 0
        this.opportunityResults = 0
        this.vendorList = ['Avary', 'ATS', 'Compeq', 'AKM', 'UMTC']
        this.scanDistance = 20
        this.step = 0.025
    }

    // Sets the master panel dimensions based on specified vendor
    panelConfiguration(vendor) {
        if (vendor=='Avary') {
            this.wpw = 546.10
            this.wpl = 622.30
            this.strip_to_edge_width = 16.50
            this.strip_to_edge_length = 18.00
            this.strip_to_strip_coupon = 10.16
            this.strip_to_strip_min = 1.27
        } else if (vendor=='ATS') {
            this.wpw = 541.02
            this.wpl = 615.95
            this.strip_to_edge_width = 16.00
            this.strip_to_edge_length = 18.00
            this.strip_to_strip_coupon = 8.00
            this.strip_to_strip_min = 1.00
        } else if (vendor=='Compeq') {
            this.wpw = 553.72
            this.wpl = 622.30
            this.strip_to_edge_width = 17.78
            this.strip_to_edge_length = 16.51
            this.strip_to_strip_coupon = 10.90
            this.strip_to_strip_min = 1.00
        } else if (vendor=='AKM') {
            this.wpw = 546.00
            this.wpl = 622.00
            this.strip_to_edge_width = 18.00
            this.strip_to_edge_length = 23.00
            this.strip_to_strip_coupon = 8.50
            this.strip_to_strip_min = 1.20
        } else if (vendor=='UMTC') {
            this.wpw = 541.02
            this.wpl = 617.22
            this.strip_to_edge_width = 15.50
            this.strip_to_edge_length = 19.00
            this.strip_to_strip_coupon = 6.45
            this.strip_to_strip_min = 1.20
        }

        // let results = [this.wpw, this.wpl, this.strip_to_edge_width, this.strip_to_edge_length, this.strip_to_strip_coupon, this.strip_to_strip_min];

        // return results 
    }

    // Figures out the best panelization for the given panel dimensions
    bestPanelization() {
        let a = this.xImpedance0Degrees()
        let b = this.yImpedance0Degrees()
        let c = this.xImpedance90Degrees()
        let d = this.yImpedance90Degrees()
        let bestPanelization = []
        let choices = [a,b,c,d]
        choices.forEach(combo => {
            if (combo[1] == Math.max(a[1],b[1],c[1],d[1])) {
                bestPanelization.push(combo[1])
            }
        })

        let results = this.pcbs * Math.floor(bestPanelization[0]) 
        
        return results
        }
        xImpedance0Degrees() {
            let boards_in_x = Math.floor((this.wpw - 2*this.strip_to_edge_width - this.strip_to_strip_coupon + 2*this.strip_to_strip_min) / (this.panelX + this.strip_to_strip_min))
            let boards_in_y = Math.floor(this.wpl - 2*this.strip_to_edge_length + this.strip_to_strip_min) / (this.panelY + this.strip_to_strip_min)
            let results = ['X impedance - 0 degrees', boards_in_x * boards_in_y]
            
            return results
        }
        yImpedance0Degrees() {
            let boards_in_x = Math.floor((this.wpw - 2*this.strip_to_edge_width + this.strip_to_strip_min) / (this.panelX + this.strip_to_strip_min))
            let boards_in_y = Math.floor((this.wpl - 2*this.strip_to_edge_length - this.strip_to_strip_coupon + 2*this.strip_to_strip_min) / (this.panelY + this.strip_to_strip_min))
            let results = ['Y impedance - 0 degrees', boards_in_x * boards_in_y]

            return results
        }
        xImpedance90Degrees() {
            let boards_in_x = Math.floor((this.wpw - 2*this.strip_to_edge_width - this.strip_to_strip_coupon + 2*this.strip_to_strip_min) / (this.panelY + this.strip_to_strip_min))
            let boards_in_y = Math.floor((this.wpl - 2*this.strip_to_edge_length + this.strip_to_strip_min) / (this.panelX + this.strip_to_strip_min))
            let results = ['X impedance - 90 degrees', boards_in_x * boards_in_y]

            return results
        }
        yImpedance90Degrees() {
            let boards_in_x = Math.floor((this.wpw - 2*this.strip_to_edge_width + this.strip_to_strip_min) / (this.panelY + this.strip_to_strip_min))
            let boards_in_y = Math.floor((this.wpl - 2*this.strip_to_edge_length - this.strip_to_strip_coupon + 2*this.strip_to_strip_min) / (this.panelX + this.strip_to_strip_min))
            let results = ['Y impedance - 90 degrees', boards_in_x * boards_in_y]

            return results
        }

    // Figures out how far are the edges and what's the output
    generateTable() {
        this.panelX = parseFloat(document.getElementById('option1x').value)
        this.panelY = parseFloat(document.getElementById('option1y').value)
        this.panelXInput = parseFloat(document.getElementById('option1x').value)
        this.panelYInput = parseFloat(document.getElementById('option1y').value)
        this.pcbs = parseFloat(document.getElementById('pcb1').value)
        
        console.log(document.getElementById('option1x').value)

        document.getElementById('heatmap').innerHTML = ''
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
    
        this.vendorList.forEach(vendor => {
            this.panelConfiguration(vendor)
            this.cliffResults = this.directionCheck('cliff')
            this.opportunityResults = this.directionCheck('opportunity')

            document.getElementById(vendor).innerHTML = `<button class="vendor-button" id="${vendor}-button" onclick="panelization.vendorMap('${vendor}')">${vendor}</button>`
            document.getElementById(vendor+'-output').textContent = this.cliffResults[0]
            document.getElementById(vendor+'-xcliff').textContent = this.cliffResults[1]
            document.getElementById(vendor+'-xcliff-output').textContent = this.cliffResults[2]
            document.getElementById(vendor+'-ycliff').textContent = this.cliffResults[3]
            document.getElementById(vendor+'-ycliff-output').textContent = this.cliffResults[4]
            document.getElementById(vendor+'-xopportunity').textContent = this.opportunityResults[1]
            document.getElementById(vendor+'-xopportunity-output').textContent = this.opportunityResults[2]
            document.getElementById(vendor+'-yopportunity').textContent = this.opportunityResults[3]
            document.getElementById(vendor+'-yopportunity-output').textContent = this.opportunityResults[4]
    
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
            }
        )    
    }
        directionCheck(direction) {
            let support = new Support()
            let solutionSpaceX = []
            let solutionSpaceY = []
            let results = []
            let xResult = 0
            let yResult = 0
            let setX, xCliff, xDistanceCliff, xCliffOutput, xOpp, xDistanceOpp, xOppOutput
            let setY, yCliff, yDistanceCliff, yCliffOutput, yOpp, yDistanceOpp, yOppOutput
            if (direction == 'cliff') {
                setX = support.range(this.panelX, this.panelX + this.scanDistance, this.step)
                setY = support.range(this.panelY, this.panelY + this.scanDistance, this.step)
            } else if (direction = 'opportunity') {
                setX = support.range(this.panelX - this.scanDistance, this.panelX, this.step).reverse()
                setY = support.range(this.panelY - this.scanDistance, this.panelY, this.step).reverse()
            }
        
            // 1. X direction scan
            setX.forEach(x => {
                this.panelX = x
                solutionSpaceX.push(this.bestPanelization())
            })
            for (let index = 0; index < setX.length; index++) {
                xResult = solutionSpaceX[index] - solutionSpaceX[0]
                if (xResult < 0) {
                    xCliff = ((index-1) * this.step).toFixed(2)
                    xDistanceCliff = (index+1) * this.step
                    this.panelX = this.panelXInput + xDistanceCliff
                    xCliffOutput = this.bestPanelization()

                    index = setX.length
                } else if (xResult > 0) {
                    xOpp = ((index-1) * this.step).toFixed(2)
                    xDistanceOpp = (index+1) * this.step
                    this.panelX = this.panelXInput - xDistanceOpp
                    xOppOutput = this.bestPanelization()

                    index = setX.length
                }
            }

            // 2. Y direction scan
            setY.forEach(y => {
                this.panelX = this.panelXInput
                this.panelY = y
                solutionSpaceY.push(this.bestPanelization())
            })
            for (let index = 0; index < setY.length; index++) {
                yResult = solutionSpaceY[index] - solutionSpaceY[0]
                if (yResult < 0) {
                    yCliff = ((index-1) * this.step).toFixed(2)
                    yDistanceCliff = (index+1) * this.step
                    this.panelY = this.panelYInput + yDistanceCliff
                    yCliffOutput = this.bestPanelization()

                    index = setY.length
                } else if (yResult > 0) {
                    yOpp = ((index-1) * this.step).toFixed(2)
                    yDistanceOpp = (index+1) * this.step
                    this.panelY = this.panelYInput - yDistanceOpp
                    yOppOutput = this.bestPanelization()

                    index = setX.length
                }
            }
        
            // 3. Results
            this.panelX = this.panelXInput
            this.panelY = this.panelYInput
            let currentOutput = this.bestPanelization()
            if (direction == 'cliff') {
                results = [currentOutput, xCliff, xCliffOutput, yCliff, yCliffOutput]
            } else if (direction == 'opportunity') {
                results = [currentOutput, xOpp, xOppOutput, yOpp, yOppOutput]
            }
            
            return results
        }

    // Generates the heat map
    vendorMap(val) {
        Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json')
        let solution = this.solutionSpace()
        let heatMapData = [{
            name: 'Explore',
            z: solution,
            x: this.setX,
            y: this.setY,
            colorscale: 'Bluered',
            reversescale: true,
            hovertemplate: '<b>Panel X</b>: %{x}mm' +
                            '<br><b>Panel Y</b>: %{y}mm<br>' +
                            '<b>Boards</b>: %{z} pieces',
            type: 'heatmap',
            orientation: 'v',
            contours: {
                start: this.cliffResults[0] - 0.5*this.cliffResults[0],
                end: this.cliffResults[0] + 0.5*this.cliffResults[0],
                size: 4,
                colorscale: 'Blackbody',
                coloring: 'heatmap',
                showlabels: false,
                labelfont: {
                    family: 'San Francisco',
                    size: 12,
                    color: 'white'
                },
            }
        },
        {
            name: 'Panelization Output',
            x: [this.panelXInput],
            y: [this.panelYInput],
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: 'rgb(0, 0, 0)',
                symbol: ['x'],
                size: 20,
                },
            hovertemplate: '<b>Current Panel X</b>: %{x}mm' +
                            '<br><b>Current Panel Y</b>: %{y}mm<br>' +
                            '<b>Boards</b>: %{text} pieces',
            text: [this.bestPanelization()]
        }]
    
        // Layout settings
        let layout = {
            height: 520,
            width: 620,
            title: {text:'<b>'+val+'</b>', font:{family:'San Francisco', size: 25, color:'black'}},
            margin: {t:50},
            showlegend: false,
            hovermode: 'closest',
            allSpikesEnabled: 'on',
            toggleSpikelines: 'on',
            xaxis: {
                title: {text:'<em>Panel X Dimension (mm)</em>',font:{family: 'San Francisco',size: 12,color: '#7f7f7f'}},
            },
            yaxis: {
                title: {text:'<em>Panel Y Dimension (mm)</em>',font: {family: 'San Francisco',size: 12,color: '#7f7f7f'}, standoff:20},
            }
        }
    
        // Settings for the heat map
        Plotly.newPlot('heatmap', heatMapData, layout, {
            modeBarButtonsToRemove:['hoverCompareCartesian','pan2d','select2d','zoomIn2d','zoomOut2d','zoom2d','lasso2d','autoScale2d','resetScale2d','toImage'],
            scrollZoom: true,
            displaylogo: false,
            allSpikesEnabled: 'on',
            toggleSpikelines: 'on'
        })
    }
        solutionSpace() {
            let support = new Support()
            this.xMin = this.panelX - this.scanDistance
            this.xMax = this.panelX + this.scanDistance
            this.yMin = this.panelY - this.scanDistance
            this.yMax = this.panelY + this.scanDistance

            this.setX = support.range(this.xMin, this.xMax, this.step)
            this.setY = support.range(this.yMin, this.yMax, this.step)
            let solutions = []

            this.setY.forEach(y => {
                this.panelY = y
                let temp = []
                this.setX.forEach(x => {
                    this.panelX = x
                    temp.push(this.bestPanelization())
                    });
                solutions.push(temp)
            });

            return solutions
        }

}

let support = new Support()
let panelization = new Panelization()