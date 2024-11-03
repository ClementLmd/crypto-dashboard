import { getHelloWorld } from '../use-cases/getHelloWorld';

it('should fetch Hello World', async () => {
  const fetchHello = await getHelloWorld();
  expect(fetchHello).toBe('Hello World');
});
