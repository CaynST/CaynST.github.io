import { Component } from '@angular/core';
import { EducationService } from '../services/education-service/education';

@Component({
  selector: 'app-education',
  standalone: false,
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {

	constructor(public educationService: EducationService){
		console.log(this.educationService);
	}

}