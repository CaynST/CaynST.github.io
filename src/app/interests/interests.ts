import { Component } from '@angular/core';
import { InterestsService } from '../services/interests-service/interests';
import { Interests as InterestsModel } from '../models/interests/interests.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-interests',
  standalone: false,
  templateUrl: './interests.html',
  styleUrl: './interests.css',
})
export class Interests {
  interests: InterestsModel[] = [];

  constructor(public interestsService: InterestsService) {
    console.log(this.interestsService);
    this.interestsService
      .getInterests()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      )
      .subscribe((data) => {
        this.interests = data;
        console.log(this.interests);
      });
  }
}
