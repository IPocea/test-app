import { Inject, Injectable } from '@angular/core';
import { ILocalStorageConfiguration } from '@interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  //#endregion

  //#region LocalStorageBase
  itemName: string = 'test-app-local-storage';
  pageSize: string;
  //#endregion

  //#region Observables
  onChange$ = new BehaviorSubject<ILocalStorageConfiguration>(null);
  //#endregion
  constructor() {
    this.load();
  }

  //#region private methods
  private _setDefaultSettings = (): void => {};

  private _setSpecificSettings = (settings?: any): any => {
    this.pageSize = settings && settings?.pageSize ? settings.pageSize : '';
    const configuration = {};
    if (this.pageSize) {
      configuration['pageSize'] = this.pageSize;
    }
    return configuration;
  };
  //#endregion

  //#region public methods
  load() {
    const value = localStorage.getItem(this.itemName);
    if (!value) {
      this._setDefaultSettings();
      this.onChange$.next(this._setSpecificSettings());

      return;
    }

    try {
      const parsedValue = JSON.parse(value) as ILocalStorageConfiguration;
      this.onChange$.next(parsedValue);
      this._setSpecificSettings(parsedValue);
    } catch (error) {
      this.onChange$.next(this._setSpecificSettings());
      return;
    }
  }

  save() {
    const value = this.onChange$.value;
    const json = JSON.stringify(value);
    localStorage.setItem(this.itemName, json);
  }

  removeItems = (keys: string[]): void => {
    const values = this.onChange$.value;
    for (const key of keys) {
      if (values.hasOwnProperty(key)) {
        delete values[key];
      }
    }
    this.onChange$.next(values);
    this.save();
  };

  setOnChangeValue(settings: ILocalStorageConfiguration) {
    const configuration = this.onChange$.value;
    const updates = this._setSpecificSettings(settings);
    for (const key in updates) {
      configuration[key] = updates[key];
    }
    this.onChange$.next(configuration);
    this.save();
  }
  //#endregion
}
