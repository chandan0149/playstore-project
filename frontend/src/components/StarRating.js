import { useState } from "react";

export default function StarRating({ rating = 0, setRating = null, size = 30 }) {

  const [hover, setHover] = useState(0);

  return (

    <div style={{ display: "inline-block" }}>

      {[1, 2, 3, 4, 5].map((star) => (

        <span
          key={star}
          style={{
            fontSize: size,
            cursor: setRating ? "pointer" : "default",
            color: star <= (hover || rating) ? "orange" : "#ccc"
          }}

          onClick={() => setRating && setRating(star)}
          onMouseEnter={() => setRating && setHover(star)}
          onMouseLeave={() => setRating && setHover(0)}
        >
          ★
        </span>

      ))}

    </div>

  );

}