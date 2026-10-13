import { Component } from '@angular/core';
import { WorkExperienceService } from '../services/work-experience-service/work-experience';
import { WorkExperience as WorkExperienceModel } from '../models/work-experience/work-experience.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-work-experience',
  standalone: false,
  templateUrl: './work-experience.html',
  styleUrl: './work-experience.css',
})
export class WorkExperience {
  workExperience: WorkExperienceModel[] = [];

  constructor(public workExperienceService: WorkExperienceService) {
    console.log(this.workExperienceService);
    this.workExperienceService
      .getWorkExperience()
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
        this.workExperience = data;
        console.log(this.workExperience);
      });
  }
}
