import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Html5QrcodeScanner, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { DialogconfirmComponent } from '../dialogconfirm/dialogconfirm.component';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.css',
})
export class ScannerComponent implements OnChanges {
  html5QrCodeScanner: any;
  @Input() loadScanner = false;
  @Output() barcode = new EventEmitter<string>();
  
  constructor(private dialog: MatDialog){
    
  }
  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      if(changes[propName].currentValue == true){
        this.loadScannerInstance()
      }else{
        this.html5QrCodeScanner && this.html5QrCodeScanner.clear();
      }
    }
  }
  loadScannerInstance(){
    if(this.html5QrCodeScanner){
      switch (this.html5QrCodeScanner.getState()){
        case Html5QrcodeScannerState.SCANNING: 
          return;
        case Html5QrcodeScannerState.PAUSED:
          this.html5QrCodeScanner.resume();
          return;
      }
      
    }
    this.html5QrCodeScanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 30,
        qrbox: { width: 250, height: 150 }, // Optional, if you want bounded box UI
        aspectRatio: 1.7778,
        showTorchButtonIfSupported : true,
      },
      /* verbose= */ false
    );

    this.html5QrCodeScanner.render((res:string)=>this.onScanSuccess(res), (res:string)=>this.onScanFailure(res));
  }

  onScanSuccess(decodedText: string) {
    if(Html5QrcodeScannerState.SCANNING === this.html5QrCodeScanner.getState()){
      this.html5QrCodeScanner.pause();
    }
    this.openConfirmationDialog(decodedText);

  }
  onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    //console.error(error)
  }
  openConfirmationDialog(decodedText: string) {
    const dialogRef = this.dialog.open(DialogconfirmComponent, {
      width: '300px',
      data: {
        title: 'Confirm Action',
        message: `Scanned bar code is ${decodedText}`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked confirm
        this.barcode.emit(decodedText);

      } else {
        // User clicked cancel
        console.log('Cancelled!');
        if(Html5QrcodeScannerState.SCANNING === this.html5QrCodeScanner.getState()){
          this.html5QrCodeScanner.resume();
        }
      }
    });
  }
}
