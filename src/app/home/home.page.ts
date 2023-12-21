import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage implements OnInit {
  searchTerm: string = '';
  contentType: string = 'film'; // Výchozí hodnota pro filtrování (můžete změnit podle potřeby)
  streamUrl: string = '';
  availabilityMessage: string = '';
  searchData: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    
  }

  search() {
   
    this.loadData(this.searchTerm, this.contentType);
  }

  loadData(title: string, year: string | undefined) {
    // If year is undefined, use firstAirYear
    const searchYear = year ? year : 'firstAirYear';
  
    this.apiService.getData(title, searchYear, this.contentType).subscribe(
      (data) => {
        // Check if the 'result' property is an array
        if (Array.isArray(data.result)) {
          // Assign the 'result' property to searchData
          this.searchData = data.result;
  
          console.log("Received data:", this.searchData);

          this.searchData = data.result.filter((item: { streamingInfo: { us: string | any[]; }; }) =>
            item.streamingInfo && item.streamingInfo.us && item.streamingInfo.us.length > 0
          );
  
          // Log title, year, and creators (fallback to directors) from each item in the API response
          this.searchData.forEach(item => {
            console.log("Title:", item.title);
            console.log("Year:", item.year || item.firstAirYear);
            const directorsOrCreators = item.directors || item.creators || "N/A";
            console.log("Directors/Creators:", directorsOrCreators);
  
            // Extract unique services with their links
            const servicesSet = new Set(item.streamingInfo?.us.map((stream: any) => stream.service));
            item.uniqueServices = Array.from(servicesSet).map(service => {
              const serviceData = item.streamingInfo?.us.find((stream: any) => stream.service === service);
              return { name: service, url: serviceData?.link };
            });
            console.log("Available On:", item.uniqueServices.map((service: { name: any; }) => service.name).join(', '));
          });
        } else {
          console.log("Invalid 'result' property structure:", data.result);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
}

  
