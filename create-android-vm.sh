#!/bin/bash

# Update the system before doing anything else
sudo apt update && sudo apt upgrade -y

# Install VirtualBox and Extension Pack in Ubuntu server 22
sudo apt install virtualbox virtualbox-ext-pack -y
# Check the version of VirtualBox
# vboxmanage --version
# OUTPUT: 6.1.38_Ubuntur153438
# Create a new virtual machine in VirtualBox, note that the cloud provider (Azure, AWS, GCP, etc.) must allow incoming
# connections on port 3388/tcp. The vm will be configured to use the port 3388 for the remote display.
VM_NAME="android9-x86"
VM_FOLDER="${HOME}/VMs"
VRAM_SIZE=128 # 128MB
RAM_SIZE=5120 # 5GiB
HDD_SIZE=51200 # 50GiB
VRDE_PORT=3388
ISO_FILE_NAME="android9-x86.iso"
ISO_FILE="${HOME}/${ISO_FILE_NAME}"

echo -e "\n\n"
echo -e "Start process to create a new virtual machine in VirtualBox"
echo -e "The VM will be created in the folder \e[1;32m${VM_FOLDER}\e[0m\n"

# Download Android x86 iso image
cd "${HOME}" || exit 1
if [ -f "${HOME}/android9-x86.iso" ]; then
  echo "The file ${HOME}/android9-x86.iso already exists, skipping the download..."
else
  echo "Downloading the Android x86 iso image..."
  ISO_URL="https://free.nchc.org.tw/osdn/android-x86/71931/android-x86-9.0-r2.iso"
  wget -O "${ISO_FILE_NAME}" "${ISO_URL}"
  echo -e "The file ${ISO_FILE_NAME} has been downloaded successfully\n"
fi


echo "Configuring the firewall to allow incoming connections on port ${VRDE_PORT}..."
# Allow the firewall to accept incoming connections on port ${VRDE_PORT}
sudo ufw allow "${VRDE_PORT}"
# configure also the firewall in the Cloud Provider (Azure, AWS, GCP, etc.) to allow incoming connections on port ${VRDE_PORT}/tcp
echo -e "\n"
mkdir -p "${VM_FOLDER}"

echo "Creating a new virtual machine in VirtualBox..."
# Create a new virtual machine, save it in the ${VM_FOLDER} and register it in VirtualBox
sudo vboxmanage createvm \
  --ostype "Linux26_64" \
  --basefolder "${VM_FOLDER}" \
  --register \
  --name "${VM_NAME}"

echo "Configuring the virtual machine:"
echo "  - Adding RAM..."
# Add RAM
sudo vboxmanage modifyvm "${VM_NAME}" \
  --memory "${RAM_SIZE}" \
  --vram "${VRAM_SIZE}"

echo "  - Adding a network adapter..."
# Add a network adapter
sudo vboxmanage modifyvm "${VM_NAME}" \
  --nic1 nat

echo "  - Creating a virtual hard disk with SATA controller and variant Standard..."
# Create a virtual hard disk with NVMe controller and variant Standard
sudo vboxmanage createhd \
  --filename "${VM_FOLDER}/${VM_NAME}/${VM_NAME}.vdi" \
  --size "${HDD_SIZE}" --format VDI \
  --variant Standard

echo "  - Attaching the virtual hard disk to the VM with SATA controller..."
# Attach the virtual hard disk to the VM with NVMe controller and set it as bootable
sudo vboxmanage storagectl "${VM_NAME}" \
  --name "SATA Controller" \
  --add sata

echo "  - Attaching the virtual hard disk to the SATA controller..."
# Attach the virtual hard disk to the NVMe controller
sudo vboxmanage storageattach "${VM_NAME}" \
  --storagectl "SATA Controller" \
  --port 0 --device 0 \
  --type hdd \
  --medium "${VM_FOLDER}/${VM_NAME}/${VM_NAME}.vdi" # set the path to the VDI file to attach as the storage medium

echo "  - Attaching the ISO file to the VM with SATA controller..."
sudo vboxmanage storageattach "${VM_NAME}" \
    --storagectl "SATA Controller" \
    --port 0 --device 0 \
    --type hdd \
    --medium "${VM_FOLDER}/${VM_NAME}/${VM_NAME}.vdi" # set the path to the VDI file to attach as the storage medium

echo "  - Attaching the ISO file to the VM with SATA controller..."
sudo vboxmanage storageattach "${VM_NAME}" \
  --storagectl "SATA Controller" \
  --port 0 --device 0 \
  --type dvddrive \
  --medium "${ISO_FILE}" # Specify the path to the ISO file to attach

echo "  - Configuring the video, remote display, and audio settings..."
# Configure video, remote display, and audio settings
sudo vboxmanage modifyvm "${VM_NAME}" \
  --graphicscontroller vboxsvga \
  --vrde on \
  --vrdeport $VRDE_PORT \
  --audioin on \
  --audioout on

echo "Starting the VM..."
# Start the VM
sudo vboxmanage startvm "${VM_NAME}" --type headless
VM_IP="$(curl ifconfig.me)"
echo -e "The VM is running in headless mode, you can connect to it using the remote desktop client (e.g. Remmina, Microsoft Remote Desktop, etc.) at \e[1;32m$VM_IP:$VRDE_PORT\e[0m"

# Stop the VM
# sudo vboxmanage controlvm "${VM_NAME}" poweroff

# Delete the VM
# sudo vboxmanage unregistervm "${VM_NAME}" --delete
