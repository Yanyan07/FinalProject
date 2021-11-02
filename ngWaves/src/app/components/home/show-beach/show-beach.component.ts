import { Component, OnInit } from '@angular/core';
import { Beach } from 'src/app/models/beach';
import { Report } from 'src/app/models/report';
import { Weather } from 'src/app/models/weather';
import { AuthService } from 'src/app/services/auth.service';
import { BeachService } from 'src/app/services/beach.service';
import { ReportService } from 'src/app/services/report.service';
import { WeatherService } from 'src/app/services/weather.service';
import { CreateWeatherComponent } from '../../create/create-weather/create-weather.component';

@Component({
  selector: 'app-show-beach',
  templateUrl: './show-beach.component.html',
  styleUrls: ['./show-beach.component.css']
})
export class ShowBeachComponent implements OnInit {
  isLogin: boolean = false;

  ngOnInit(): void {
    this.reloadBeaches();
    this.reloadReports();
    this.isLogin = this.authService.checkLogin();
    // this.reloadWeatherPosts();
  }

  title = 'ngBeach';

  beaches: Beach[] = [];
  reports: Report[] = [];
  // posts: Weather[] = [];
  thisBeachPosts: Weather [] = [];
  selected: Beach | null = null;
  newBeach: Beach | null = new Beach();
  editBeach: Beach | null = null;
  report: Report | null = null;
  newWeather: Weather = new Weather();
  editWeather: Weather | null = null;
  newReport: Report = new Report();
  editReport: Report | null = null;
  beachReports: Report | null = null;
  isFavorite: boolean = false;

  constructor(private beachService: BeachService,
    private reportService: ReportService,
    private authService: AuthService,
    private weatherService: WeatherService,
    )
    {

    }

  reloadBeaches(): void {
    this.beachService.index().subscribe(
      beachList => {
        this.beaches = beachList;
        // this.reloadWeatherPosts();
      },
      fail => {
        console.error('homeComponent.reloadBeachess(): error getting beach list');
        console.log(fail);
      }
    );
  }

  displayBeach(beach: Beach): void {
    this.authService.getFavorites().subscribe(
      beachList => {
        this.selected = beach;
        this.reloadWeatherPosts();
        console.log("this beach's id:" + this.selected.id);
        this.isFavorite = false;
        beachList.forEach(b => {
          if(b.id === this.selected?.id){
            this.isFavorite = true;
          }
        });
      },
      fail => {
        console.error('homeComponent.reloadBeachess(): error getting beach list');
        console.log(fail);
      }
    );
  }
  toggleFavorite(): void {

  }

  displayBeaches(){
    this.selected = null;
    this.thisBeachPosts = [];
  }
  // Location Section

  getLocation(){
    if(this.selected){
      this.selected.location.id
    }
  }


  // Weather Section
  reloadWeatherPosts(): void {
    if(this.selected){
      this.weatherService.beachWeather(this.selected.id).subscribe(
        (weatherList) => {
          this.thisBeachPosts = weatherList;
          // this.posts = weatherList;
          // console.log(this.selected);
          //   this.posts.forEach(element => {
          //     console.log(element);
          //     if(this.selected){
          //       if(element.beach.id == this.selected.id){
          //         this.thisBeachPosts.push(element);
          //       }
          //     }
          //   });
        },
        (fail) => {
          console.error('Component.reloadWeather(): error getting Weather posts');
          console.error(fail);
        }
      );
    }
  }


  addWeather(weather: Weather) {
    if(this.selected){
    this.newWeather.beach = this.selected;
    console.log('Adding Weather'+this.newWeather);
    console.log(JSON.stringify(this.newWeather));
      this.weatherService.create(this.newWeather, this.selected.id).subscribe(
        (newTo): void => {

          this.reloadWeatherPosts();
          this.newWeather= weather;
        },
        (nojoy) => {
          console.error('Error creating Weather Post');
          console.error(nojoy);
        }
      );
    }
  }

  //Report Section

  setEditReport() {
    this.editReport = Object.assign({}, this.beachReports);
  }

  displayTable() {
    this.beachReports = null;
  }

  getReportCount(): number {
    return this.reports.length;
    // return this.incompletePipe.transform(this.todos).length;
  }

  displayReport(reports : Report) {
    this.beachReports = reports;
  }

  reloadReports(): void {
    this.reportService.index().subscribe(
      (reportList) => {
        this.reports = reportList;
      },
      (fail) => {
        console.error('Component.reloadReport(): error getting report posts');
        console.error(fail);
      }
    );
  }

  addReport(report: Report) {
    console.log('Adding Report'+this.newReport);
    console.log(JSON.stringify(this.newReport));
    this.reportService.create(this.newReport).subscribe(
      (newTo): void => {

        // this.newReport.created =
        this.reloadReports();
        this.newReport= report;
      },
      (nojoy) => {
        console.error('Error creating Report Post');
        console.error(nojoy);
      }
    );
  }

  updateReport(report: Report, showReport = true): void {
    this.reportService.update(report).subscribe(
      (updated) => {
        this.reloadReports();
        this.editReport = null;
        // this.beachReports = updated;
      },
      (fail) => {
        console.error('Error updating Report Post');
        console.error(fail);
      }
    );
  }

  deleteReport(id: number): void {
    this.reportService.destroy(id).subscribe(
      (good) => {
        this.reloadReports();
      },
      (evil) => {
        console.error('ListComponent.deleteReport(); error deleting report');
        console.error(evil);
      }
    );
  }
}
