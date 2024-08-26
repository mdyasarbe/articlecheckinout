import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Article } from '../../model/article';
import { DataService } from '../../shared/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogconfirmComponent } from '../dialogconfirm/dialogconfirm.component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatSnackBar } from '@angular/material/snack-bar';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  myForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // this.createForm();
    // this.initForm();
    this.buildForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      barcode: ['', [Validators.required, Validators.minLength(6)]],
      articleCode: ['', [Validators.required, Validators.minLength(4)]],
      count: ['', [Validators.required, Validators.min(1)]],
      // address: this.fb.group({
      //   street: '',
      //   city: '',
      //   zip: ''
      // })
    });
  }

  buildForm() {
    // this.myForm = this.fb.group(this.data);
    // this.myForm.controls.address = null;
    // this.myForm.registerControl('address', this.fb.group(this.data.address));

    this.myForm = this.fb.group({
      barcode: ['', [Validators.required, Validators.minLength(6)]],
      articleCode: ['', [Validators.required, Validators.minLength(4)]],
      count: [0, [Validators.required, Validators.min(1)]],
      // address: this.fb.group({
      //   street: '',
      //   city: '',
      //   zip: ''
      // })
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.myForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    debugger;
    if (this.myForm.invalid) {
      return;
    }
    let article: Article = this.myForm.value;
    this.dataService.addArticle(article);
  }
  deleteAll() {
    this.openDeleteConfirmationDialog();
  }

  openDeleteConfirmationDialog() {
    const dialogRef = this.dialog.open(DialogconfirmComponent, {
      width: '300px',
      data: {
        title: 'Confirm Action',
        message: `Are you sure want to delete all Articles Entry?`,
        type: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked confirm
        this.dataService.deleteAllDocuments();
      } else {
        // User clicked cancel
        console.log('Cancelled!');
      }
    });
  }
  getAllInPDF() {
    this.dataService.getArticle(null, null).subscribe({
      next: (articles) => {
        let rows = articles.map((item, index) => ({
          serial: index + 1,
          ...item,
        }));
        this.convertPDF(rows)
      },
      error: error =>{
        this.snackBar.open(error.message, "Ok", {
          duration: 5000
        })
      }
    });
    // Use autoTable plugin
  }

  convertPDF(rows: any) {
    const doc = new jsPDF();

    // Define the columns we want and their titles
    const columns = [
      { header: 'S.No', dataKey: 'serial' },
      { header: 'Barcode', dataKey: 'barcode' },
      { header: 'Article Code', dataKey: 'articleCode' },
      { header: 'Count', dataKey: 'count' },
    ];
    doc.autoTable({
      columns: columns,
      body: rows,
    });

    const pdfOutput = doc.output('dataurlnewwindow');
  }
}
