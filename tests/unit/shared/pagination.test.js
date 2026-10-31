
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getPagination,
  buildPaginationMetadata,
} from '../../../src/shared/utils/pagination.js';

test('should use default pagination values', () => {
  const result = getPagination();

  assert.deepEqual(result, {
    page: 1,
    limit: 10,
    skip: 0,
  });
});

test('should calculate skip correctly', () => {
  const result = getPagination({ page: 3, limit: 10 });

  assert.equal(result.skip, 20);
});

test('should prevent negative page values', () => {
  const result = getPagination({ page: -1, limit: 10 });

  assert.equal(result.page, 1);
});

test('should not exceed maximum limit', () => {
  const result = getPagination({ page: 1, limit: 500 });

  assert.equal(result.limit, 100);
});

test('should calculate total pages correctly', () => {
  const result = buildPaginationMetadata({
    page: 3,
    limit: 10,
    totalItems: 45,
  });

  assert.equal(result.totalPages, 5);
});

test('should return false for next and previous pages when there are no items', () => {
  const result = buildPaginationMetadata({
    page: 1,
    limit: 10,
    totalItems: 0,
  });

  assert.equal(result.hasNextPage, false);
  assert.equal(result.hasPreviousPage, false);
});

test('should indicate next and previous pages correctly', () => {
  const result = buildPaginationMetadata({
    page: 3,
    limit: 10,
    totalItems: 45,
  });

  assert.equal(result.hasNextPage, true);
  assert.equal(result.hasPreviousPage, true);
});

test('should return false for next page on the last page', () => {
  const result = buildPaginationMetadata({
    page: 5,
    limit: 10,
    totalItems: 45,
  });

  assert.equal(result.hasNextPage, false);
});
