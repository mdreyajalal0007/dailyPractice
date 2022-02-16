import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { IApiEndpoints } from '../models/api-endpoints';
import * as moment from 'moment';

import { IFormGenerator, IHitApi, RequestMethod } from '../models/global';

@Injectable({
  providedIn: 'root',
})
export class GlobalService implements OnDestroy {
  private subscriptions = new SubSink();

  loaderStatus = new BehaviorSubject(false);

  constructor(
    private httpService: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private routerService: Router
  ) {}

  hitApi(apiParams: IHitApi) {
    let headers: HttpHeaders = new HttpHeaders();

    if (!apiParams.ignoreBaseUrl) {
      apiParams.url = environment.baseUrl + apiParams.url;
    }

    if (!apiParams.ignoreToken) {
      console.log('adding token');
      headers = headers.append('Authorization', `Bearer ${this.getToken()}`);
      headers = headers.append('Content-type', `application/json`);
    }

    let apiSusbscription: Observable<Object>;

    if (apiParams.requestMethod === RequestMethod.GET) {
      apiSusbscription = this.httpService.get(apiParams.url, { headers });
    } else if (apiParams.requestMethod === RequestMethod.PUT) {
      apiSusbscription = this.httpService.put(apiParams.url, apiParams.input, {
        headers,
      });
    } else if (apiParams.requestMethod === RequestMethod.DELETE) {
      apiSusbscription = this.httpService.delete(apiParams.url, { headers });
    } else {
      apiSusbscription = this.httpService.post(apiParams.url, apiParams.input, {
        headers,
      });
    }

    if (!apiParams.hideLoader) {
      this.startLoader();
    }

    this.subscriptions.sink = apiSusbscription.subscribe({
      next: (response) => {
        this.stopLoader();
        apiParams.response(response);
        this.handleAfterResponse(apiParams, response);
      },
      error: (error) => {
        apiParams.errorFunction ? apiParams.errorFunction(error) : '';
        this.handleError(apiParams, error);
        this.stopLoader();
      },
      complete: () => {
        apiParams.endFunction ? apiParams.endFunction() : '';
        this.stopLoader();
      },
    });
  }

  handleAfterResponse(apiParams: IHitApi, response: any) {
    if (apiParams.hideResponseMsg) {
      return;
    }
    if (response) {
      if (response['message']) {
        this.showSuccessMessage(response['message']);
        if (response.result.message) {
          this.showSuccessMessage(response.result['message']);
        }
      }
    }
  }

  handleError(apiParams: IHitApi, error: any) {
    if (error) {
      this.showErrorMessage(
        error['error']['message'] ? error['error']['message'] : error['error']
      );
    }
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  formGroupGnerator(formInput: IFormGenerator): FormGroup {
    const formControls = {} as any;
    formInput.fields.map((field) => {
      formControls[field.fieldName] = new FormControl(
        field.value ? field.value : '',
        field.validations ? field.validations : []
      );
    });

    return new FormGroup(formControls);
  }

  showErrorMessage(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snack-error'];
    config.duration = 3000;
    this._snackBar.open(message, '', config);
  }

  showSuccessMessage(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snack-success'];
    config.duration = 3000;
    this._snackBar.open(message, '', config);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  logOut() {
    localStorage.removeItem('USER_DATA');
    this.router.navigate(['/']);
  }

  getToken() {
    if (this.getUserData()) {
      console.log(this.getUserData().access_token);
      return this.getUserData().access_token;
    } else {
      return null;
    }
  }

  startLoader() {
    this.loaderStatus.next(true);
  }

  stopLoader() {
    this.loaderStatus.next(false);
  }

  route(routeName: String) {
    this.routerService.navigate([routeName]);
  }

  handleLoginData(data: Object) {
    localStorage.setItem('USER_DATA', JSON.stringify(data));
  }

  getUserId() {
    if (this.getUserData()) {
      return this.getUserData()._id;
    } else {
      return null;
    }
  }

  getUserData() {
    const data = localStorage.getItem('USER_DATA');

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
  formatDate(date: any) {
    return date ? moment(date).format('DD-MM-YYYY hh:mm:ss') : null;
  }
}
