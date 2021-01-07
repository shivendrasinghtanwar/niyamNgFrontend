import { Component, OnInit } from '@angular/core'
import { LocalDataSource } from 'ng2-smart-table'
import { GainBifurcationService } from '../../dataServices/Gain-Bifurcation.Service'
import { TopGainLossShareValuesOverallService } from '../../dataServices/topGainLossShareValuesOverall.service'
import { TopGainLossShareValuesOverallApiResponse } from '../../models/TopGainLossShareValuesOverallApiResponse'
import { TopGainLossShareValuesDayService } from '../../dataServices/topGainLossShareValuesDay.service'
import { NbThemeService } from '@nebular/theme'
import { AllShareValuesService } from '../../dataServices/AllShareValues.service'
import { SectorInfoService } from '../../dataServices/SectorInfo.service'
import { AllShareValuesApiResponse } from '../../models/AllShareValuesApiResponse'
import { GainBifurcationApiResponse } from '../../models/GainBifurcationApiResponse'
import {
  SectorInfoApiResponse,
  SectorInfoApiResponseRecord,
} from '../../models/SectorInfoApiResponse'
import { DatePipe } from '@angular/common'
import { TopGainLossShareValuesDayApiResponse } from '../../models/TopGainLossShareValuesDayApiResponse'
import {HistoricValuesService} from '../../dataServices/HistoricValues.service';
import {HistoricValueApiResponse} from '../../models/HistoricValueApiResponse';

@Component({
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-commerce.component.scss'],
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnInit {
  sortDate = (direction: any, a: string, b: string): number => {
    let first =
      a === 'Invalid Date'
        ? a
        : Number(new DatePipe('en-US').transform(a, 'yyyyMMdd'))
    let second =
      b === 'Invalid Date'
        ? b
        : Number(new DatePipe('en-US').transform(b, 'yyyyMMdd'))

    if (first < second) {
      return -1 * direction
    }
    if (first > second) {
      return direction
    }
    return 0
  }

  // Historic Values
  historicValuesChartOptions: any = {};
  historicValuesChartData: any = {};

  // Gain - Loss
  gainOverallRecords: LocalDataSource = new LocalDataSource()
  lossOverallRecords: LocalDataSource = new LocalDataSource()
  gainDailyRecords: LocalDataSource = new LocalDataSource()
  lossDailyRecords: LocalDataSource = new LocalDataSource()
  gainLossTableSettings = {
    columns: {
      // no: {
      //   title: 'N',
      //   width: '5%'
      // },
      date: {
        title: 'Date',
        width: '20%',
        filter: false,
        sortDirection: 'desc',
        compareFunction: this.sortDate,
        valuePrepareFunction: (date) => {
          if (date === 'Invalid Date') {
            return date
          }
          return new DatePipe('en-US').transform(date)
        },
      },
      company: {
        title: 'Company',
        filter: false,
      },
      cmp: {
        title: 'CMP',
        filter: false,
      },
      gain_percent: {
        title: 'Gain %',
        width: '10%',
        valuePrepareFunction: (value) => (value ? value.toFixed(2) : value),
        filter: false,
      },
      /* rec_price: {
        title: 'Rec price',
        width: '10%'
      },
     */ sector: {
        title: 'Sector',
        filter: false,
      },
    },
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  }

  // All Share
  allShareValuesRecords: LocalDataSource = new LocalDataSource()
  allShareTableSettings = {
    columns: {
      date: {
        title: 'Date',
        width: '15%',
        filter: false,
        sortDirection: 'desc',
        compareFunction: this.sortDate,
        valuePrepareFunction: (date) => {
          if (date === 'Invalid Date') {
            return date
          }
          return new DatePipe('en-US').transform(date)
        },
      },
      company: {
        title: 'Company',
        filter: false,
      },
      cmp: {
        title: 'CMP',
        valuePrepareFunction: (value) => value.toFixed(2),
        filter: false,
      },
      gain_percent: {
        title: 'Gain %',
        width: '10%',
        filter: false,
        valuePrepareFunction: (value) => value.toFixed(2),
      },
      rec_price: {
        title: 'Rec price',
        width: '15%',
        filter: false,
      },
      sector: {
        title: 'Sector',
        filter: false,
      },
    },
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  }

  //Bifurcation
  bifurcationResults = [{ name: '', value: 0 }]
  showBifurcationLegend = true
  showXAxis = true
  showYAxis = true

  bifurcationPieResults = [{ name: '', value: 0 }]

  //Sector info
  sectorInfoResults = [{ name: '', value: 0 }]

  themeSubscription: any

  results = [
    { name: 'Germany', value: 8940 },
    { name: 'USA', value: 5000 },
    { name: 'France', value: 7200 },
  ]
  showLegend = true
  showLabels = true
  colorScheme: any
  legendPosition = 'right'
  view: number[]
  constructor(
    private gainBifurcationService: GainBifurcationService,
    private allShareValuesService: AllShareValuesService,
    private sectorInfoService: SectorInfoService,
    private historicValuesService: HistoricValuesService,
    private topGainLossShareValuesOverallService: TopGainLossShareValuesOverallService,
    private topGainLossShareValuesDayService: TopGainLossShareValuesDayService,
    private theme: NbThemeService
  ) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables
      this.colorScheme = {
        domain: [
          colors.primaryLight,
          colors.infoLight,
          colors.successLight,
          colors.warningLight,
          colors.dangerLight,
        ],
      }
    })
  }
  commonTooltipData =
    'Some of the stocks may have been fallen only after achieving the desired target price or giving 35% returns. Therefore please check the date of the ideas suggested and High made subsequent to the suggestion.'
  ngOnInit() {
    this.getAllTopGainLossShareValuesOverall()
    this.getAllTopGainLossShareValuesDaily()
    this.getAllShareValues()
    this.getBifurcationData()
    this.getSectorInfo()
    this.getHistoricValues()
    this.setHistoricValuesChartOptions()
  }

  /**
   * Top Gain Loss Share Values Overall
   */
  getAllTopGainLossShareValuesOverall() {
    this.topGainLossShareValuesOverallService
      .getTopGainLossShareValuesOverall()
      .subscribe(
        (response: TopGainLossShareValuesOverallApiResponse) => {
          this.gainOverallRecords = new LocalDataSource(
            response.res.topGainLossShareValuesOverallGain
          )
          this.lossOverallRecords = new LocalDataSource(
            response.res.topGainLossShareValuesOverallLoss
          )
        },
        (error) => {
          console.log(error)
        }
      )
  }

  /**
   * Top Gain Loss Share Values Daily
   */
  getAllTopGainLossShareValuesDaily() {
    this.topGainLossShareValuesDayService
      .getTopGainLossShareValuesDay()
      .subscribe(
        (response: TopGainLossShareValuesDayApiResponse) => {
          this.gainDailyRecords = new LocalDataSource(
            response.res.topGainLossShareValuesDayGain
          )
          this.lossDailyRecords = new LocalDataSource(
            response.res.topGainLossShareValuesDayLoss
          )
        },
        (error) => {
          console.log(error)
        }
      )
  }

  /**
   * All Share values
   */
  getAllShareValues() {
    this.allShareValuesService.getAll().subscribe(
      (response: AllShareValuesApiResponse) => {
        this.allShareValuesRecords = new LocalDataSource(response.res)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  /**
   * Bifurcation
   */
  getBifurcationData() {
    this.gainBifurcationService.getGainBifurcation().subscribe(
      (response: GainBifurcationApiResponse) => {
        this.mapBifurcationData(response.res)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  mapBifurcationData(response) {
    this.bifurcationResults = []
    Object.entries(response.gainBifercationpieOne || {}).forEach(
      ([key, value]) => {
        this.bifurcationResults.push({
          name: key,
          value: <number>(<any>value.toString()),
        })
      }
    )
    this.bifurcationPieResults = []
    Object.entries(response.gainBifercationpieTwo || {}).forEach(
      ([key, value]) => {
        this.bifurcationPieResults.push({
          name: key,
          value: <number>(<any>value.toString()),
        })
      }
    )
  }

  /**
   * Sector info
   */
  getSectorInfo() {
    this.sectorInfoService.getAll().subscribe(
      (response: SectorInfoApiResponse) => {
        this.mapSectorInfo(response.res)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  /**
   * Historic Values
   */
  getHistoricValues() {
    this.historicValuesService.getAll().subscribe(
      (response: HistoricValueApiResponse) => {
        console.log('HistoricValues --',response.res)
        this.mapSectorInfo(response.res)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 3.33, 300]
  }

  mapSectorInfo(response) {
    this.sectorInfoResults = []
    response.forEach((value: SectorInfoApiResponseRecord) => {
      this.sectorInfoResults.push({
        name: value.sector.toString(),
        value: <number>(<any>value.numberOfCompany.toString()),
      })
    })
  }

  setHistoricValuesChartOptions() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.historicValuesChartOptions = {
        backgroundColor: echarts.bg,
        color: [colors.success, colors.info],
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: ['2015 Precipitation', '2016 Precipitation'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors.info,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    'Precipitation  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: [
              '2016-1',
              '2016-2',
              '2016-3',
              '2016-4',
              '2016-5',
              '2016-6',
              '2016-7',
              '2016-8',
              '2016-9',
              '2016-10',
              '2016-11',
              '2016-12',
            ],
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors.success,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    'Precipitation  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: [
              '2015-1',
              '2015-2',
              '2015-3',
              '2015-4',
              '2015-5',
              '2015-6',
              '2015-7',
              '2015-8',
              '2015-9',
              '2015-10',
              '2015-11',
              '2015-12',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: '2015 Precipitation',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          },
          {
            name: '2016 Precipitation',
            type: 'line',
            smooth: true,
            data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7],
          },
        ],
      };
    });
  }
}
