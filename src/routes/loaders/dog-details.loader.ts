import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

export interface DogDetailsLoaderData {
  dogId: number;
}

export async function dogDetailsLoader(args: LoaderFunctionArgs): Promise<DogDetailsLoaderData | Response> {
  const dogIdParam = args.params.dogId;

  if (!dogIdParam) {
    return redirect('/');
  }

  const parsedDogId = Number(dogIdParam);

  if (!Number.isInteger(parsedDogId) || parsedDogId <= 0) {
    return redirect('/');
  }

  return {
    dogId: parsedDogId,
  };
}
