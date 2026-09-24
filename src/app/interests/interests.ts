import { Component } from '@angular/core';
import { InterestsService } from '../services/interests-service/interests';

@Component({
  selector: 'app-interests',
  standalone: false,
  templateUrl: './interests.html',
  styleUrl: './interests.css',
})
export class Interests {

	constructor(public interestsService: InterestsService){
		console.log(this.interestsService);
	}

}