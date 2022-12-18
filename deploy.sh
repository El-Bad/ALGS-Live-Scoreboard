git pull origin main
npm install
npm run build
cp dist/* /etc/www/dist/
echo "moved dist/* to /etc/www/dist/"
