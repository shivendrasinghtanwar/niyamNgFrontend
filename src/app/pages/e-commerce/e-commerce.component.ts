import {Component, OnInit} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {GainBifurcationService} from '../../dataServices/Gain-Bifurcation.Service';
import {TopGainLossShareValuesOverallService} from '../../dataServices/topGainLossShareValuesOverall.service';
import {TopGainLossShareValuesOverallApiResponse} from '../../models/TopGainLossShareValuesOverallApiResponse';
import {TopGainLossShareValuesDayService} from '../../dataServices/topGainLossShareValuesDay.service';
import {NbThemeService} from '@nebular/theme';

@Component({
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-commerce.component.scss'],
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnInit  {
  gainOverallRecords: LocalDataSource = new LocalDataSource();
  lossOverallRecords: LocalDataSource = new LocalDataSource();

  pieChartOptions: any;

  data: any;
  gainDailyRecords: LocalDataSource = new LocalDataSource();
  lossDailyRecords: LocalDataSource = new LocalDataSource();
  settings = {
    columns: {
      no: {
        title: 'no',
      },
      date: {
        title: 'date',
      },
      company: {
        title: 'company',
      },
      cmp: {
        title: 'cmp',
      },
      gain_percent: {
        title: 'Gain %'
      },
      rec_price: {
        title: 'Rec price'
      },
      sector: {
        title: 'Sector'
      }
    },
    actions: {
      add: false,
      delete: false,
      edit: false
    }
  };

  themeSubscription: any;

  results = [
    { name: 'Germany', value: 8940 },
    { name: 'USA', value: 5000 },
    { name: 'France', value: 7200 },
  ];
  showLegend = true;
  showLabels = true;
  colorScheme: any;
  constructor(
    private gainBifurcationService: GainBifurcationService,
    private topGainLossShareValuesOverallService: TopGainLossShareValuesOverallService,
    private topGainLossShareValuesDayService: TopGainLossShareValuesDayService,
    private theme: NbThemeService
    ) {

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
      this.data = {
        labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
        datasets: [{
          data: [300, 500, 100],
          backgroundColor: [colors.primaryLight, colors.infoLight, colors.successLight],
        }],
      };
    });
  }
  ngOnInit() {
    this.pieChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            display: false,
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
      legend: {
      },
    };
    this.topGainLossShareValuesOverallService.getTopGainLossShareValuesOverall().subscribe(
      (response: TopGainLossShareValuesOverallApiResponse) => {
        console.log(response);
        this.gainOverallRecords = new LocalDataSource(response.res.gain);
        this.lossOverallRecords = new LocalDataSource(response.res.loss);
      },
      error => {
        console.log(error);
      }
    );

    this.topGainLossShareValuesDayService.getTopGainLossShareValuesDay().subscribe(
      (response: TopGainLossShareValuesOverallApiResponse) => {
        console.log(response);
        this.gainDailyRecords = new LocalDataSource(response.res.gain);
        this.lossDailyRecords = new LocalDataSource(response.res.loss);
      },
      error => {
        console.log(error);
      }
    );
  }
}
