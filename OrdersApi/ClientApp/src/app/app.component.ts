import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';
import { BarcodeScannerLivestreamComponent, BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { AfterViewInit } from '@angular/core';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { LandingComponent } from './components/landing/landing.component';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, BarcodeScannerLivestreamModule, ZXingScannerModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'App-v1';



}
