/**
 * Created by xastey on 5/11/2016.
 */
import {MockBackend, MockConnection} from '@angular/http/testing';
import {Request, Response, ResponseOptions} from '@angular/http';

interface FixtureStore {
  __mocks__: {[id: string]: Object};
}


export class FixtureBackend extends MockBackend {

  _store: FixtureStore = <FixtureStore>(<any>window);


  constructor() {
    super();

  }

  fixture(path) {
    return this._store.__mocks__[path.replace(/\.json$/, '')];
  }

  createConnection(req: Request): MockConnection {
    let connection = super.createConnection(req);
    let fixture = this.fixture(req.url);
    if (!!fixture) {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: fixture
        })));

    }

    return connection;
  }
}
