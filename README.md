# A template/demo to use google sheet as database to create full text, faceted search website

## rememebr to add .env.local in current path

## first time deploy

Install pm2 globally if not

```bash
yarn global pm2
```

```bash
chmod +x deploy-first.sh
chmod +x deploy-update.sh
./deploy-first.sh
```

## Update

```bash
./deploy-update.sh
```

### Example sheet

https://docs.google.com/spreadsheets/d/1npaSX5Nj_TPI0i05mYX2ASDJOqdkhLb6mVG2FGi9jto/

### To update the field that to want to search or facet

update src/utils/config/init_config

### Deploy with vercel , add env file
