export default class ChartFpsParticles {

    jsData
    wasmData
    xAxisCategories = []
    JSfps = []
    WASMfps = []
    numberOfWorkers
    containerId

    constructor(jsData, wasmData) {
        this.jsData = jsData;
        this.wasmData = wasmData;
        this.numberOfWorkers = jsData[0].numberOfWorkers;
        this.containerId = `container-fps-${this.numberOfWorkers}`;
        this.traceDuration = jsData[0].traceDuration * 0.001 * 14;

        if (this.numberOfWorkers === 'average') {
            this.numberOfWorkers = 'Average';
        }

        for (let i = 100; i <= 1500; i += 100) {
            this.xAxisCategories.push(i);
        }

        for (let i = 0; i <= 14; i++) {
            this.JSfps.push(jsData[i].animationData.fps);
        }

        for (let i = 0; i <= 14; i++) {
            this.WASMfps.push(wasmData[i].animationData.fps);
        }
    }

    render() {
        Highcharts.chart(this.containerId, {
            chart: {
                backgroundColor: '',
                zoomType: 'xy'
            },
            exporting: {
                enabled: false // Désactiver le menu contextuel
            },
            credits: {
                enabled: false
            },
            title: {
                text: "Frame Per Seconds with JS vs. WASM & Rust",
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
                format: '{value} FPS',
            },
            title: {
                text: 'Frame Per Seconds',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }, 
            // max: 60,
            min: 0
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
        },
        series: [{
            name: 'JS',
            type: 'spline',
            data: this.JSfps,
            color: '#f0db4f',
            tooltip: {
                valueSuffix: ' FPS'
            }
        }, {
            name: 'WASM',
            type:"spline",
            data: this.WASMfps,
            color: '#654ff0',
            tooltip: {
                valueSuffix: ' FPS'
            }
        }]
    });        
    }
}