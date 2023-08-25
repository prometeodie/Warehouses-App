import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subject, BehaviorSubject } from 'rxjs';

import { environment } from 'src/assets/environments/environment';
import { MapsService } from './maps.service';
import { Place } from '../interfaces';
import { Warehouse } from '../interfaces/warehouse.interface';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  warehouses:Warehouse[] = [
    {
      "addres": "Av. Cabildo 3150, Buenos Aires, Argentina",
      "code": 1990,
      "country": " Argentina",
      "list": [
        {
          "cosa": "pony"
        },
        {
          "cosa": "buzo"
        },
        {
          "cosa": "termo"
        },
        {
          "cosa": "notebook"
        },
        {
          "cosa": "una cosa"
        },
        {
          "cosa": "otra cosa"
        },
        {
          "cosa": "3 cosas"
        }
      ],
      "name": "Example 4",
      "zip": 0,
      "latLng":
      {"lat": -34.5532333,
       "lng": -58.46502819999999},
      "id": 3
    },
    {
      "addres": "Luna, C1290 CABA, Argentina",
      "code": 2,
      "country": " Argentina",
      "list": [],
      "name": "Example 3",
      "zip": 0,
      "latLng":
       {"lat": -34.6515656,
        "lng": -58.3954412},
      "id": 1
    },
    {
      "addres": "Gral. Güemes 897, B1873BOC Avellaneda, Provincia de Buenos Aires, Argentina",
      "code": 193,
      "country": " Argentina",
      "list": [
        {
          "cosa": "auto"
        },
        {
          "cosa": "dado"
        },
        {
          "cosa": "sticker"
        },
        {
          "cosa": "monitor"
        },
        {
          "cosa": "una cosa"
        },
        {
          "cosa": "otra cosa"
        },
        {
          "cosa": "3 cosas"
        }
      ],
      "name": "Example 2",
      "zip": 0,
      "latLng":
      {"lat": -34.67442520000001,
       "lng": -58.36603030000001},
      "id":2
    },
    {
      "addres": "14 de Julio, Tandil, Provincia de Buenos Aires, Argentina",
      "code": 2894,
      "country": " Argentina",
      "list": [
        {
          "cosa": "algo"
        },
        {
          "cosa": "@los_manijas_del_Rol"
        },
        {
          "cosa": "pony"
        },
        {
          "cosa": "baldur gates 3"
        },
        {
          "cosa": "una cosa"
        },
        {
          "cosa": "avion"
        },
        {
          "cosa": "libros"
        }
      ],
      "name": "Example 1",
      "zip": 0,
      "latLng":
      {"lat": -37.3255146,
       "lng": -59.1420937},
      "id":4
    },
    {
      "addres": "Av. 9 de Julio s/n, C1043 CABA",
      "code": 5002,
      "country": " Argentina",
      "list": [
        {
          "cosa": "algo"
        },
        {
          "cosa": "@los_manijas_del_Rol"
        },
        {
          "cosa": "pony"
        },
        {
          "cosa": "baldur gates 3"
        },
        {
          "cosa": "una cosa"
        },
        {
          "cosa": "avion"
        },
        {
          "cosa": "libros"
        }
      ],
      "name": "Example 1",
      "zip": 0,
      "latLng":
      {"lat": -34.60371822949157,
       "lng":  -58.381563018541705},
      "id":5
    },
    {
      "addres": "B7600JUZ, Av. Patricio Peralta Ramos 10, B7600JUZ Mar del Plata, Provincia de Buenos Aires",
      "code": 4563,
      "country": " Argentina",
      "list": [
        {
          "cosa": "algo"
        },
        {
          "cosa": "@los_manijas_del_Rol"
        },
        {
          "cosa": "pony"
        },
        {
          "cosa": "baldur gates 3"
        },
        {
          "cosa": "una cosa"
        },
        {
          "cosa": "avion"
        },
        {
          "cosa": "libros"
        }
      ],
      "name": "Example 1",
      "zip": 0,
      "latLng":
      {"lat": -38.004343204744615,
       "lng": -57.541054182044405},
      "id":5
    },
  ]

  private http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;
  private warehouseLocation$ = new Subject<Place>();
  private mapService = inject(MapsService);
  private _warehouses$ = new BehaviorSubject<Warehouse[]>(this.warehouses)
  public WarehouseList: string[] =[];

  private get warehouses$() {
    return this._warehouses$;
  }
  private set warehouses$(value) {
    this._warehouses$ = value;
  }

  setWarehouse(warehouse: Warehouse[]) {
    this.warehouses$.next(warehouse);
  }

  getWarehouseB() {
    return this.warehouses$.asObservable();
  }

  // CRUD
  public getWarehouse(){
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`);
  }

  public getWarehouseById(id:number):Warehouse{
    const warehouse = this.warehouses.filter(warehouse =>{return warehouse.id === id})
    return warehouse[0];
  }

  public deleteWarehouse(id:number){
    let i:number;

    this.warehouses.forEach((warehouse,index)=>{
      if(warehouse.id === id){
        i = index;
      }
    })
    this.warehouses.splice(i!,1);
    return of(true);
  }

  public PostNewWarehouse(warehouse: Warehouse){
    const idWare:number = this.getId();
    const warehouseAmount = this.warehouses.length;
    const successText = 'New warehouse has been saved';
    const errorText = 'New warehouse has not been saved';
    warehouse.id = idWare;
    this.warehouses.unshift(warehouse);
    if(warehouseAmount=== this.warehouses.length){
        this.mapService.menssageScreenPopUp(errorText,'error',2000);
    }else{
      this.mapService.menssageScreenPopUp(successText,'success',2000);
      return this.setWarehouse(this.warehouses);
    }
  }

  // to add a new warehouse place
  setPlaceWarehouse(place: Place) {
    this.warehouseLocation$.next(place);
  }

  getPlaceWarehouse() {
    return this.warehouseLocation$.asObservable();
  }

  // gets the  name, location, country, formatted_address (lat, lng) from the new warehouse's addres form
  autoCompleteWarehouse(autoComplete: google.maps.places.Autocomplete):void{
    autoComplete.addListener('place_changed',()=>{

      const placeResponse = autoComplete.getPlace();

      // The country is always in the last position of this data
      const splitedInformation = placeResponse.formatted_address?.split(',');
      const countryPosition = splitedInformation?.length! -1;

      let lat:number = 0;
      let lng:number = 0;
      let place!:Place;

      if(!placeResponse.place_id) return;

      lat = placeResponse.geometry?.location.lat()!;
      lng = placeResponse.geometry?.location.lng()!;
      place  = {
         name: placeResponse.name,
          location: placeResponse.geometry?.location!,
          country: splitedInformation![countryPosition],
          formatted_address: placeResponse.formatted_address!,
       };
        this.setPlaceWarehouse(place);
    })
  }

  downloadExcel(id:number):void{

    const warehouse = this.getWarehouseById(id);
    this.exportToExcel(warehouse);
  }

  //it makes the warehouse list in an Excel file and download the file.
  exportToExcel(warehouse:Warehouse):void{
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const worksheet = XLSX.utils.json_to_sheet(warehouse.list);
    const workbook : XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
    XLSX.writeFile(workbook, `warehouse:${warehouse.name}.xlsx`)
  }

  //it transforms an Excel file in to an array
   readExcel (event:any){
    const file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      let workBook = XLSX.read(fileReader.result,{type:'binary'});
      let sheetNames = workBook.SheetNames;
      this.WarehouseList = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
    }
  }

  //it generates a random id for the new warehouses
  getId():number{

    const min = Math.ceil(1);
    const max = Math.floor(999)
    let id:number = Math.floor(Math.random() * (max - min) + min);

    this.warehouses.forEach(warehouse =>{
        if (warehouse.id === id){
          return id = this.getId();
        }
        return
    })
    return id;
  }
}
