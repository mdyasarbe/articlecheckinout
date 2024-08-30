import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Article, getArticleObjectFromDB } from '../../model/article';
import { DataService } from '../../shared/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../shared/spinner.service';
import { ScannerComponent } from '../scanner/scanner.component';
//declare var Quagga:any;
@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css',
})
export class CheckinComponent implements OnChanges {
  myForm!: FormGroup;
  submitted = false;
  @Input() tabFocused = 0;
  checkinTabFocussed = false;
  @ViewChild('scanner') scanner: ScannerComponent;

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    if (changes['tabFocused'].currentValue == 1) {
      this.checkinTabFocussed = true;
    } else {
      this.checkinTabFocussed = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {
    // this.createForm();
    // this.initForm();
    this.buildForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      barcode: ['', [Validators.required, Validators.minLength(6)]],
      articleCode: ['', [Validators.required, Validators.minLength(4)]],
      count: [1, [Validators.required, Validators.min(1)]],
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
    if (this.myForm.invalid) {
      return;
    }
    let article: Article = this.myForm.value;
    this.dataService.addArticle(article);
    this.scanner.loadScannerInstance();
  }
  loadScanner() {
    return this.checkinTabFocussed;
  }

  barCodeScanned(barcode: string) {
    this.spinnerService.show();
    this.dataService.getArticle(barcode, null).subscribe({
      next: (e) => {

        this.myForm.controls['barcode'].setValue(barcode);
        if (e && e.length > 0) {
          this.myForm.controls['articleCode'].setValue(e[0].articleCode);
          this.myForm.controls['count'].setValue(e[0].count);
        }

        this.spinnerService.hide();
      },
      error: (e) => {
        this.snackBar.open(e.message, 'OK', {
          duration: 2000,
        });

        this.spinnerService.hide();
      },
    });
  }
  checkArticle() {
    this.spinnerService.show();
    let articleCode = this.myForm.controls['articleCode'].value;
    this.dataService.getArticle(null, articleCode).subscribe({
      next: (e) => {
        if (e && e.length > 0) {
          this.myForm.controls['barcode'].setValue(e[0].barcode);
          this.myForm.controls['articleCode'].setValue(e[0].articleCode);
          this.myForm.controls['count'].setValue(e[0].count);
        }

        this.spinnerService.hide();
      },
      error: (e) => {
        this.snackBar.open(e.message, 'OK', {
          duration: 2000,
        });

        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }
}
