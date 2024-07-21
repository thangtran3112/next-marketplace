export const PRODUCT_CATEGORIES = [
  {
    label: "Food Recipes",
    value: "food-recipes" as const,
    featured: [
      {
        name: "Favorite Recipes",
        href: `/products?category=food-recipes`,
        imageSrc: "/nav/food-recipes/picks.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=food-recipes&sort=desc",
        imageSrc: "/nav/food-recipes/new.jpg",
      },
      {
        name: "Bestselling Recipes",
        href: "/products?category=food-recipes",
        imageSrc: "/nav/food-recipes/bestsellers.jpg",
      },
    ],
  },
];
