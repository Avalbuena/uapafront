import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

type Depto = { id: number; nombre: string }; // ajusta nombres si tu API usa otros

@Component({
  selector: 'app-departamento-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departamento-select.component.html'
})
export class DepartamentoSelectComponent {
  departamentos: Depto[] = [];
  loading = false;
  error: string | null = null;

  @Output() change = new EventEmitter<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.cargar(1); } // domainId fijo por ahora

  cargar(domainId: number) {
    this.loading = true; this.error = null;

    const params = new HttpParams().set('domainId', String(domainId));
    this.http.get<any>(`${environment.apiBaseUrl}/departamentos`, { params })
      .subscribe({
        next: (resp) => {
          // Normaliza: [] o {items:[]} o {data:[]}
          const list = Array.isArray(resp) ? resp : (resp?.items ?? resp?.data ?? []);
          this.departamentos = list.map((x: any) => ({
            id: x.id ?? x.deptoId ?? x.codigo ?? x.Id ?? 0,
            nombre: x.nombre ?? x.name ?? x.descripcion ?? x.Nombre ?? ''
          }));
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = `Error (${err?.status ?? '??'}) al cargar departamentos`;
          console.error('[DEPTOS] ERROR', err);
        }
      });
  }

  onSelect(e: Event) {
    const id = Number((e.target as HTMLSelectElement).value);
    this.change.emit(id);
  }
}
