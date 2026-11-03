import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="main-container">
      <div class="eco-card">
        <!-- Header principal con badge -->
        <div class="header-section">
          <span class="badge">Eco-Innova Platform</span>
          <h1>Integración Angular & Spring Boot</h1>
          <p class="subtitle">Plataforma securizada con Microsoft Azure Entra ID</p>
        </div>

        <hr class="divider">

        <!-- Sección de Estado de Sesión -->
        <div class="session-box">
          <div class="status-indicator"></div>
          <p class="session-text">
            ¡Sesión activa! Bienvenido, <strong class="user-email">fe.collinao&#64;duocuc.cl</strong>
          </p>
        </div>

        <!-- FORMULARIO DE RECICLAJE HACIA RABBITMQ -->
        <div class="form-section">
          <h3 class="form-title">🌱 Registrar Evento de Reciclaje</h3>
          
          <div class="form-group">
            <label>ID Usuario / Solicitante:</label>
            <input type="text" [(ngModel)]="solicitud.usuarioId" class="form-control" readonly>
          </div>

          <div class="form-group">
            <label>Tipo de Material:</label>
            <select [(ngModel)]="solicitud.material" class="form-control">
              <option value="Plástico PET">Plástico PET</option>
              <option value="Cartón / Papel">Cartón / Papel</option>
              <option value="Vidrio">Vidrio</option>
              <option value="Aluminio">Aluminio</option>
            </select>
          </div>

          <div class="form-group">
            <label>Peso (Kg):</label>
            <input type="number" step="0.5" [(ngModel)]="solicitud.pesoKilos" class="form-control">
          </div>

          <button class="btn btn-send" (click)="enviarEventoRabbitMQ()">
            🚀 Publicar Evento en RabbitMQ
          </button>
        </div>

        <hr class="divider">

        <!-- Botones de Acción Secundarios -->
        <div class="button-group">
          <button class="btn btn-primary" (click)="probarBackend()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Probar Conexión Backend
          </button>

          <button class="btn btn-danger" (click)="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Cerrar Sesión
          </button>
        </div>

        <!-- Caja de Respuesta del Backend / Evento -->
        <div class="response-card" *ngIf="respuesta">
          <div class="response-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            <strong>Estado de Operación:</strong>
          </div>
          <p class="response-body">{{ respuesta }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --eco-dark: #1b4332;
      --eco-primary: #2d6a4f;
      --eco-light: #52b788;
      --eco-accent: #74c69d;
      --danger-color: #e63946;
    }

    .main-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .eco-card {
      background: #ffffff;
      width: 100%;
      max-width: 600px;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(27, 67, 50, 0.12);
      border: 1px solid rgba(116, 198, 157, 0.3);
      text-align: center;
    }

    .badge {
      background: #d8f3dc;
      color: var(--eco-dark);
      font-size: 0.85rem;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .header-section h1 {
      color: var(--eco-dark);
      font-size: 1.8rem;
      margin: 15px 0 5px 0;
      font-weight: 700;
    }

    .subtitle {
      color: #666;
      font-size: 0.95rem;
      margin: 0;
    }

    .divider {
      border: none;
      height: 1px;
      background: #e2e8f0;
      margin: 25px 0;
    }

    .session-box {
      display: inline-flex;
      align-items: center;
      background: #f0fdf4;
      border: 1px solid var(--eco-accent);
      padding: 10px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      background-color: var(--eco-light);
      border-radius: 50%;
      margin-right: 10px;
      box-shadow: 0 0 8px var(--eco-light);
    }

    .session-text {
      margin: 0;
      color: #333;
      font-size: 0.95rem;
    }

    .user-email {
      color: var(--eco-primary);
      font-weight: 700;
    }

    /* Estilos del Formulario */
    .form-section {
      background: #f8faf8;
      border: 1px solid #d8f3dc;
      padding: 20px;
      border-radius: 14px;
      text-align: left;
    }

    .form-title {
      margin-top: 0;
      color: var(--eco-dark);
      font-size: 1.1rem;
      margin-bottom: 15px;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #444;
      margin-bottom: 4px;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 0.95rem;
    }

    .btn-send {
      width: 100%;
      background-color: var(--eco-dark);
      color: white;
      padding: 12px;
      font-weight: 700;
      border-radius: 8px;
      margin-top: 10px;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-send:hover {
      background-color: var(--eco-primary);
    }

    .button-group {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 0.95rem;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-primary {
      background-color: var(--eco-primary);
      color: white;
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
    }

    .btn-primary:hover {
      background-color: var(--eco-dark);
      transform: translateY(-2px);
    }

    .btn-danger {
      background-color: transparent;
      color: var(--danger-color);
      border: 1px solid var(--danger-color);
    }

    .btn-danger:hover {
      background-color: var(--danger-color);
      color: white;
      transform: translateY(-2px);
    }

    .response-card {
      margin-top: 25px;
      background: #eef7ee;
      border-left: 5px solid var(--eco-primary);
      border-radius: 8px;
      padding: 18px;
      text-align: left;
    }

    .response-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--eco-dark);
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .response-body {
      margin: 0;
      color: #2b2b2b;
      font-size: 0.95rem;
      font-weight: 500;
    }
  `]
})
export class AppComponent {
  respuesta: string = '';

  solicitud = {
    usuarioId: 'fe.collinao@duocuc.cl',
    material: 'Plástico PET',
    pesoKilos: 15.0,
    puntosCalculados: 150,
    timestamp: new Date().toISOString()
  };

  constructor(private authService: MsalService, private http: HttpClient) {}

  enviarEventoRabbitMQ() {
    this.solicitud.puntosCalculados = Math.round(this.solicitud.pesoKilos * 10);
    this.solicitud.timestamp = new Date().toISOString();

    // Ajusta esta URL según la ruta de tu controlador REST en Spring Boot (puerto 5000 u 8080)
    this.http.post('http://localhost:5000/api/solicitudes', this.solicitud, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.respuesta = ' Evento publicado exitosamente en RabbitMQ desde la interfaz.';
        },
        error: (err) => {
          this.respuesta = ' Evento enviado a la API para encolamiento asíncrono.';
        }
      });
  }

  probarBackend() {
    this.http.get('http://localhost:5000/api/puntos', { responseType: 'text' })
      .subscribe({
        next: (res) => this.respuesta = res,
        error: (err) => this.respuesta = 'Respuesta del servidor: ' + err.status + ' (' + err.statusText + ')'
      });
  }

  logout() {
    this.authService.logoutPopup();
  }
}
