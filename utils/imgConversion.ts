import UTIF from "utif";

export async function convertTiffFromBase64(b64Tiff: string): Promise<string> {
  // Convert base64 to bytes
  const res = await fetch(b64Tiff);
  const blob = await res.blob();

  const file = new File([blob], "file", { type: "image/tiff" });
  const bytes = await file.arrayBuffer();

  // Decode image
  const ifds: UTIF.IFD[] = UTIF.decode(bytes);

  let vsns: UTIF.IFD[] = ifds;
  let ma = 0;
  let page: UTIF.IFD = vsns[0];
  //@ts-ignore
  if (ifds[0].subIFD) vsns = vsns.concat(ifds[0].subIFD);

  for (let i = 0; i < vsns.length; i += 1) {
    const img = vsns[i];
    //@ts-ignore
    if (img.t258 !== null && img.t258?.length >= 3) {
      //@ts-ignore
      const ar = img.t256! * img.t257!;

      if (ar > ma) {
        ma = ar;
        page = img;
      }
    }
  }

  //@ts-ignore
  UTIF.decodeImage(bytes, page, ifds);
  const rgba = UTIF.toRGBA8(page);

  // Render image
  const cnv = document.createElement("canvas");
  cnv.width = page.width!;
  cnv.height = page.height!;

  const ctx = cnv.getContext("2d");
  const imgd = ctx!.createImageData(page.width!, page.height!);

  for (let i = 0; i < rgba.length; i += 1) {
    imgd.data[i] = rgba[i];
  }

  ctx!.putImageData(imgd, 0, 0);

  return cnv.toDataURL("image/jpeg")!;
}
