import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseCoreService {
  readonly app:  FirebaseApp = initializeApp(environment.firebase);
  readonly auth: Auth        = getAuth(this.app);

  // ✅ Cache persistente en IndexedDB — el catálogo funciona offline
  // después de la primera carga con conexión.
  readonly db: Firestore = initializeFirestore(this.app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(), // soporte multi-pestaña
    }),
  });
}
