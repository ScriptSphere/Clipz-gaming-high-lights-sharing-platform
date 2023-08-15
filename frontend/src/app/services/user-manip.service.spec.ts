import { TestBed } from '@angular/core/testing';

import { UserManipService } from './user-manip.service';

describe('UserManipService', () => {
  let service: UserManipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
