import { Component, inject, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs';
import { VideoInfo, Crop, StatusName, Classification } from '../../../models/video-model';
import { VideoService } from '../../../services/video.service';

type Tab = 'original' | 'dw' | 'ew' | 'dem' | 'clf';
const CROPS_PER_PAGE = 20;

@Component({
  selector: 'app-video-detail',
  imports: [DatePipe, DecimalPipe, MatIconModule],
  templateUrl: './video-detail.html',
  styleUrl: './video-detail.css',
})
export class VideoDetail implements OnInit, AfterViewChecked {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly videoService = inject(VideoService);
  private readonly sanitizer = inject(DomSanitizer);

  @ViewChild('origVideo') private origVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('dwVideo') private dwVideoRef?: ElementRef<HTMLVideoElement>;

  private origSrcSet = false;

  videoId!: number;
  info: VideoInfo | null = null;
  isLoading = true;
  loadError = '';
  activeTab: Tab = 'original';

  ewCrops: Crop[] = [];
  ewTotal = 0;
  ewPage = 0;
  ewLoading = false;
  ewLoaded = false;
  ewError = '';

  demCrops: Crop[] = [];
  demTotal = 0;
  demPage = 0;
  demLoading = false;
  demLoaded = false;
  demError = '';

  ngOnInit() {
    this.videoId = Number(this.route.snapshot.paramMap.get('id'));
    this.videoService.getVideoInfo(this.videoId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: info => (this.info = info),
        error: err => {
          this.loadError = err.error?.detail ?? 'No se pudo cargar la información del vídeo.';
        },
      });
  }

  ngAfterViewChecked() {
    if (!this.origSrcSet && this.origVideoRef?.nativeElement) {
      this.origSrcSet = true;
      const el = this.origVideoRef.nativeElement;
      el.src = this.videoService.getVideoUrl(this.videoId);
      el.load();
    }
  }

  private applyVideoSrc(tab: 'original' | 'dw') {
    if (tab === 'original' && this.origVideoRef?.nativeElement) {
      const el = this.origVideoRef.nativeElement;
      el.src = this.videoService.getVideoUrl(this.videoId);
      el.load();
    }
    if (tab === 'dw' && this.dwVideoRef?.nativeElement) {
      const el = this.dwVideoRef.nativeElement;
      el.src = this.videoService.getDwStreamUrl(this.videoId);
      el.load();
    }
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'dw') {
      setTimeout(() => this.applyVideoSrc('dw'));
    }
    if (tab === 'ew' && !this.ewLoaded && this.info?.ew.available) {
      this.loadEwCrops(0);
    }
    if (tab === 'dem' && !this.demLoaded && this.info?.dem.available) {
      this.loadDemCrops(0);
    }
  }

  loadEwCrops(page: number) {
    this.ewPage = page;
    this.ewLoading = true;
    this.ewError = '';
    this.videoService.getEwCrops(this.videoId, page * CROPS_PER_PAGE, CROPS_PER_PAGE)
      .pipe(finalize(() => (this.ewLoading = false)))
      .subscribe({
        next: res => {
          this.ewCrops = res.crops;
          this.ewTotal = res.total;
          this.ewLoaded = true;
        },
        error: err => {
          this.ewError = err.error?.detail ?? 'Error al cargar los recortes EW.';
          this.ewLoaded = false;
        },
      });
  }

  loadDemCrops(page: number) {
    this.demPage = page;
    this.demLoading = true;
    this.demError = '';
    this.videoService.getDemCrops(this.videoId, page * CROPS_PER_PAGE, CROPS_PER_PAGE)
      .pipe(finalize(() => (this.demLoading = false)))
      .subscribe({
        next: res => {
          this.demCrops = res.crops;
          this.demTotal = res.total;
          this.demLoaded = true;
        },
        error: err => {
          this.demError = err.error?.detail ?? 'Error al cargar los recortes DEM.';
          this.demLoaded = false;
        },
      });
  }

  get thumbnailUrl(): SafeUrl | null {
    if (!this.info?.thumbnail) return null;
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/jpeg;base64,${this.info.thumbnail}`
    );
  }

  get ewTotalPages(): number {
    return Math.ceil(this.ewTotal / CROPS_PER_PAGE);
  }

  get demTotalPages(): number {
    return Math.ceil(this.demTotal / CROPS_PER_PAGE);
  }

  getPaginatorPages(currentPage: number, totalPages: number): (number | null)[] {
    if (totalPages <= 1) return [];
    const delta = 5;
    const pages = new Set<number>();
    pages.add(0);
    pages.add(totalPages - 1);
    for (let i = Math.max(0, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.add(i);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | null)[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null);
      result.push(sorted[i]);
    }
    return result;
  }

  get clfEntries(): { name: string; count: number; percentage: number; avg_confidence: number }[] {
    const clf = this.info?.classification;
    if (!clf) return [];
    return Object.entries(clf.classes)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  get statusClass(): string {
    const s = this.info?.status.status_name;
    if (s === 'error') return 'status-error';
    if (s === 'processed') return 'status-ok';
    if (s?.startsWith('processing_')) return 'status-processing';
    return 'status-pending';
  }

  get statusIcon(): string {
    const s = this.info?.status.status_name;
    if (s === 'error') return 'error';
    if (s === 'processed') return 'check_circle';
    if (s?.startsWith('processing_')) return 'autorenew';
    return 'schedule';
  }

  get unavailableIcon(): string {
    const s = this.info?.status.status_name;
    if (s === 'error') return 'error_outline';
    if (s?.startsWith('processing_')) return 'autorenew';
    return 'hourglass_empty';
  }

  getStatusLabel(status: StatusName): string {
    const labels: Record<StatusName, string> = {
      error: 'Error',
      unprocessed: 'Sin procesar',
      processing_0: 'Iniciando procesamiento',
      processing_dw: 'Detectando rorcuales',
      processing_ew: 'Recortando rorcuales',
      processing_dem: 'Extrayendo marcas dorsales',
      processed: 'Procesado',
    };
    return labels[status] ?? status;
  }

  getUnavailableMessage(): string {
    const s = this.info?.status.status_name;
    if (s === 'error') return 'Ocurrió un error durante el procesamiento.';
    if (s === 'unprocessed') return 'El vídeo aún no ha sido procesado.';
    if (s?.startsWith('processing_')) return 'El análisis está en curso, vuelve más tarde.';
    return 'Datos no disponibles.';
  }

  goBack() {
    this.location.back();
  }
}
