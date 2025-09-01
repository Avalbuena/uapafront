import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

export interface Municipio { codigo: number; nombre: string; }
export interface MunPage { items: Municipio[]; total: number; }

@Injectable({ providedIn: 'root' })
export class MunicipiosService {
  private base = `${environment.apiBaseUrl}/municipios`;

  constructor(private http: HttpClient) {}

  get(departamentoId: number, page = 1, pageSize = 10, q = ''): Observable<MunPage> {
    let params = new HttpParams()
      .set('departamentoId', String(departamentoId))
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (q) params = params.set('q', q);

    return this.http.get<any>(this.base, { params }).pipe(
      map(resp => {
        const raw = Array.isArray(resp) ? resp : (resp?.items ?? resp?.data ?? resp?.results ?? []);
        const total = resp?.total ?? resp?.totalCount ?? resp?.count ?? raw.length;
        const items = raw.map((x: any) => ({
          codigo: x.codigo ?? x.id ?? x.municipioId ?? x.code ?? 0,
          nombre: x.nombre ?? x.name ?? x.descripcion ?? ''
        }));
        return { items, total };
      })
    );
  }
}

