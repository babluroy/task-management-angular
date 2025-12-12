import { TestBed } from '@angular/core/testing';

import { TaskManagement } from './task-management';

describe('TaskManagement', () => {
  let service: TaskManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
