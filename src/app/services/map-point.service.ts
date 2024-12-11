import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MapPoint {
  id: number;
  name: string;
  way: { type: string; coordinates: [number, number] };
}

export interface MapRequest {
  latitude: number;
  longitude: number;
  name: string;
  zoom: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapPointService {
  private apiUrl = 'http://localhost:8080/api/points';

  constructor(private http: HttpClient) {}

  getAllPoints(): Observable<MapPoint[]> {    
    return this.http.get<MapPoint[]>(this.apiUrl);
  }

  getNearbyPoints(lat: number, lon: number, distance: number): Observable<MapPoint[]> {
    return this.http.get<MapPoint[]>(`${this.apiUrl}/nearby`, {
      params: { lat: lat.toString(), lon: lon.toString(), distance: distance.toString() }
    });
  }

  gerarMapa(coordenadas: any[]): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/gerar`, coordenadas, {
      headers,
      responseType: 'blob'  // Resposta como arquivo
    });
  }
}