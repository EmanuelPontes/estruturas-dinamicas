import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType, Plugin } from 'chart.js';
import { BehaviorSubject } from 'rxjs';


type customDougnutType = {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
    plugins: Plugin<'doughnut'>[]
};

@Component({
    selector: 'dougnut-chart',
    template: `<div class="mt-5" style="position: relative; width: 15vw; height:15vh">
                <canvas #dougnutchart baseChart
                        [labels]="dougnutChart.labels"
                        [datasets]="dougnutChart.datasets"
                        [options]="dougnutChart.options"
                        [legend]="false"
                        [type]="'doughnut'"
                        [plugins]="dougnutChart.plugins">
                </canvas>
                </div>
    
    `
})
export class DougnutChartComponent implements OnInit, OnChanges {
    @Input() 
    set atual(n: number) {
        this._atual.next(n);        
    };
    @Input() max!: number;
    @Input() min!: number;
    @ViewChild('dougnutchart', { static: true }) canvas!: ElementRef;

    private _atual: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    dougnutChart: customDougnutType;

    get atual() {
        return this._atual.value;
    }
    public writeValueInMiddlePlugin: Plugin<'doughnut'> = {
        id: 'write_value_in_middle',
        afterDraw: function(chart: any, args: any, options: any) {
            
            if (chart.config.type !== 'doughnut') {
                return;
            }
            let width = chart.width;
            let height = chart.height;
            let ctx = chart.ctx;
            if (ctx && height && width) {
                ctx.restore();
                let fontSize = (height / 5).toFixed(0);
                ctx.font = fontSize + "px roboto";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#495057";
                let text = chart.data.datasets![0].data![0]!.toString() + "%",
                    textX = Math.round((width - ctx.measureText(text).width) / 1.9),
                    textY = height / 2;
    
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
    
        }
    };
    public doughnutChartType: ChartType = 'doughnut';

    constructor(private cd: ChangeDetectorRef) { 
        this.dougnutChart = {
            labels: [],  
            datasets: [ {
                data: [100,0],
                borderColor: ['#009933', 'rgba(0, 128, 0, 0.639)'],
                    backgroundColor: ['#009933', 'rgba(0, 128, 0, 0.639)'],
            },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                
                events: [],
                cutout: 50,
                onHover(event, elements, chart) {
                    
                },
            },
            plugins: [this.writeValueInMiddlePlugin]

        }
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit(): void {
        
        this._atual.subscribe(n => {
            if (n === null || n === undefined || n < this.min) {
                n = this.min;
            }
            this.dougnutChart.datasets = [
                {data: [n, (this.max - n)],
                    borderColor: ['#009933', 'rgba(0, 128, 0, 0.039)'],
                    backgroundColor: ['#009933', 'rgba(0, 128, 0, 0.039)'],
                }
            ];
            // this.cd.detectChanges();
        })
    }

    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  
    }

    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      
    }

}