import { TestBed } from '@angular/core/testing';

import { SendErrorMessageService } from './send-error-message.service';

describe('SendErrorMessageService', () => {
  let service: SendErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendErrorMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
