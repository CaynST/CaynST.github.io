import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {

	accesoCertificates = 'certificates service running...';

	constructor(){
		console.log(this.accesoCertificates);
	}

}