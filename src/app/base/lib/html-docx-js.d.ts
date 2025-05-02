declare module "html-docx-js/dist/html-docx" {
  const htmlDocx: {
    asBlob: (html: string) => Blob;
    asBlobAsync?: (html: string) => Promise<Blob>;
  };
  export = htmlDocx;
}
