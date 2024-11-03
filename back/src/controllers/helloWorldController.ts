import { Request, Response } from 'express';
import { getHelloWorld } from '../use-cases/getHelloWorld';

export const helloWorldController = async (req: Request, res: Response) => {
  try {
    const hello = await getHelloWorld();
    res.status(200).json(hello);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
