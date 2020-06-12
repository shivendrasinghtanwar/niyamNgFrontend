import {Component, OnInit} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {GainBifurcationService} from '../../dataServices/Gain-Bifurcation.Service';
import {TopGainLossShareValuesOverallService} from '../../dataServices/topGainLossShareValuesOverall.service';
import {TopGainLossShareValuesOverallApiResponse} from '../../models/TopGainLossShareValuesOverallApiResponse';
import {TopGainLossShareValuesDayService} from '../../dataServices/topGainLossShareValuesDay.service';
import {NbThemeService} from '@nebular/theme';
import {AllShareValuesService} from '../../dataServices/AllShareValues.service';
import {SectorInfoService} from '../../dataServices/SectorInfo.service';
import {AllShareValuesApiResponse} from '../../models/AllShareValuesApiResponse';
import {GainBifurcationApiResponse} from '../../models/GainBifurcationApiResponse';
import {SectorInfoApiResponse, SectorInfoApiResponseRecord} from '../../models/SectorInfoApiResponse';

@Component({
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-commerce.component.scss'],
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnInit  {

  // Gain - Loss
  gainOverallRecords: LocalDataSource = new LocalDataSource();
  lossOverallRecords: LocalDataSource = new LocalDataSource();
  gainDailyRecords: LocalDataSource = new LocalDataSource();
  lossDailyRecords: LocalDataSource = new LocalDataSource();
  gainLossTableSettings = {
    columns: {
      // no: {
      //   title: 'N',
      //   width: '5%'
      // },
      date: {
        title: 'Date',
        width: '10%',
        filter: false,
      },
      company: {
        title: 'Company',
        width: '10%',
        filter: false,
      },
      cmp: {
        title: 'Cmp',
        width: '10%',
        filter: false,
      },
      gain_percent: {
        title: 'Gain %',
        width: '10%',
        type: 'custom',
        filter: false,
      },
     /* rec_price: {
        title: 'Rec price',
        width: '10%'
      },
     */ sector: {
        title: 'Sector',
        width: '10%',
        filter: false,
      }
    },
    actions: {
      add: false,
      delete: false,
      edit: false
    }
  };

  // All Share
  allShareValuesRecords: LocalDataSource = new LocalDataSource();
  allShareTableSettings = {
    columns: {
      date: {width: '10px',
        title: 'Date',
        filter: false,
      },
      company: {width: '10px',
        title: 'Company',
        filter: false,
      },
      cmp: {width: '10px',
        title: 'Cmp',
        filter: false,
      },
      gain_percent: {width: '10px',
        title: 'Gain %',
        filter: false,
      },
      /*rec_price: {
        title: 'Rec price'
      },*/
      sector: {width: '15px',
        title: 'Sector',
        filter: false,
      }
    },
    actions: {
      add: false,
      delete: false,
      edit: false
    }
  };

  //Bifurcation
  bifurcationResults = [
    { name: '', value: 0 }
  ];
  showBifurcationLegend = true;
  showXAxis = true;
  showYAxis = true;

  bifurcationPieResults = [
    { name: '', value: 0 }
  ];

  //Sector info
  sectorInfoResults = [
    { name: '', value: 0 }
  ];

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
    private allShareValuesService: AllShareValuesService,
    private sectorInfoService: SectorInfoService,
    private topGainLossShareValuesOverallService: TopGainLossShareValuesOverallService,
    private topGainLossShareValuesDayService: TopGainLossShareValuesDayService,
    private theme: NbThemeService
    ) {

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
  }
  ngOnInit() {

    this.getAllTopGainLossShareValuesOverall();
    this.getAllTopGainLossShareValuesDaily();
    this.getAllShareValues();
    this.getBifurcationData();
    this.getSectorInfo();
  }

  /**
   * Top Gain Loss Share Values Overall
   */
  getAllTopGainLossShareValuesOverall() {
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
  }

  /**
   * Top Gain Loss Share Values Daily
   */
  getAllTopGainLossShareValuesDaily() {
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

  /**
   * All Share values
   */
  getAllShareValues() {
    this.allShareValuesService.getAll().subscribe(
      (response: AllShareValuesApiResponse) => {
        console.log(response);
        this.allShareValuesRecords = new LocalDataSource(response.res);
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * Bifurcation
   */
  getBifurcationData() {
    this.gainBifurcationService.getGainBifurcation().subscribe(
      (response: GainBifurcationApiResponse) => {
        console.log(response.res.pie1);
        this.mapBifurcationData(response.res);
      },
      error => {
        console.log(error);
      }
    );
  }

  mapBifurcationData(response) {
    this.bifurcationResults = [];
    console.log('Data to map', response.pie1);
    Object.entries(response.pie1).forEach(
      ([key, value]) => {
        console.log(key, value);
        this.bifurcationResults.push({
          name: key,
          value: <number><any>value.toString()
        });
      }
    );
    console.log('Data to map', response.pie2);
    this.bifurcationPieResults = [];
    Object.entries(response.pie2).forEach(
      ([key, value]) => {
        console.log('pie2');
        console.log(key, value);
        this.bifurcationPieResults.push({
          name: key,
          value: <number><any>value.toString()
        });
      }
    );
    console.log('bifurcationPieResults', this.bifurcationPieResults);
  }

  /**
   * Sector info
   */
  getSectorInfo() {
    this.sectorInfoService.getAll().subscribe(
      (response: SectorInfoApiResponse) => {
        console.log(response);
        this.mapSectorInfo(response.res);
      },
      error => {
        console.log(error);
      }
    );
  }

 mapSectorInfo(response) {
    this.sectorInfoResults = [];
    response.forEach((value: SectorInfoApiResponseRecord) => {
      this.sectorInfoResults.push({
        name: value.sector.toString(),
        value: <number><any>value.numberOfCompany.toString()
      });
    });
 }

}
