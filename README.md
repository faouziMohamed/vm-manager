9# Azure Vm Manager

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Steps to configure the VM to run the android x86 (graphical interface)

The steps must be done in the following order:

- Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
  and [VirtualBox Extension Pack](https://download.virtualbox.org/virtualbox/6.1.26/Oracle_VM_VirtualBox_Extension_Pack-6.1.26.vbox-extpack)
- [ Only on windows ]
  Install [Microsoft Visual C++ 2019 Redistributable x64](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2015-2017-2019-and-2022) (
  required by VirtualBox)

- Download [Android x86](https://www.android-x86.org/download) iso image (~900MB)

### Create a new virtual machine in VirtualBox

- Create a new virtual machine in VirtualBox
  - Type: Linux
  - Version: Linux 2.6 / 3.x / 4.x (64-bit) or Ubuntu (64-bit)
  - Memory: minimum 5GiB
  - Hard Disk: Create a virtual hard disk now
    - VDI (VirtualBox Disk Image) or VHD (Virtual Hard Disk) can be used in Azure
    - Dynamically allocated
    - 20GB
  - Configure VM Display
    - Video Memory: 128MB
    - Graphics Controller: VBoxSVGA (The default is VMSVGA, which is not supported by the Android x86)
  - Allow Remote Desktop Connection
    - Settings -> Display -> Remote Display -> Enable Server
    - Server Port: 3388 (to avoid conflict with the default port 3389 used by the host machine)

## Steps to configure the VM to run the android x86 (headless mode) in Ubuntu server 22

- Update the system before doing anything else
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- Install VirtualBox and Extension Pack in Ubuntu server 22
  ```bash
  sudo apt install virtualbox virtualbox-ext-pack -y
  # Check the version of VirtualBox
  vboxmanage --version
  # OUTPUT: 6.1.38_Ubuntur153438
  ```
- Download Android x86 iso image
  ```bash
  cd "$HOME"
  ISO_URL="https://free.nchc.org.tw/osdn/android-x86/71931/android-x86-9.0-r2.iso"
  ISO_FILE_NAME="android9-x86.iso"
  wget -O $ISO_FILE_NAME $ISO_URL
  ```
- Create a new virtual machine in VirtualBox, note that the cloud provider (Azure, AWS, GCP, etc.) must allow incoming
  connections on port 3388/tcp. The vm will be configured to use the port 3388 for the remote display.
  ```bash
  VM_NAME="android9-x86"
  VM_FOLDER="$HOME/VMs"
  VRAM_SIZE=128 # 128MB
  RAM_SIZE=5120 # 5GiB
  HDD_SIZE=51200 # 50GiB
  VRDE_PORT=3388 
  ISO_FILE="$HOME/$ISO_FILE_NAME"
  # Graphics Controller VBoxSVGA
  # Remote Display Enable Server, Server Port 3388
  # Allow audio input and output
  
  echo "Configuring the firewall to allow incoming connections on port $VRDE_PORT..."
  # Allow the firewall to accept incoming connections on port $VRDE_PORT
  sudo ufw allow "$VRDE_PORT"
  # configure also the firewall in the Cloud Provider (Azure, AWS, GCP, etc.) to allow incoming connections on port $VRDE_PORT/tcp
  
  mkdir -p $VM_FOLDER
  
  echo "Creating a new virtual machine in VirtualBox..."
  # Create a new virtual machine, save it in the VM_FOLDER and register it in VirtualBox
  sudo vboxmanage createvm \
    --ostype "Linux26_64" \
    --basefolder $VM_FOLDER \
    --register \
    --name $VM_NAME 
  
  echo "Configuring the virtual machine:"
  echo "  - Adding RAM..."
  # Add RAM
  sudo vboxmanage modifyvm $VM_NAME \
    --memory $RAM_SIZE \
    --vram $VRAM_SIZE
  
  echo "  - Adding a network adapter..."
  # Add a network adapter
  sudo vboxmanage modifyvm "$VM_NAME" \
    --nic1 nat
  
  echo "  - Creating a virtual hard disk with SATA controller and variant Standard..."
  # Create a virtual hard disk with NVMe controller and variant Standard
  sudo vboxmanage createhd \
    --filename $VM_FOLDER/$VM_NAME/$VM_NAME.vdi \
    --size $HDD_SIZE --format VDI \
    --variant Standard 
  
  echo "  - Attaching the virtual hard disk to the VM with SATA controller..."
  # Attach the virtual hard disk to the VM with NVMe controller and set it as bootable
  sudo vboxmanage storagectl $VM_NAME \
    --name "SATA Controller" \
    --add sata
  
  echo "  - Attaching the virtual hard disk to the SATA controller..."
  # Attach the virtual hard disk to the NVMe controller
  sudo vboxmanage storageattach $VM_NAME \
    --storagectl "SATA Controller" \
    --port 0 --device 0 \
    --type hdd \
    --medium $VM_FOLDER/$VM_NAME/$VM_NAME.vdi # set the path to the VDI file to attach as the storage medium
  
  echo "  - Attaching the ISO file to the VM with SATA controller..."
  sudo vboxmanage storageattach $VM_NAME \
    --storagectl "SATA Controller" \
    --port 0 --device 0 \
    --type dvddrive \
    --medium $ISO_FILE # Specify the path to the ISO file to attach
  
  echo "  - Configuring the video, remote display, and audio settings..."
  # Configure video, remote display, and audio settings
  sudo vboxmanage modifyvm $VM_NAME \
    --graphicscontroller vboxsvga \
    --vrde on \
    --vrdeport $VRDE_PORT \
    --audioin on \
    --audioout on

  
  echo "Starting the VM..."
  # Start the VM
  sudo vboxmanage startvm $VM_NAME --type headless
  VM_IP="$(curl ifconfig.me)"
  echo -e "The VM is running in headless mode, you can connect to it using the remote desktop client (e.g. Remmina, Microsoft Remote Desktop, etc.) at \e[1;32m$VM_IP:$VRDE_PORT\e[0m"
  
  # Stop the VM
  # sudo vboxmanage controlvm $VM_NAME poweroff
  
  # Delete the VM
  # sudo vboxmanage unregistervm $VM_NAME --delete
  ```
