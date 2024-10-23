import { GetPersonFullNamePipe } from './get-person-full-name.pipe';

describe('GetPersonFullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new GetPersonFullNamePipe();
    expect(pipe).toBeTruthy();
  });
});
