"use client";
// pages/index.js
import React, { useEffect, useRef, useState } from "react";

import { convertTiffFromBase64 } from "../../utils/imgConversion";
import { tiffImg } from "../../utils/tiifImg";

export default function Home() {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const val = await convertTiffFromBase64(tiffImg);
      setImg(val);
    };

    fetchData();
  }, []);

  return <img src={img} alt="tiff image" />;
}
