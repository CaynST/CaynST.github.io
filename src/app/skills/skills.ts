import { Component } from '@angular/core';
import { SkillsService } from '../services/skills-service/skills';

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {

	constructor(public skillsService: SkillsService){
		console.log(this.skillsService);
	}

}