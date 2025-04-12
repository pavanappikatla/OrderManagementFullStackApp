import { Component,EventEmitter,Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-image-preview',
  standalone:true,
  imports: [PdfViewerModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent implements OnChanges {
  @Input() fileURL:string = ''
  @Input() display:boolean = false
  @Input() whetherPdf: boolean = false

  @Output() toggleDisplay:EventEmitter<boolean> = new EventEmitter<boolean>()

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['display']){
      if(this.display===true)
      {
        document.body.classList.add('modal-open');
      }

    }
  }

  hideDisplay():void{
    document.body.classList.remove('modal-open');
    this.toggleDisplay.emit(false)
  }
}
