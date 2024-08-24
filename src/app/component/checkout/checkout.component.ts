import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../../model/article';
import { DataService } from '../../shared/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogconfirmComponent } from '../dialogconfirm/dialogconfirm.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  myForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,private dataService: DataService,private dialog: MatDialog) {
    // this.createForm();
    // this.initForm();
    this.buildForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      barcode: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
      articleCode: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
        ],
      ],
      count: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ],
      ],
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
      barcode: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
      articleCode: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
        ],
      ],
      count: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ],
      ],
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
    debugger
    if (this.myForm.invalid) {
      return;
    }
    let article: Article = this.myForm.value;
    this.dataService.addArticle(article);
  }
  deleteAll(){
    this.openDeleteConfirmationDialog()
  }

  openDeleteConfirmationDialog() {
    const dialogRef = this.dialog.open(DialogconfirmComponent, {
      width: '300px',
      data: {
        title: 'Confirm Action',
        message: `Are sure want to delete all Articles Entry?`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked confirm
        this.dataService.deleteAllDocuments();
      } else {
        // User clicked cancel
        console.log('Cancelled!');
      }
    });
  }
}
