export default class ChartSortAlgo {
    
    jsData
    wasmData
    xAxisCategories = []   
    JSsortNeighbors = []
    WASMsortNeighbors = []
    numberOfWorkers
    containerId

    constructor(jsData, wasmData) {
        this.jsData = jsData;
        this.wasmData = wasmData;
        this.numberOfWorkers = jsData[0].numberOfWorkers;
        this.containerId = `container-sort-algo-${this.numberOfWorkers}`;
        this.traceDuration = jsData[0].traceDuration * 0.001 * 14;
        
        for (let i = 100; i <= 1500; i += 100) {
            this.xAxisCategories.push(i);
        }

        for (let i = 0; i <= 14; i++) {
            this.JSsortNeighbors.push(jsData[i].sortNeighborsData.averageDuration * 0.001);
        }

        for (let i = 0; i <= 14; i++) {
            this.WASMsortNeighbors.push(wasmData[i].sortNeighborsData.averageDuration * 0.001);
        }
    }  
    
    render() {
        Highcharts.chart(this.containerId, {
            chart: {
                zoomType: 'xy'
            },
            exporting: {
                enabled: false // Désactiver le menu contextuel
            },
            credits: {
                enabled: false
            },
            title: {
                text: "Sorting Algorithm Average Duration",
                align: 'left'
            },
            subtitle: {
                text: `${this.numberOfWorkers} Web Workers, ${this.traceDuration} seconds of data tracing`,
                align: 'left'
            },
        xAxis: [{
            categories: this.xAxisCategories,
            crosshair: true,
            title: {
                text: 'Number Of Particles',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} ms',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }, 
        }, {
            labels: {
                format: '{value} ms',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Sorting Algorithm Duration'
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            align: 'left',
            verticalAlign: 'top',
            y: 80,
            x: 60,
            floating: true,
            backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'JS',
            type: 'column',
            data: this.JSsortNeighbors,
            yAxis: 1,
            color: '#f0db4f',
        }, {
            name: 'WASM',
            type: 'column',
            data: this.WASMsortNeighbors,
            yAxis: 1,
            color: '#654ff0',
        }]
    });        
    }
}
