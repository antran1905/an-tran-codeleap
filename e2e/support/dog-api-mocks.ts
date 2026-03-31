import type { Page, Route } from '@playwright/test';

interface BreedMock {
  id: number;
  name: string;
  reference_image_id: string;
  image: {
    id: string;
    url: string;
  };
  weight: {
    metric: string;
  };
  height: {
    metric: string;
  };
}

interface FavouriteMock {
  id: number;
  image_id: string;
  created_at: string;
  image: {
    id: string;
    url: string;
    breeds: Array<{
      id: number;
      name: string;
      weight: {
        metric: string;
      };
      height: {
        metric: string;
      };
      reference_image_id: string;
    }>;
  };
}

export const defaultBreeds: BreedMock[] = [
  {
    id: 1,
    name: 'Affenpinscher',
    reference_image_id: 'img-1',
    image: {
      id: 'img-1',
      url: 'https://images.test/dog-1.jpg',
    },
    weight: { metric: '3 - 6' },
    height: { metric: '23 - 29' },
  },
  {
    id: 2,
    name: 'Basenji',
    reference_image_id: 'img-2',
    image: {
      id: 'img-2',
      url: 'https://images.test/dog-2.jpg',
    },
    weight: { metric: '9 - 11' },
    height: { metric: '40 - 43' },
  },
  {
    id: 3,
    name: 'Beagle',
    reference_image_id: 'img-3',
    image: {
      id: 'img-3',
      url: 'https://images.test/dog-3.jpg',
    },
    weight: { metric: '9 - 16' },
    height: { metric: '33 - 41' },
  },
];

interface InstallDogApiMocksOptions {
  breeds?: BreedMock[];
}

export async function installDogApiMocks(page: Page, options?: InstallDogApiMocksOptions): Promise<void> {
  const breeds = options?.breeds ?? defaultBreeds;
  const favourites: FavouriteMock[] = [];
  let favouriteId = 1;
  let voteId = 1;

  await page.route('**/breeds', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(breeds),
    });
  });

  await page.route('**/votes', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    const payload = route.request().postDataJSON() as {
      image_id: string;
      value: -1 | 1 | 2;
    };

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: voteId++,
        image_id: payload.image_id,
        value: payload.value,
        created_at: new Date().toISOString(),
      }),
    });
  });

  await page.route(/.*\/favourites(\?.*)?$/, async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillFavouritesGet(route, favourites);
      return;
    }

    if (route.request().method() === 'POST') {
      const payload = route.request().postDataJSON() as {
        image_id: string;
      };
      const breed = breeds.find((item) => item.reference_image_id === payload.image_id);
      const createdAt = new Date().toISOString();

      const favourite: FavouriteMock = {
        id: favouriteId++,
        image_id: payload.image_id,
        created_at: createdAt,
        image: {
          id: payload.image_id,
          url: breed?.image.url ?? 'https://images.test/fallback.jpg',
          breeds: breed
            ? [
              {
                id: breed.id,
                name: breed.name,
                weight: breed.weight,
                height: breed.height,
                reference_image_id: breed.reference_image_id,
              },
            ]
            : [],
        },
      };

      favourites.unshift(favourite);

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(favourite),
      });
      return;
    }

    await route.fallback();
  });
}

async function fulfillFavouritesGet(route: Route, favourites: FavouriteMock[]): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: {
      'pagination-count': String(favourites.length),
      'pagination-page': '0',
      'pagination-limit': '10',
    },
    body: JSON.stringify(favourites),
  });
}
