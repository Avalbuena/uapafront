import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

type Depto = { id: number; nombre: string }; // ajusta si tus campos reales son otros

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

  ngOnInit(): void {
    this.cargarDepartamentos(1); // domainId fijo por ahora
  }

  cargarDepartamentos(domainId: number) {
    this.loading = true;
    this.error = null;

    const params = new HttpParams().set('domainId', String(domainId));

    this.http.get<any>('http://localhost:5077/api/departamentos', { params })
      .subscribe({
        next: (resp) => {
          console.debug('[DEPTOS] status OK, respuesta cruda:', resp);

          // Normaliza: array directo o envuelto
          let list: any[] = [];
          if (Array.isArray(resp)) list = resp;
          else if (Array.isArray(resp?.items)) list = resp.items;
          else if (Array.isArray(resp?.data)) list = resp.data;
          else {
            console.warn('[DEPTOS] No encontré array en resp, resp.items ni resp.data');
          }

          // Mapea a la forma {id, nombre}. Ajusta los campos si son distintos.
          this.departamentos = list.map((x: any) => ({
            id: x.id ?? x.deptoId ?? x.codigo ?? x.Id ?? 0,
            nombre: x.nombre ?? x.name ?? x.descripcion ?? x.Nombre ?? ''
          }));

          console.debug('[DEPTOS] normalizados:', this.departamentos);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? `Error cargando departamentos (status ${err?.status ?? '??'})`;
          console.error('[DEPTOS] ERROR:', err);

        }
      });
  }

  onSelect(e: Event) {
    const id = Number((e.target as HTMLSelectElement).value);
    this.change.emit(id);
  }
}
