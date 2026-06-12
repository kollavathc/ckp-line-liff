# Apps Script API

## Script properties

- `SPREADSHEET_ID`: target Google Sheet ID

## Sheets

Create a sheet named `products` with this header row:

```text
id,slug,name,sku,brand,category,shortDescription,description,price,stockStatus,imageUrl,highlights,specifications,featured,sortOrder,published,updatedAt
```

Use `|` between highlights. Use `label:value|label:value` for specifications. Leave `price` blank to display `สอบถามราคา`.

Create a sheet named `product_images` with this header row:

```text
productId,imageUrl,sortOrder
```

Create a sheet named `categories` with this header row:

```text
id,name,sortOrder
```

Catalog actions:

```text
product.list
product.get
category.list
```

## How to add a product

The site reads live from the sheet, so adding a product needs no code change or redeploy.

1. Add one row to the `products` sheet.
2. Fill the required columns:
   - `id` and `slug`: unique values used in the product URL, for example `product-009`.
   - `name`, `sku`, `brand`, `shortDescription`, `description`: product copy.
   - `category`: one of `WHEELCHAIR`, `WALKER`, `HOSPITAL_BED`, `BLOOD_PRESSURE_MONITOR`, `DIABETIC_SUPPLIES`, `WOUND_CARE`, `RESPIRATORY_EQUIPMENT`.
   - `price`: a number, or leave blank to display `สอบถามราคา`.
   - `stockStatus`: one of `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`, `PREORDER`.
   - `imageUrl`: the main image (see Images below).
   - `highlights`: short bullet points separated by `|`.
   - `specifications`: `label:value` pairs separated by `|`.
   - `featured`: `true` or `false`.
   - `sortOrder`: a number that orders the list (lower shows first).
   - `published`: set to `true` to show the product. `false` hides it.
   - `updatedAt`: an ISO date such as `2026-06-12`.
3. Reload the website to see the product.

## Images

The value in `imageUrl` is used directly as the image source, so it must be a
URL that returns the image file itself.

- A full URL such as `https://.../photo.jpg` works and is the recommended way to
  add product photos from the sheet.
- A relative path such as `/products/wheelchair.svg` only works for files
  committed under `apps/frontend/public/`.

Hosting tips:

- Upload to an image host such as Cloudinary or ImgBB and paste the direct image
  URL. Confirm the URL ends in `.jpg`, `.png`, or `.webp`.
- A Google Drive or Google Photos share link will not work, because it points to
  a viewer page, not the image. For Drive, set the file to **Anyone with the link
  → Viewer**, then use `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000`.
  A dedicated image host is more reliable than Drive for a customer-facing site.
- There is no automatic resizing. Upload images around 1000px wide and compressed
  so pages stay fast on mobile.

To add extra gallery images for a product, add rows to the `product_images` sheet
with the same `productId`, a full `imageUrl`, and a `sortOrder`. The product
detail page builds its thumbnail strip from these rows.

## Deployment

Create `.clasp.json` with the Apps Script project ID, then run:

```sh
pnpm --filter apps-script deploy
```

Deploy the project as a Web App executed by the deploying user with access allowed to anyone.
