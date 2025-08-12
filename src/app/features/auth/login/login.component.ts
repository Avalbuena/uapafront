import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from 'src/app/shared/auth/login-form/login-form.component'; // ruta de tu formulario
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent], // <<--- AQUÍ IMPORTAS EL FORMULARIO
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(creds: { username: string; password: string }) {
    this.loading = true;
    this.error = null;

    this.auth.login({ username: creds.username, password: creds.password })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl('/home'); // o la ruta que quieras después de login
        },
        error: (err: any) => {
          this.loading = false;
          this.error = err?.error?.message ?? 'Credenciales inválidas';
        }
      });
  }
}

