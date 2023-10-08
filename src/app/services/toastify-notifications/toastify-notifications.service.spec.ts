import { TestBed } from '@angular/core/testing';

import { ToastifyNotificationsService } from './toastify-notifications.service';

describe('ToastifyNotificationsService', () => {
  let service: ToastifyNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastifyNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
