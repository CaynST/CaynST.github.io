import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { App } from './app';
import { Header } from './header/header';
import { WorkExperience } from './work-experience/work-experience';
import { Education } from './education/education';
import { Skills } from './skills/skills';
import { Certificates } from './certificates/certificates';
import { Languages } from './languages/languages';
import { Interests } from './interests/interests';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [
        App,
        Header,
        WorkExperience,
        Education,
        Skills,
        Certificates,
        Languages,
        Interests,
      ],
      providers: [
        {
          provide: AngularFirestore,
          useValue: { collection: () => ({ snapshotChanges: () => of([]) }) },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header component', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});
