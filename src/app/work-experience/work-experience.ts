import { Component } from '@angular/core';
import { WorkExperienceService } from '../services/work-experience-service/work-experience'


@Component({
  selector: 'app-work-experience',
  standalone: false,
  templateUrl: './work-experience.html',
  styleUrl: './work-experience.css',
})
export class WorkExperience {

	constructor( public workExperienceService : WorkExperienceService){

		console.log(this.workExperienceService);
	}
	
}
