import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ChartConfiguration, Plugin } from "chart.js";
import { BehaviorSubject } from "rxjs";

type customBarType = {
    labels: string[];
    datasets: ChartConfiguration<'bar'>['data']['datasets'];
    options: ChartConfiguration<'bar'>['options'];
    plugins: Plugin<'bar'>[]
};

@Component({
    selector: 'bar-chart',
    template: `<div style="display: block;">
                <canvas #barchart baseChart
                        [labels]="barChart.labels"
                        [datasets]="barChart.datasets"
                        [options]="barChart.options"
                        [legend]="false"
                        [type]="'bar'"
                        [plugins]="barChart.plugins">
                </canvas>
                </div>
    
    `
})
export class BarChartComponent implements OnInit, OnChanges {
    @Input() 
    set atual(n: number[]) {
        this._atual.next(n);        
    };
    @Input() 
    set labels(l: string[]) {
        this._labels.next(l);        
    };
    @ViewChild('barchart', { static: true }) canvas!: ElementRef;

    private _atual: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    private _labels: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    barChart: customBarType;

    constructor() {
        this.barChart = {
            labels: this.labels,  
            datasets: [ {
                data: [100,0],
                borderColor: ['#009933'],
                    backgroundColor: ['#009933'],
            },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                
                events: [],
                onHover(event, elements, chart) {
                    
                },
            },
            plugins: []

        }
    }
    ngOnChanges(changes: SimpleChanges): void {
      
    }
    ngOnInit(): void {
        this._labels.subscribe(l => {
            this.barChart.labels = l;
        });
        this._atual.subscribe(n => {
            
            this.barChart.datasets = [
                {   
                    data: n,
                    borderColor: ['#009933'],
                    backgroundColor: ['#009933'],
                }
            ];
            // this.cd.detectChanges();
        });
    }

}