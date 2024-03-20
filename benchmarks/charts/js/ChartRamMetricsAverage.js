export default class ChartRamMetricsAverage {

    jsData
    wasmData
    xAxisCategories = []
    JSram = []
    WASMram = []
    containerId

    constructor(jsData, wasmData) {
        this.jsData = jsData;
        this.wasmData = wasmData;
        this.containerId = `container-ram-metrics-average`;
        this.traceDuration = jsData[0].traceDuration * 0.001 * 14;

        for (let i = 100; i <= 1500; i += 100) {
            this.xAxisCategories.push(i);
        }

        for (let i = 0; i <= 14; i++) {
            this.JSram.push(Math.round(jsData[i].USS));
        }

        for (let i = 0; i <= 14; i++) {
            this.WASMram.push(Math.round(wasmData[i].USS));
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
                text: "Average RAM usage of JS vs. WASM & Rust",
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
                format: '{value}M',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Total Memory Usage in MB (USS)',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
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
            data: this.JSram,
            color: '#f0db4f',
            tooltip: {
                valueSuffix: 'MB'
            }
        }, {
            name: 'WASM',
            type:"area",
            data: this.WASMram,
            color: '#654ff0',
            tooltip: {
                valueSuffix: 'MB'
            }
        }]
    });        
    }
}