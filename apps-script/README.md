# Apps Script API

## Script properties

- `LINE_CHANNEL_ID`: LINE Login channel ID used only by the legacy equipment-management actions
- `SPREADSHEET_ID`: target Google Sheet ID

## Sheets

Create a sheet named `equipment` with this header row:

```text
id,itemCode,name,category,brand,model,serialNumber,quantity,unit,location,condition,status,notes,recordedByLineUserId,recordedByName,createdAt,updatedAt,deletedAt
```

Create a sheet named `request_log` with this header row:

```text
requestId,action,lineUserId,status,createdAt
```

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

Public catalog actions do not require a LINE ID token:

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
