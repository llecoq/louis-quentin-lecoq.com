export default class ChartSpeedometerCpu {

    mode
    data
    containerId

    constructor(data, mode) {
        this.containerId = `speedometer-cpu-${mode}`;
        this.mode = mode.toUpperCase();
        this.data = data[0];
    }

    render() {
        Highcharts.chart(this.containerId, {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%'
            },
            exporting: {
                enabled: false // Désactiver le menu contextuel
            },
            credits: {
                enabled: false
            },
            title: {
                text: `${this.mode}'s max CPU Usage`,
            },
            
            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '75%'],
                size: '110%'
            },
            
            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                tickPixelInterval: 72,
                tickPosition: 'inside',
                tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 20,
                    style: {
                        fontSize: '14px'
                    }
                },
                lineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 55,
                    color: '#55BF3B', // green
                    thickness: 20
                }, {
                    from: 55,
                    to: 80,
                    color: '#DDDF0D', // yellow
                    thickness: 20
                }, {
                    from: 80,
                    to: 100,
                    color: '#DF5353', // red
                    thickness: 20
                }]
            },
            
            series: [{
                name: 'Speed',
                data: [Math.round(this.data.maxCPU) / 8],
                tooltip: {
                    valueSuffix: '%',
                },
                dataLabels: {
                    format: '{y}%',
                    borderWidth: 0,
                    color: (
                        Highcharts.defaultOptions.title &&
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || '#333333',
                    style: {
                        fontSize: '16px',
                    },
                },
                dial: {
                    radius: '80%',
                    backgroundColor: 'gray',
                    baseWidth: 12,
                    baseLength: '0%',
                    rearLength: '0%'
                },
                pivot: {
                    backgroundColor: 'gray',
                    radius: 6
                }
                
            }]
        });
    }
}