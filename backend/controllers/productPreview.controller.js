import Product from "../models/product.model.js";

const SITE_NAME = "Jemzy";
const SITE_URL = "https://jemzy.pk";
const DEFAULT_IMAGE = `${SITE_URL}/favicon-96x96.png`;

export const productPreview = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug, isActive: true });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const title = `${product.title} | ${SITE_NAME}`;
    const description = product.description
      ? product.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : `${product.title} - Shop now at ${SITE_NAME}`;
    const image =
      product.productImages && product.productImages.length > 0
        ? product.productImages[0].url
        : DEFAULT_IMAGE;
    const price = product.price;
    const url = `${SITE_URL}/product/${slug}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}">
  <link rel="canonical" href="${url}">

  <!-- Open Graph -->
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="product:price:amount" content="${price}">
  <meta property="product:price:currency" content="PKR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="${image}">

  <!-- Redirect real users to the SPA -->
  <meta http-equiv="refresh" content="0;url=${url}">
  <script>window.location.href="${url}";</script>
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.log("Error in productPreview controller", error.message);
    res.status(500).send("Server error");
  }
};
