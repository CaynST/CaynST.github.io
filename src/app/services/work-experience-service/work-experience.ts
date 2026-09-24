import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkExperienceService {

	accesoWorkExperience = "work experience running...";

	constructor(){
		console.log(this.accesoWorkExperience);
	}
	
}

