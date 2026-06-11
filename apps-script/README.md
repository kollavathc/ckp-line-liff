# Apps Script API

## Script properties

- `LINE_CHANNEL_ID`: LINE Login channel ID used to verify LIFF ID tokens
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

## Deployment

Create `.clasp.json` with the Apps Script project ID, then run:

```sh
pnpm --filter apps-script deploy
```

Deploy the project as a Web App executed by the deploying user with access allowed to anyone.

