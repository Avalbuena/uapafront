import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

type Depto = { id: number; nombre: string };

@Component({
  selector: 'app-departamento-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departamento-select.component.html'
})
export class DepartamentoSelectComponent {
  departamentos: Depto[] = [];
  @Output() selected = new EventEmitter<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const params = new HttpParams().set('domainId', '1');
    this.http.get<any>(`${environment.apiBaseUrl}/departamentos`, { params })
      .subscribe(resp => {
        const list = Array.isArray(resp) ? resp : (resp?.items ?? resp?.data ?? []);
        this.departamentos = list.map((x: any) => ({
          id: x.id ?? x.deptoId ?? x.codigo ?? x.Id ?? 0,
          nombre: x.nombre ?? x.name ?? x.descripcion ?? x.Nombre ?? ''
        }));
      });
  }

  onSelect(e: Event) {
    const id = Number((e.target as HTMLSelectElement).value);
    this.selected.emit(id);
  }
}
