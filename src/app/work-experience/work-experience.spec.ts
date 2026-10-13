import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { WorkExperience } from './work-experience';

const firestoreStub = {
  collection: () => ({ snapshotChanges: () => of([]) }),
};

describe('WorkExperience', () => {
  let component: WorkExperience;
  let fixture: ComponentFixture<WorkExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExperience],
      providers: [{ provide: AngularFirestore, useValue: firestoreStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkExperience);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
