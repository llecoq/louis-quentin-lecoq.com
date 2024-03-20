export default class ChartDonutLanguages {
    
    language
    data
    value
    
    constructor(language) {
        this.language = language;

        if (language === 'js') {
            this.data = [{ name: 'JavaScript', y: 100 }];
            this.value = 100;
        } else {
            this.data = [
                { name: 'JavaScript', y: 57.17 },
                { name: 'Wasm & Rust', y: 42.86 }
            ];
            this.value = 42.86;
        }
    }

    render() {

        Highcharts.chart(`container-donut-${this.language}`, {
            title: {
                text: null,
            },
            subtitle: {
                useHTML: true,
                text: this.getSubtitle(),
                floating: true,
                verticalAlign: 'middle',
                y: 30,
            },
            
            exporting: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: false
            },
            
            tooltip: {
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '%',
                },
                
            },
            
            plotOptions: {
                series: {
                    borderWidth: 0,
                    colorByPoint: true,
                    type: 'pie',
                    size: '100%',
                    innerSize: '80%',
                    dataLabels: {
                        enabled: false,
                        crop: false,
                        distance: '-10%',
                        style: {
                            fontWeight: 'bold',
                            fontSize: '16px'
                        },
                        connectorWidth: 0
                    }
                }
            },
            colors: ['#f0db4f', '#654ff0'],
            series: [
                {
                    type: 'pie',
                    name: `Pourcentage of time spent during execution`,
                    data: this.data,
                }
            ]
        });
    }    

    getSubtitle() {
        return `<div style="text-align: center; vertical-align: middle; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                    <span style="font-size: 80px; margin: 0 auto;">${this.language}</span>
                    <br>
                    <span style="font-size: 18px; margin: 0 auto;">
                        Runtime Distribution: <b> ${this.value}</b>%
                    </span>
                </div>`;
    }
}

