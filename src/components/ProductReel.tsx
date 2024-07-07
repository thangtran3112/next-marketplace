import React from "react";

interface ProductReelProps {
  title: string;
  subtitle?: string;
}

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle } = props;

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
