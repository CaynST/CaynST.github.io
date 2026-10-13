import { Component } from '@angular/core';
import { SkillsService } from '../services/skills-service/skills';
import { Skills as SkillsModel } from '../models/skills/skills.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  skills: SkillsModel[] = [];

  constructor(public skillsService: SkillsService) {
    console.log(this.skillsService);
    this.skillsService
      .getSkills()
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
        this.skills = data;
        console.log(this.skills);
      });
  }

  getLevelPercent(level?: string): number {
    if (!level) {
      return 0;
    }
    const value = parseInt(level.split('/')[0], 10);
    if (isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, value));
  }
}
