import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';
import { BarcodeScannerLivestreamComponent, BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-component',
  imports: [FormsModule, CommonModule, BarcodeScannerLivestreamModule, ZXingScannerModule,RouterLink],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})
export class HomeComponentComponent implements OnInit{
  // barcodeFormats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.AZTEC, BarcodeFormat.CODABAR, BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.CODE_93,BarcodeFormat.DATA_MATRIX, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.ITF, BarcodeFormat.MAXICODE, BarcodeFormat.PDF_417];
  barcodeFormats = [ BarcodeFormat.CODE_39]

  barcodeResult: string | null = null;
  scanEnabled:boolean =false
  @ViewChild('scanner') scanner:HTMLElement|undefined

  redLineVisibility:boolean = false;

  constructor(private chg: ChangeDetectorRef, private router:Router){

  }

  ngOnInit(): void {
    this.handleBarcode()
  }


onValueChanges(event:any):void{
  this.barcodeResult = event.codeResult.code;
  alert('Result: ' + this.barcodeResult)
}

  handleBarcode():void {
    this.scanEnabled = true
    this.redLineVisibility=true
  }

  onSuccessHandle(event:any):void{
    alert(event)
    this.router.navigate(['/openorders'], { queryParams: { jobNo: event } });

  }



  scanError(event:any):void{
    console.log("Error: ", event)
  }

  scanFailure(event:any):void{

    console.log('Scan failed', event)
  }

  fileAdded(event:any):void{
    const input = event.target as HTMLInputElement;
    console.log(input)
    if (input.files && input.files.length > 0) {
      console.log('Selected file:', input.files[0].name);
    }
  }

  scanComplete(event:any):void{

    console.log("Scan complete ", event)
  }
}
