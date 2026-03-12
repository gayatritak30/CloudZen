import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const waitForImages = async (node: HTMLElement) => {
  const images = node.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      img =>
        img.complete
          ? Promise.resolve()
          : new Promise(res => {
              img.onload = img.onerror = res;
            })
    )
  );
};

export const downloadPDF = async (node: HTMLElement) => {
  if (!node) return;

  // wait for fonts
  await document.fonts.ready;

  // wait for images
  await waitForImages(node);

  // allow layout to settle
  await new Promise(r => requestAnimationFrame(() => r(null)));

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const imgProps = pdf.getImageProperties(dataUrl);

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("certificate.pdf");
};
