// Images.jsx
import React from 'react';

const Images = (props) => {
  const { data, onClick } = props;

  const handleClickImage = (index) => {
    onClick(index);
  };

  return (
    <div
      className="
        max-w-[1200px]
        my-8 mx-auto
        grid
        gap-4
        [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))]
      "
    >
      {data.map((slide, index) => (
        <div
          key={index}
          onClick={() => handleClickImage(index)}
          className="
            group
            relative
            mb-5
            block
            w-full
            cursor-zoom-in
            /* Ces classes after:* simulent le 'shadow-highlight' sur hover */
            after:pointer-events-none
            after:absolute
            after:inset-0
            after:rounded-lg
            after:shadow-[0_0_10px_rgba(0,0,0,0.3)]
          "
        >
          {/* L'image avec effet brightness + transition au hover */}
          <img
            src={slide.src}
            loading="lazy"
            className="
              transform
              rounded-lg
              brightness-90
              transition
              will-change-auto
              group-hover:brightness-110
            "
          />

          {/* Le label en haut à droite, style 'Nyno' */}
          <p
            className="
              absolute
              top-2
              right-2
              bg-white/50
              px-1
              rounded-md
              backdrop-blur
              text-sm
              hover:bg-white/100
              transition-all
            "
          >
            {/* Choisis ce que tu affiches (ex: slide.title, slide.author, ou 'Nyno') */}
            {slide.date || 'Nyno'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Images;
