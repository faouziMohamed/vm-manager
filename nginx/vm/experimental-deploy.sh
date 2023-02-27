#!/usr/bin/env bash

# This script is used to deploy the vm-manager project in a web server using nginx on a virtual machine running Ubuntu (22.04 LTS)

###################################################
DOMAIN_NAME=
EMAIL=
GIT_REPO="https://github.com/faouziMohamed/vm-manager.git"
PROJECT_PATH_NAME="${HOME}/vm-manager"
DAEMON_NAME="vm-manager"
NGINX_CONFIG_FILE_PATH="${PROJECT_PATH_NAME}/nginx/vm/deploy.conf"
RECONFIGURE_SERVER="true"
VERBOSE="true"
###################################################
VERSION="1.0.0"
# Trap ctrl-c and call ctrl_c() to exit the script gracefully
function ctrl_c() {
    echo "Received SIGINT. Exiting..."
    exit 1
}

trap "ctrl_c" SIGINT
# SCRIPT ARGUMENTS PARSING

# Function to show the help message and exit the script
function show_help_message() {
  cat << EOF
Deploy the ${DAEMON_NAME} project in a web server using nginx on a virtual machine running Ubuntu (22.04 LTS) (version ${VERSION})

Usage: $0 [options] [arguments] [options] [arguments] [-q|--quiet]...
       $0  -h | --help | -v | --version

Mandatory arguments to long options are mandatory for short options too.

OPTIONS:
  -q|--quiet     Do not show any log messages
  -p|-d|--project-name|--daemon-name   The daemon name. The value should be a valid daemon name. The default value is $DAEMON_NAME
  -g|--git-repo   The git repo. The value should be a valid git repo. The default value is $GIT_REPO
  -r|--repo-dir   The repo dir. The value should be a valid repo dir. The default value is $PROJECT_PATH_NAME
  -n|--nginx   The path to the nginx config file. The value should be a valid path to the nginx config file. The default value is $NGINX_CONFIG_FILE_PATH
  -dn|--domain-name   The domain name to be used for the free ssl certificate. The value should be a valid domain name without the protocol. If not provided, the free ssl certificate will not be generated and the server will be configured to use http instead of https
  -c|--reconfigure   Reconfigure the server. The value should be either true or false. The default value is false
  -e|--email   The email to be used for the free ssl certificate. The value should be a valid email. The default value is $EMAIL. This argument is optional if the domain name is not provided and mandatory if it is provided.
  -h|--help   Show this help message and exit the script
  -v|--version   Show the script version and exit the script
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -q|--quiet)
            VERBOSE="false"
            shift # past value
            ;;
        -p|-d|--project-name|--daemon-name)
            DAEMON_NAME="$2"
            shift
            shift
            ;;
        -g|--git-repo)
            GIT_REPO="$2"
            shift
            shift
            ;;
        -r|--repo-dir)
            PROJECT_PATH_NAME="$2"
            REPO_DIR="$2"
            shift
            shift
            ;;
        -n|--nginx)
            NGINX_CONFIG_FILE_PATH="$2"
            shift
            shift
            ;;
        -dn|--domain-name)
            DOMAIN_NAME="$2"
            shift
            shift
            ;;
        -c|--reconfigure)
            RECONFIGURE_SERVER="$2"
            # make sure the value is either true or false
            if [[ $RECONFIGURE_SERVER != "true" && $RECONFIGURE_SERVER != "false" ]]; then
                echo "Invalid value for reconfigure flag. The value should be either true or false"
                echo "Use -h or --help to show the help message"
                exit 1
            fi
            shift
            shift
            ;;
        -e|--email)
            EMAIL="$2"
            shift
            shift
            ;;
        -h|--help)
            show_help_message
            exit 0
            ;;
        -v|--version)
            echo "Version ${VERSION}"
            exit 0
            ;;
        *)    # unknown option
            echo "Unknown option $1, use --help or -h to show the help message"
            exit 1
            ;;
    esac
done

# Function to log messages to a file and to the console if verbose mode is enabled or if the message is an error message.
# The first argument is the message to be logged and the second argument is the log level. The log level can be either info, warning or error. default is info

function log() {
  local message=$1
  local log_level=$2
  # default color is for info messages
  local color="\033[0;32m"
  local end_color="\033[0m"
  if [[ -z $log_level ]]; then
    log_level="info"
  fi
  if [[ $log_level == "warning" ]]; then
    color="\033[0;33m"
  elif [[ $log_level == "error" ]]; then
    color="\033[0;31m"
  fi

  #create $PROJECT_PATH_NAME/logs recursively if it doesn't exist
  mkdir -p "${PROJECT_PATH_NAME}/logs"
  local log_file="${PROJECT_PATH_NAME}/logs/deploy.log"
  # shellcheck disable=SC2155
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  local log_message="${color}[${log_level}]${end_color} [${timestamp}]: ${message}"
  echo -e "${log_message}" >> "${log_file}"
  if [[ $VERBOSE == "true" ]]; then
    echo -e "${log_message}"
  fi
}

function is_name_without_spaces() {
  local pattern=" |'"
  local daemon_name=$1
  if [[ $daemon_name =~ $pattern ]]; then
    return 1
  else
    return 0
  fi
}

function is_valid_domain_name() {
  local domain_name=$1
  local pattern="^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$"
  if [[ $domain_name =~ $pattern ]]; then
    return 0
  else
    return 1
  fi
}

function is_valid_email() {
  local email=$1
  local pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
  if [[ $email =~ $pattern ]]; then
    return 0
  else
    return 1
  fi
}

## Configuring the server for the first time
function configure_server(){
  # Configuring the server for the first time or reconfiguring the server if the reconfigure flag is set to true
  # Update the system
  log "Updating the system..."
  sudo apt update && sudo apt upgrade -y

  # install nginx certbot python3-certbot-nginx git -y
  log "Installing nginx, certbot, python3-certbot-nginx and git..." "info"
  sudo apt install nginx certbot python3-certbot-nginx git -y

  # Install cron for certbot renew command to run automatically
  log "Installing cron for certbot..." "info"
  sudo apt install cron -y

  if [[ "${RECONFIGURE_SERVER}" != "true" ]]; then return 0; fi

  # Install nodejs using nvm (node version manager)
  log "Reconfiguring the server"
  log "Installing nodejs using nvm (node version manager)..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
  export NVM_DIR="${HOME}/.nvm"

  if [ -s "${NVM_DIR}/nvm.sh" ]; then
    log "Installing globally yarn and pm2..."
    bash -l -c '. ${HOME}/.bashrc 2>/dev/null; nvm install --lts; nvm use --lts; npm install -g npm yarn pm2'
  else
    log "nvm installation failed" "error"
    exit 1
  fi

  # Configure the firewall to allow ssh, http and https
  log "Configuring the firewall to allow ssh, http and https..."
  sudo ufw allow "Nginx Full"
  sudo ufw allow ssh

}

# Configure the app
function configure_app(){
  log "Configuring the app..." "info"
  if [ ! -d "${PROJECT_PATH_NAME}" ] || [ ! -d "${PROJECT_PATH_NAME}/.git" ]; then # Check if the project directory does not exist
    log "Cloning the project, you may be asked for your git server credentials..."

    # if it's not a git repo, move the $PROJECT_PATH_NAME to $PROJECT_PATH_NAME/old
    if [ ! -d "${PROJECT_PATH_NAME}/.git" ]; then
      mkdir -p "old/${PROJECT_PATH_NAME}"
      log "Moving the ${PROJECT_PATH_NAME} to ${PROJECT_PATH_NAME}/old"
      mv "${PROJECT_PATH_NAME}" "old/${PROJECT_PATH_NAME}"
    fi

    if (git clone "${GIT_REPO}" "${PROJECT_PATH_NAME}"); then # Clone the project
      log "Project cloned successfully"
    else
      log "Failed to clone the project, exiting the script" "error"
      exit 1
    fi
  else # The project directory already exists
    cd "${PROJECT_PATH_NAME}" || (log "Failed to change directory to ${PROJECT_PATH_NAME}" "error" && exit 1)
    log "Pulling the latest changes from the remote repo..."
    if (git pull); then # Pull the latest changes from the remote repo
      log "Latest changes pulled successfully"
    else # Failed to pull the latest changes from the remote repo
      log "Failed to pull the latest changes from the remote repo, exiting the script" "error"
      exit 1
    fi
  fi

  # Copy the nginx config file to the nginx config directory
  log "Copying the nginx config file to the nginx config directory..."
  sudo cp "$NGINX_CONFIG_FILE_PATH" /etc/nginx/sites-available

  # Create a symbolic link to the nginx config file in the sites-enabled directory
  log "Creating a symbolic link to the nginx config file in the sites-enabled directory..."
  sudo ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled

  # Remove the default nginx config file
  log "Removing the default nginx config file..."
  sudo rm /etc/nginx/sites-enabled/default -f

  # Restart nginx
  log "Restarting nginx..."
#  sudo systemctl restart nginx

  # Install the project dependencies
  log "Installing the project dependencies..."
  cd "${REPO_DIR}" || (log "Failed to change directory to ${REPO_DIR}" "error" && exit 1)
  yarn install

  # Build the project
  log "Building the project..."
  yarn build
  # if the daemon is already running, stop it and delete it from the pm2 list then start it again
  if (pm2 list | grep -q "${DAEMON_NAME}"); then
    log "Stopping the daemon..."
    pm2 stop "${DAEMON_NAME}"
    log "Deleting the daemon from the pm2 list..."
    pm2 delete "${DAEMON_NAME}"
  fi

  # Start the app using pm2
  log "Starting the app " "${PROJECT_PATH_NAME}" " using pm2..."
  pm2 start yarn --name "${DAEMON_NAME}" -- start
  # Save the pm2 processes list
  log "Saving the pm2 processes list..."
  pm2 save
}

# Configure the ssl certificate using certbot for nginx and configure the cron job to renew the certificate automatically
function generate_ssl_certificate(){
  # check if the domain name and email are provided
  if [ -z "${DOMAIN_NAME}" ] || [ -z "${EMAIL}" ]
  then
      log "The domain name and email are mandatory to configure the ssl certificate, exiting gracefully..." "error"
      exit 2
  fi

  # check if the domain name is valid
  if ! is_valid_domain_name "${DOMAIN_NAME}"; then
    log "The domain name is not valid, exiting..." "error"
    exit
  fi

  # check if the email is valid
  if ! is_valid_email "${EMAIL}"; then
    log "The email is not valid, exiting..." "error"
    exit
  fi

  # Generate the ssl certificate using certbot for nginx and configure the cron job to renew the certificate automatically
  log "Generating the ssl certificate using certbot for nginx..."
  sudo certbot --nginx -d "${DOMAIN_NAME}" -m "${EMAIL}" --agree-tos --redirect --no-eff-email

  # Restart nginx
  sudo systemctl restart nginx

  # Check if the ssl certificate is generated successfully
  if [ -f "/etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem" ]; then
    log "The ssl certificate is generated successfully"
  else
    log "Failed to generate the ssl certificate, exiting..." "error"
    exit
  fi

  # Configure the cron job to renew the certificate automatically
  log "Configuring the cron job to renew the certificate automatically..."
  # Check if the cron job is already configured to renew the certificate automatically every 5 days
  if ! (crontab -l | grep -q "certbot renew"); then
    # Configure the cron job to renew the certificate automatically every 5 days
    (crontab -l ; echo "0 0 */5 * * certbot renew --quiet") | crontab -
  fi
}

# Make sure the script is not running as root
if [ "$EUID" -eq 0 ]
  then
    log "Please do not run this script as root, instead run it as a normal user with sudo privileges, exiting the script" "error"
fi



# Configure the server for the first time
printf "\n\n"
configure_server
printf "\n\n"

# Configure the app
printf "\n\n"
configure_app
printf "\n\n"

# Generate the ssl certificate using certbot for nginx and configure the cron job to renew the certificate automatically
printf "\n\n"
generate_ssl_certificate
printf "\n\n"

# Print the success message with an emoji
log "The server is configured successfully" "success 🎉"
