import { TestBed } from '@angular/core/testing';

import { NotasprivadasService } from './notasprivadas.service';

describe('NotasprivadasService', () => {
  let service: NotasprivadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasprivadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
