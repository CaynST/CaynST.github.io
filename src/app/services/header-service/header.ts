import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

	accesoHeader = 'header service running...';

	constructor(){
		console.log(this.accesoHeader);
	}
 
}
