import { Component } from '@angular/core';
import { IApiEndpoints } from './models/api-endpoints';
import { IHitApi, RequestMethod } from './models/global';
import { GlobalService } from './services/global.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'myProject';

  constructor(private globalService: GlobalService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const api: IHitApi = {
      url: `${IApiEndpoints.DATA}`,
      input: {},
      requestMethod: RequestMethod.GET,
      response: (res: any) => {},
    };
    this.globalService.hitApi(api);
  }
}
