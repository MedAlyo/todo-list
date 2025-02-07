import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';  
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { LoginStatusService } from '../loginstatus.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faTimes = faTimes;
  isModalVisible: boolean = false;
  currentModal: 'login' | 'register' | null = null;

  nombre_usuario = '';
  correo_electronico = '';
  password = '';
  userName: string | null = null;

  constructor(private authService: AuthService,
    private loginStatusService: LoginStatusService, 
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Load user data from localStorage if already logged in
    if (isPlatformBrowser(this.platformId)) {
      this.userName = localStorage.getItem('userName');
    }
  }
  toggleModal(modalType: 'login' | 'register' | null): void {
    this.isModalVisible = !this.isModalVisible;
    this.currentModal = modalType;
  }
  onSubmit(): void {
    if (this.currentModal === 'register') {
      this.authService.register(this.nombre_usuario, this.correo_electronico, this.password).subscribe({
        next: (response) => {
          alert('Registration successful! You can now log in.');
          this.toggleModal(null);
        },
        error: (error) => alert('Registration failed: ' + error.error.error),
      });
    } else if (this.currentModal === 'login') {
      this.authService.login(this.correo_electronico, this.password).subscribe({
        next: (response) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.user.nombre_usuario);
          }
          this.userName = response.user.nombre_usuario;
          alert('Login successful!');
          this.toggleModal(null);
          this.loginStatusService.updateLoginStatus(true); // Emit event on login
        },
        error: (error) => alert('Login failed: ' + error.error.error),
      });
    }
  }
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    }
    this.userName = null;
    this.loginStatusService.updateLoginStatus(false); // Emit event on logout
  }

}

