import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-services/certificates';

@Component({
  selector: 'app-certificates',
  standalone: false,
  templateUrl: './certificates.html',
  styleUrl: './certificates.css',
})
export class Certificates {

	constructor(public certificatesService: CertificatesService){
		console.log(this.certificatesService);
	}

}