REPO_NAME="vm-manager"
cd "${HOME}/${REPO_NAME}" || exit
pm2 stop ${REPO_NAME}
pm2 delete ${REPO_NAME}
git pull
yarn  install
yarn build
pm2 start yarn --name ${REPO_NAME} -- start
pm2 save
