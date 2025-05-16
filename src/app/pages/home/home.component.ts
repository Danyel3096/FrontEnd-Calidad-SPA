import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  NgbNav,
  NgbNavChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})

export class HomeComponent implements AfterViewInit {
  @ViewChild('nav', { static: true }) nav!: NgbNav;

  activeTab = 1;
  submittedUser = false;
  companyEnabled = false;

  userForm: FormGroup;
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
    });
    this.companyForm = this.fb.group({
      company: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    // Cada vez que cambie username…
    this.userForm
      .get('username')!
      .valueChanges
      .subscribe((value: string) => {
        // Si queda inválido y ya habíamos habilitado la pestaña 2:
        if (this.companyEnabled && this.userForm.invalid) {
          this.companyEnabled = false;  // inhabilita Tab 2
          this.activeTab = 1;             // vuelve al Tab 1
        }
      });
  }

  open(content: any) {
    this.activeTab = 1;
    this.submittedUser = false;
    this.companyEnabled = false;
    this.modalService
      .open(content, { size: 'lg' })
      .result.finally(() => this.resetWizard());
  }

  beforeChange(event: NgbNavChangeEvent) {
    if (event.nextId === 2 && this.userForm.invalid) {
      event.preventDefault();
      this.userForm.markAllAsTouched();
    }
  }

  goNext() {
    this.submittedUser = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.companyEnabled = true;
    this.activeTab = 2;
  }

  goPrevious() {
    // Vuelves a la pestaña 1
    this.activeTab = 1;
    // Inhabilitas la pestaña 2
    this.companyEnabled = false;
    // Opcional: ocultar mensajes de “must fill” hasta next
    this.submittedUser = false;
  }

  submitAll() {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    // …
    this.modalService.dismissAll();
  }

  private resetWizard() {
    this.userForm.reset();
    this.companyForm.reset();
    this.activeTab = 1;
    this.submittedUser = false;
    this.companyEnabled = false;
  }
}
