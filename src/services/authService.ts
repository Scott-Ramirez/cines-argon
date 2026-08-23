import { User, UserRole } from '../core/types';
import { soundService } from './soundService';

const AUTH_STORAGE_KEY = 'argon_auth_user_v1';

export interface PredefinedAccount {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  roleLabel: string;
  roleDescription: string;
  assignedTerminal: string;
  defaultPassword?: string;
  badgeColor: string;
}

export const PREDEFINED_ACCOUNTS: PredefinedAccount[] = [
  {
    id: 'usr-admin',
    name: 'Roberto Mendoza',
    username: 'admin',
    role: 'ADMIN',
    roleLabel: 'Administrador General',
    roleDescription: 'Acceso total a cartelera, programación, precios, taquilla y portería',
    assignedTerminal: 'Oficina Principal',
    defaultPassword: 'admin',
    badgeColor: 'from-amber-500 to-amber-600',
  },
  {
    id: 'usr-cajero-1',
    name: 'Camila Torres',
    username: 'cajero1',
    role: 'CASHIER',
    roleLabel: 'Cajero / Taquilla POS',
    roleDescription: 'Venta de boletos, cobro de entradas e impresión de tickets térmicos',
    assignedTerminal: 'Taquilla 1 - Principal',
    defaultPassword: '123',
    badgeColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'usr-porter-1',
    name: 'Jorge Huamán',
    username: 'porteria1',
    role: 'PORTER',
    roleLabel: 'Control de Acceso / Portería',
    roleDescription: 'Validación en puerta por lector láser USB, cámara y aforo en vivo',
    assignedTerminal: 'Puerta Principal - Salas 1 a 4',
    defaultPassword: '123',
    badgeColor: 'from-cyan-500 to-blue-600',
  },
];

class AuthService {
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(username: string, password?: string): { success: boolean; user?: User; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const account = PREDEFINED_ACCOUNTS.find(
      (acc) => acc.username.toLowerCase() === cleanUser
    );

    if (!account) {
      soundService.playError();
      return { success: false, error: 'Usuario no encontrado en el sistema.' };
    }

    if (password && account.defaultPassword && password !== account.defaultPassword) {
      soundService.playError();
      return { success: false, error: 'Contraseña incorrecta.' };
    }

    const user: User = {
      id: account.id,
      name: account.name,
      username: account.username,
      role: account.role,
      assignedTerminal: account.assignedTerminal,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('argon_auth_update', { detail: user }));
    soundService.playSuccess();
    return { success: true, user };
  }

  loginAs(account: PredefinedAccount): User {
    const user: User = {
      id: account.id,
      name: account.name,
      username: account.username,
      role: account.role,
      assignedTerminal: account.assignedTerminal,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('argon_auth_update', { detail: user }));
    soundService.playSuccess();
    return user;
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('argon_auth_update', { detail: null }));
    soundService.playWarning();
  }
}

export const authService = new AuthService();
