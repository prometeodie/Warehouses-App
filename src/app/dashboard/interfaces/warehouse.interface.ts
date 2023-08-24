import { LatLng } from "./latLng.interface";


export interface Warehouse {
  id?:     number;
  code:    number;
  name:    string;
  addres:  string;
  country?: string;
  zip?:     number;
  list:    ThingsList[];
  latLng: LatLng;
  // TODO:poner latitud y longitud como obligatoria
}

export interface ThingsList{
  cosa:string
}
