import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { LoadResourceService } from '../services/load-resource.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  imageToShow: any;
  isImageLoading: boolean;
  loadFailled: boolean = false;
  @Input() customClass: string = '';
  @Input() alt: string;
  @Input() avatar: string;

  constructor(private loadResourceService: LoadResourceService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getImageFromService(this.avatar);
  }

	ngOnChanges() {
		this.getImageFromService(this.avatar);
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


  getImageFromService(avatar) {
    this.isImageLoading = true;
    this.loadResourceService.loadAvatar(avatar).toPromise()
      .then(
        data => { this.createImageFromBlob(data); }
      )
      .catch(
        error => {
          this.loadFailled = true;
        }
      )
      .finally(
        () => { this.isImageLoading = false; }
      );
  }

}
