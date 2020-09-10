import { Component, OnInit, Input } from '@angular/core';
import { LoadResourceService } from '../services/load-resource.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent implements OnInit {


  imageToShow: any;
  isImageLoading: boolean;
  @Input() customClass: string = '';
  @Input() alt: string;
  @Input() cover: string;
  @Input() category: string;

  constructor(private loadResourceService: LoadResourceService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getImageFromService(this.cover);
  }


  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  getImageFromService(cover) {
    this.isImageLoading = true;
    this.loadResourceService.loadCover(cover, this.category).toPromise()
    .then(
      data => { this.createImageFromBlob(data); }
    )
    .catch(
      error => console.error(error)
    )
    .finally(
      () => { this.isImageLoading = false; }
    );
  }

}
