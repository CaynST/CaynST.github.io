import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Interests } from '../../models/interests/interests.model';

@Injectable({
  providedIn: 'root',
})
export class InterestsService {

	private dbPath = '/interest';

	interestsRef: AngularFirestoreCollection<Interests>;

	constructor(private db: AngularFirestore){
		this.interestsRef = db.collection(this.dbPath);
	}

	getInterests(): AngularFirestoreCollection<Interests>{
		return this.interestsRef;
	}

}
