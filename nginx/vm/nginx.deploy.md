# 💡 Steps to follow for deploying the app on a nginx server (on Ubuntu)

Here are the steps to follow for deploying the NextJs app on a nginx server (on
Ubuntu) using the [pm2](https://pm2.keymetrics.io/) process manager
and [certbot](https://certbot.eff.org/) for a free SSL certificate.

I've tested the following steps on an **Ubuntu 22 server** from **Azure** and
on **wsl2 (Ubuntu 20.04)** on a **Windows server 22**.

## Before starting

- You need obviously to have a linux server (with **Ubuntu** installed).
- You need to have a **domain name** (or a **subdomain**),
  like `vm-manager.com`
  , `www.vm-manager.com`, `api.vm-manager.com`, etc.
- For the **SSL certificate**, you need to have a **public IP** address for your
  server (or a **static IP** address if you have one).
- If you are using a vm from the cloud (like **Azure**), you need to **open the
  ports** 80 and 443 on your server (for the **http** and **https** protocols),
  you may also need to open the port 22 for the **ssh** protocol in order to be
  able to connect to your server.

## Steps

### Configure the server

- [ ] **Update the server** and install **nginx** and **certbot**:
  ```bash
  sudo apt update
  sudo apt install nginx certbot python3-certbot-nginx git -y
  ```
- [ ] if you are connected as root (not recommended), you can create a new user
  with the following command:
  <details>
    <summary>Click to expand</summary>

  1. Create a new user:

  ```bash
  adduser <username>
  ```

  1. Add the user to the sudo group:

  ```bash
  usermod -aG sudo <username>
  ```

  1. create an ssh folder for the user:

  ```bash
  mkdir /homePage/<username>/.ssh
  ```

  1. Copy the `authorized_keys` file from the root user to the new user:

  ```bash
  cp /root/.ssh/authorized_keys /homePage/<username>/.ssh/authorized_keys
  ```

  1. Make the `.ssh` folder and the `authorized_keys` file only readable by
     the user:

  ```bash
  sudo chmod 700 /homePage/<username>/.ssh
  sudo chmod 600 /homePage/<username>/.ssh/authorized_keys
  ```

  - You can now connect to your server from an ssh client using the new user:

    ```bash
    ssh -i <path-to-private-key> <username>@<server-ip>
    ```

</details>

- [ ] Clone the **NextJs app** on the server:

  ```bash
  # git clone https://github.com/faouziMohamed/vm-manager.git
  ##or
  git clone git@github.com:faouziMohamed/vm-manager.git
  ```

[//]: # ()

[//]: # (- [ ] 😻 I like to clone the app in the `/var/www` folder, but you can clone it)

[//]: # (  in any folder you want &#40;here I'm using the `/var/www/vm-manager` folder&#41;:)

[//]: # ()

[//]: # (  ```bash)

[//]: # (  sudo mv vm-manager /var/www/vm-manager)

[//]: # (  sudo chown -R <username>:<username> /var/www/vm-manager)

[//]: # (  ```)

- The path to the app will be used later
- Avoid using a path with spaces in it, it may cause some problems

- [ ] Copy the **nginx configuration file** from the app
  folder `vm-manager/nginx/vm/deploy.conf` to the nginx
  folder `/etc/nginx/sites-available`:
  ```bash
  sudo cp vm-manager/nginx/deploy.conf /etc/nginx/sites-available/
  ```
- [ ] Create a **symbolic link** from the nginx configuration file to the nginx
  folder `/etc/nginx/sites-enabled`:
  ```bash
  sudo ln -s /etc/nginx/sites-available/deploy.conf /etc/nginx/sites-enabled/
  ```
- [ ] **Remove the default nginx configuration file** from the nginx
  folder `/etc/nginx/sites-enabled`:

  ```bash
  sudo rm /etc/nginx/sites-enabled/default
  ```

  - [ ] **Edit the nginx configuration
    file** `/etc/nginx/sites-available/deploy.conf` to change the `server_name`
    to your domain name (or subdomain). Initially it is set to underscore ( _ ).  
    You may want to change it and use a domain or subdomain. _Make sure the domain name
    is pointing to the public IP address of your server or the static IP address
    if you have one_.

   ```diff
    server {
      listen 80;
      listen [::]:80;
   -  server_name _;
   +  server_name your-domain.com;
      ...
    }
   ```

- [ ] **Restart nginx** to apply the changes:
  ```bash
  sudo systemctl restart nginx
  ```

### Configure the firewall

- [ ] **Open the ports** 80 and 443 (and 22 if you want to be able to connect to
  your server using ssh) on the firewall:
  ```bash
  sudo ufw allow "Nginx Full"
  sudo ufw allow OpenSSH
  ```

### Configure the app

- [ ] **Install nodejs** with nvm (node version manager):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
  exec $SHELL -l
  nvm install --lts
  ```
- [ ] **Install yarn and pm2**:
  ```bash
  npm install -g yarn pm2
  ```
- [ ] **Install the dependencies** of the app:
  ```bash
  cd /var/www/vm-manager
  yarn install
  ```
- [ ] **Build the app**:
  ```bash
  yarn build
  ```
- [ ] **Start the app using pm2**:
  ```bash
  pm2 start yarn --name "vm-manager" -- start
  ```
- [ ] **Save the pm2 processes** to be able to start them automatically when the
  server starts:

  ```bash
  pm2 save
  ```

- [ ] **Check if the app is running**:
  Open your browser and go to the url of your domain name (or
  subdomain) `http://your-domain.com` 🎉.

### Configure the SSL certificate

- [ ] **Generate the SSL certificate**:

  - This command will generate the SSL certificate and configure nginx to
    redirect the `http` traffic to `https`.
  - It won't work if you don't have a domain name pointing to the public IP
    address of your server (or the static IP address if you have one).
  - Here replace `vm-manager` with your domains name (or subdomains):

  ```bash
  sudo certbot --nginx -d your-domain.com
  ```

- [ ] **Check if the SSL certificate is working**:
  If you go to the url of your domain name (or subdomain), you should be
  redirected to the https version of the url.

Houra 🎉
