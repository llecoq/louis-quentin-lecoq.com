export default class ChartCpuMetricsAverage {

    jsData
    wasmData
    xAxisCategories = []
    JScpu = []
    WASMcpu = []
    containerId

    constructor(jsData, wasmData) {
        this.jsData = jsData;
        this.wasmData = wasmData;
        this.containerId = `container-cpu-metrics-average`;
        this.traceDuration = jsData[0].traceDuration * 0.001 * 14;

        for (let i = 100; i <= 1500; i += 100) {
            this.xAxisCategories.push(i);
        }

        for (let i = 0; i <= 14; i++) {
            this.JScpu.push(Math.round(jsData[i].maxCPU) / 8);
        }

        for (let i = 0; i <= 14; i++) {
            this.WASMcpu.push(Math.round(wasmData[i].maxCPU) / 8);
        }
    }

    render() {
        Highcharts.chart(this.containerId, {
            chart: {
                zoomType: 'xy',
                type: 'area'
            },
            exporting: {
                enabled: false // Désactiver le menu contextuel
            },
            credits: {
                enabled: false
            },
            title: {
                text: "Max CPU usage of JS vs. WASM & Rust",
                align: 'left'
            },
            subtitle: {
                text: `${this.traceDuration} seconds of data tracing`,
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
                format: '{value} %',
            },
            title: {
                text: 'Pourcentage of CPU used',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }, 
            max: 100,
            // min: 0
        }],
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
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
            type: 'area',
            data: this.JScpu,
            color: '#f0db4f',
            tooltip: {
                valueSuffix: ' % of CPU used'
            }
        }, {
            name: 'WASM',
            type:"area",
            data: this.WASMcpu,
            color: '#654ff0',
            tooltip: {
                valueSuffix: ' % of CPU used'
            }
        }]
    });        
    }
}