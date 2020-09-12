import { TestBed } from '@angular/core/testing';

import { BookDataResolver } from './book-data.resolver';

describe('BookDataService', () => {
  let service: BookDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookDataResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
