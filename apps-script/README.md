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

## Deployment

Create `.clasp.json` with the Apps Script project ID, then run:

```sh
pnpm --filter apps-script deploy
```

Deploy the project as a Web App executed by the deploying user with access allowed to anyone.
