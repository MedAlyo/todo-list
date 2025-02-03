import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  faTimes = faTimes;

  isModalVisible: boolean = false;
  currentModal: 'login' | 'register' | null = null;

  toggleModal(modalType: 'login' | 'register' | null): void {
    this.isModalVisible = !this.isModalVisible;
    this.currentModal = modalType;
  }
  onSubmit(): void {
    // This empty because I don't have the logIn/Register logic applied
    console.log('Form submitted');
  }
}

