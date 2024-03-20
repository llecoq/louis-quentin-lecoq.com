export default class ChartRadar {

    render() {
        Highcharts.chart('container-radar', {

            chart: {
                polar: true
            },
        
            credits: {
                enabled: false
            },

            exporting: {
                enabled: false
            },

            title: {
                text: 'Tech Stack Performance and Complexity Comparison'
            },
        
            pane: {
                startAngle: 0,
                endAngle: 360
            },
        
            xAxis: {
                categories: ['CPU Usage', 'RAM Usage', 'Sorting Algorithm Speed', 'Animation Speed', 'FPS', 'Development Time', 'Complexity'],
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                labels: {
                    enabled: false // Masque les étiquettes des graduations
                }
            },
        
            series: [{
                type: 'area',
                name: 'Wasm',
                color: '#654ff0',
                data: [9, 7, 9, 7, 8, 4, 4]
            },{
                type: 'area',
                name: 'JavaScript',
                color: '#f0db4f',
                data: [3, 4, 1, 4, 4, 8, 9]
            }]
        });
    }
}