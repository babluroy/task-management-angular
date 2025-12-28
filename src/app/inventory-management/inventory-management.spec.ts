import { TestBed } from '@angular/core/testing';

import { InventoryManagement } from './inventory-management';

describe('InventoryManagement', () => {
  let service: InventoryManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
