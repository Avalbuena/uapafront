import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { MunicipiosService, Municipio } from './core/data/municipios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentYear = new Date().getFullYear();

  // login
  loading = false;
  error: string | null = null;
  isLoggedIn = false;

  // filtros/listado
  selectedDeptoId: number | null = null;
  q = '';
  page = 1;
  pageSize = 10;
  total = 0;
  rows: Municipio[] = [];
  loadingMunicipios = false;

  // para el template
  get totalPages(): number { return Math.max(1, Math.ceil(this.total / this.pageSize)); }

  constructor(
    private auth: AuthService,
    private router: Router,
    private municipios: MunicipiosService
  ) {}

  // login
  onSubmit(creds: { username: string; password: string }) {
    this.loading = true; this.error = null;
    this.auth.login({ username: creds.username, password: creds.password }).subscribe({
      next: () => { this.loading = false; this.isLoggedIn = true; },
      error: (err) => { this.loading = false; this.error = err?.error?.message ?? 'Credenciales inválidas'; }
    });
  }

  // recibe ID numérico desde el select (evento 'selected')
  onDepartamentoChange(id: number) {
    this.selectedDeptoId = Number(id);
    this.page = 1; this.rows = []; this.total = 0;
  }

  buscar() {
    if (!this.selectedDeptoId) return;
    this.cargarMunicipios();
  }

  nextPage() {
    if (this.page * this.pageSize >= this.total) return;
    this.page++; this.cargarMunicipios();
  }
  prevPage() {
    if (this.page === 1) return;
    this.page--; this.cargarMunicipios();
  }

  private cargarMunicipios() {
    if (!this.selectedDeptoId) return;
    this.loadingMunicipios = true;
    this.municipios.get(this.selectedDeptoId, this.page, this.pageSize, this.q)
      .subscribe({
        next: res => { this.rows = res.items; this.total = res.total; this.loadingMunicipios = false; },
        error: err => { this.loadingMunicipios = false; console.error('[Municipios] error', err); }
      });
  }
}
