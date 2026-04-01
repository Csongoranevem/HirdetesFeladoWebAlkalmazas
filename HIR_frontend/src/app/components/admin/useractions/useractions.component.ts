import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-useractions',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './useractions.component.html',
  styleUrl: './useractions.component.scss'
})
export class UseractionsComponent implements OnInit {
  users: any[] = [];
  loading = false;

  confirmVisible = false;
  confirmAction: 'ban' | 'unban' | null = null;
  selectedUser: any | null = null;
  saving = false;

  private currentUserId: string | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const me: any = this.auth.GetLoggedUser();
    this.currentUserId = me?.id ?? null;
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.api.selectAll('users').subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'A felhasználók betöltése nem sikerült.'
        });
      },
    });
  }

  isAdminUser(user: any): boolean {
    return user?.role_id === 1;
  }

  isBanned(user: any): boolean {
    // In backend model: status 1 = active, 0 = banned/inactive
    return user?.status === 0;
  }

  canBanOrUnban(target: any): { ok: boolean; reason?: string } {
    if (!target) return { ok: false, reason: 'Nincs kiválasztott felhasználó.' };
    if (!this.auth.isAdmin()) return { ok: false, reason: 'Nincs jogosultságod ehhez.' };
    if (this.currentUserId && target.id === this.currentUserId) {
      return { ok: false, reason: 'Saját magadat nem tilthatod ki.' };
    }
    // Two admins cannot ban each other
    if (this.isAdminUser(target)) {
      return { ok: false, reason: 'Admin felhasználót nem tilthatsz ki.' };
    }
    return { ok: true };
  }

  openConfirmBan(user: any) {
    const check = this.canBanOrUnban(user);
    if (!check.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Nem engedélyezett', detail: check.reason });
      return;
    }
    this.selectedUser = user;
    this.confirmAction = 'ban';
    this.confirmVisible = true;
  }

  openConfirmUnban(user: any) {
    const check = this.canBanOrUnban(user);
    if (!check.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Nem engedélyezett', detail: check.reason });
      return;
    }
    this.selectedUser = user;
    this.confirmAction = 'unban';
    this.confirmVisible = true;
  }

  cancelConfirm() {
    this.confirmVisible = false;
    this.confirmAction = null;
    this.selectedUser = null;
  }

  confirmSave() {
    if (!this.selectedUser || !this.confirmAction) return;

    const check = this.canBanOrUnban(this.selectedUser);
    if (!check.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Nem engedélyezett', detail: check.reason });
      this.cancelConfirm();
      return;
    }

    const newStatus = this.confirmAction === 'ban' ? 0 : 1;
    this.saving = true;

    this.api.update('users', this.selectedUser.id, { status: newStatus }).subscribe({
      next: (updated: any) => {
        // Update in-place to avoid full reload
        const idx = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (idx >= 0) this.users[idx] = updated;

        this.messageService.add({
          severity: 'success',
          summary: 'Siker',
          detail: this.confirmAction === 'ban' ? 'Felhasználó kitiltva.' : 'Felhasználó visszaállítva.'
        });

        this.saving = false;
        this.cancelConfirm();
      },
      error: () => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'A művelet nem sikerült.'
        });
      },
    });
  }

  statusLabel(user: any): string {
    return this.isBanned(user) ? 'Kitiltva' : 'Aktív';
  }

  statusSeverity(user: any): 'success' | 'danger' {
    return this.isBanned(user) ? 'danger' : 'success';
  }

  roleLabel(user: any): string {
    return this.isAdminUser(user) ? 'Admin' : 'Felhasználó';
  }
}
