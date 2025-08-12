import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  loading = false;
  error: string | null = null;
  isLoggedIn = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(creds: { username: string; password: string }) {
    this.loading = true; this.error = null;
    this.auth.login({ username: creds.username, password: creds.password })
      .subscribe({
        next: () => { this.loading = false; this.isLoggedIn = true; },
        error: (err: any) => {
          this.loading = false;
          this.error = err?.error?.message ?? 'Credenciales inválidas';
        }
      });
  }

  onDepartamentoChange(id: number) {
    console.log('Departamento seleccionado:', id);
    // cargar municipios
  }
}
