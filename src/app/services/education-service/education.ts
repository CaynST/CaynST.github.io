import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EducationService {

	accesoEducation = 'education service running...';

	constructor(){
		console.log(this.accesoEducation);
	}

}