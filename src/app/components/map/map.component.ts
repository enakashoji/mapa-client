import { Component, OnInit } from '@angular/core';
import { MapPointService, MapPoint } from '../../services/map-point.service';
import * as L from 'leaflet';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map!: L.Map;
  drawnPolygon!: L.Polygon;
  currentPoints: L.LatLng[] = [];
  desenhando = false;

  constructor(private mapPointService: MapPointService) { }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([-15.7801, -47.9292], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  iniciarDesenho(): void {
    this.desenhando = true;
    this.currentPoints = [];

    // Adiciona um listener de clique
    this.map.on('click', this.adicionarPonto.bind(this));
  }

  adicionarPonto(e: L.LeafletMouseEvent): void {
    if (!this.desenhando) {
      return;
    }

    const point = e.latlng;
    this.currentPoints.push(point);

    // Atualiza o polígono em tempo real
    if (this.drawnPolygon) {
      this.map.removeLayer(this.drawnPolygon);
    }
    this.drawnPolygon = L.polygon(this.currentPoints, { color: 'blue' }).addTo(this.map);

    console.log('Ponto Adicionado:', point);
  }

  finalizarDesenho(): void {
    if (!this.desenhando || this.currentPoints.length < 3) {
      return;
    }

    // Finaliza e exibe o polígono em verde
    if (this.drawnPolygon) {
      this.map.removeLayer(this.drawnPolygon);
    }
    this.drawnPolygon = L.polygon(this.currentPoints, { color: 'green' }).addTo(this.map);

    console.log('Polígono Final:', this.currentPoints);

    // Restaura o estado
    this.desenhando = false;

    // Remove o listener de clique
    this.map.off('click', this.adicionarPonto.bind(this));
  }

  cancelarDesenho(): void {
    console.log('Desenho Cancelado');
    this.resetarDesenho();
  }

  resetarDesenho(): void {
    // Limpa tudo
    if (this.drawnPolygon) {
      this.map.removeLayer(this.drawnPolygon);
    }
    this.desenhando = false;
    this.currentPoints = [];

    // Remove o evento de clique
    this.map.off('click', this.adicionarPonto.bind(this));
  }

  gerarMapa(): void {
    this.mapPointService.gerarMapa(this.currentPoints).subscribe({
      next: (response: Blob) => {
        saveAs(response, 'mapa.pdf');  // Alterne para "mapa.png" se for imagem
      },
      error: (err) => console.error('Erro ao gerar o mapa:', err)
    });
  }
}
