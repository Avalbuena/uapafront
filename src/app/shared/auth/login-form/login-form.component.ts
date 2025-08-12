import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() submitLogin = new EventEmitter<{ username: string; password: string }>();

  form = this.fb.group({
    username: ['admin', Validators.required],
    password: ['P@ssw0rd', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  submit() {
    if (this.loading || this.form.invalid) return;
    this.submitLogin.emit(this.form.getRawValue() as { username: string; password: string });
  }
}
